import * as pdfjsLib from 'pdfjs-dist';

// Configurar worker do PDF.js (necessário no browser)
const workerSrc =
  typeof window !== 'undefined' && window.location
    ? `${window.location.origin}/pdf.worker.min.mjs`
    : '';
if (workerSrc) {
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = workerSrc;
}

/**
 * Extrai todo o texto de um arquivo PDF (ex.: DANFE).
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const textParts: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent({
      includeMarkedContent: true,
    });
    // Ordenar por posição (y decrescente, depois x) para manter ordem de leitura
    const items = textContent.items as Array<{ str: string; transform?: number[] }>;
    const withPos = items
      .filter((item) => 'str' in item && item.str)
      .map((item) => {
        const t = (item as any).transform;
        const y = t && t[5] != null ? t[5] : 0;
        const x = t && t[4] != null ? t[4] : 0;
        return { str: (item as any).str, y, x };
      });
    withPos.sort((a, b) => {
      const dy = b.y - a.y;
      if (Math.abs(dy) > 3) return dy;
      return a.x - b.x;
    });
    const pageText = withPos.map((i) => i.str).join(' ');
    textParts.push(pageText);
  }

  return textParts.join('\n');
}

/** Resultado do parse do DANFE para enviar ao backend (mesma forma que XML → JSON). */
export interface DanfeParsed {
  nfeProc?: {
    NFe?: { infNFe?: any };
    protNFe?: { infProt?: { chNFe?: string } };
  };
  /** Estrutura compatível com CreatePurchaseInvoiceUseCase (xmlData). */
  xmlData: any;
}

/**
 * Tenta extrair dados de um DANFE (PDF) a partir do texto extraído.
 * Retorna um objeto no formato esperado pelo backend (xmlData).
 */
export function parseDanfeFromText(text: string): DanfeParsed {
  const normalized = text.replace(/\s+/g, ' ').trim();

  // Chave de acesso: 44 dígitos (pode ter espaços ou pontos a cada 4)
  const chaveMatch = normalized.match(/\b(\d[\d.\s]{42,43}\d)\b/);
  let chave = '';
  if (chaveMatch) {
    chave = chaveMatch[1].replace(/\D/g, '');
    if (chave.length !== 44) chave = '';
  }
  if (!chave && /^\d{44}$/.test(normalized.replace(/\D/g, '').slice(0, 44))) {
    const onlyDigits = normalized.replace(/\D/g, '');
    const idx = onlyDigits.search(/\d{44}/);
    if (idx !== -1) chave = onlyDigits.slice(idx, idx + 44);
  }
  if (!chave) {
    const fortyFour = normalized.match(/(\d{2}\.\d{3}\.\d{3}\.\d{3}\.\d{3}\.\d{3}\.\d{4}\.\d{4}\.\d{2})/);
    if (fortyFour) chave = fortyFour[1].replace(/\D/g, '');
  }

  // CNPJ: XX.XXX.XXX/XXXX-XX
  const cnpjMatch = normalized.match(/(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/);
  const cnpj = cnpjMatch ? cnpjMatch[1].replace(/\D/g, '') : '';

  // Data emissão: DD/MM/YYYY ou DD-MM-YYYY
  const dataMatch = normalized.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
  let dhEmi = '';
  if (dataMatch) {
    dhEmi = `${dataMatch[3]}-${dataMatch[2]}-${dataMatch[1]}T12:00:00-03:00`;
  } else {
    dhEmi = new Date().toISOString();
  }

  // Número e série (comum em DANFE: "Nº 123456" e "Série 1" ou "Série 001")
  let nNF = '';
      let serie = '1';
  const numNotaMatch = normalized.match(/(?:N[ºo°]?|Nota|Número)\s*[:\s]*(\d+)/i);
  if (numNotaMatch) nNF = numNotaMatch[1];
  const serieMatch = normalized.match(/S[ée]rie\s*[:\s]*(\d+)/i);
  if (serieMatch) serie = serieMatch[1];

  // Nome do emitente: geralmente antes do CNPJ, linha com texto longo
  let xNome = '';
  const beforeCnpj = cnpjMatch ? normalized.slice(0, normalized.indexOf(cnpjMatch[0])).trim() : '';
  const lines = beforeCnpj.split(/\s{2,}|\n/).filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line.length > 5 && line.length < 120 && !/^\d+$/.test(line) && !line.includes('Chave')) {
      xNome = line;
      break;
    }
  }
  if (!xNome) xNome = 'Emitente (extraído do PDF)';

  // Tabela de itens: procurar padrões de quantidade, valor unitário e total
  const det: any[] = [];
  const valorTotalMatch = normalized.match(/(?:Valor\s+Total|Total\s+da\s+Nota|vNF)[\s:]*R?\$?\s*([\d.,]+)/i);
  const vNF = valorTotalMatch ? parseFloat(valorTotalMatch[1].replace(/\./g, '').replace(',', '.')) : 0;

  // Tentar linhas que parecem item: descrição seguida de números (qtd, unit, total)
  const possibleRows = normalized.match(/\d+\s+[\w\s]+?(?=\s+\d[\d.,]*\s+\d[\d.,]*\s+\d[\d.,]*)/g);
  if (possibleRows && possibleRows.length > 0) {
    let nItem = 0;
    for (const row of possibleRows) {
      const numParts = row.trim().split(/\s+/);
      const lastNumbers = numParts.filter((p) => /^[\d.,]+$/.test(p));
      if (lastNumbers.length >= 3) {
        nItem++;
        const qtd = parseFloat(lastNumbers[0].replace(',', '.'));
        const vUnCom = parseFloat(lastNumbers[1].replace(/\./g, '').replace(',', '.'));
        const vProd = parseFloat(lastNumbers[2].replace(/\./g, '').replace(',', '.'));
        const desc = numParts.slice(0, numParts.length - lastNumbers.length).join(' ').trim();
        if (qtd > 0 && vProd >= 0) {
          det.push({
            $: { nItem: String(nItem) },
            prod: {
              cEAN: 'SEM GTIN',
              cProd: String(nItem),
              xProd: desc || `Item ${nItem}`,
              NCM: '',
              CFOP: '',
              uCom: 'UN',
              qCom: String(qtd),
              vUnCom: String(vUnCom),
              vProd: String(vProd),
              vDesc: '0',
            },
            imposto: { ICMS: {} },
          });
        }
      }
    }
  }

  // Se não encontrou itens pelo padrão, criar um item único com o total
  if (det.length === 0 && vNF > 0) {
    det.push({
      $: { nItem: '1' },
      prod: {
        cEAN: 'SEM GTIN',
        cProd: '1',
        xProd: 'Produto (extraído do PDF - conferir itens)',
        NCM: '',
        CFOP: '',
        uCom: 'UN',
        qCom: '1',
        vUnCom: String(vNF),
        vProd: String(vNF),
        vDesc: '0',
      },
      imposto: { ICMS: {} },
    });
  }

  const ide = {
    nNF: nNF || '0',
    serie: serie,
    mod: '55',
    dhEmi,
    dhSaiEnt: dhEmi,
    natOp: 'Entrada',
  };

  const emit = {
    CNPJ: cnpj,
    xNome,
    xFant: xNome,
    enderEmit: {
      xLgr: '',
      nro: '',
      xBairro: '',
      xMun: '',
      UF: '',
    },
  };

  const infNFe: any = {
    ide,
    emit,
    dest: {},
    total: {
      ICMSTot: {
        vNF: String(vNF),
        vTotTrib: '0',
      },
    },
    det: det.length ? det : [
      {
        $: { nItem: '1' },
        prod: {
          cEAN: 'SEM GTIN',
          cProd: '1',
          xProd: 'Item único (PDF)',
          NCM: '',
          CFOP: '',
          uCom: 'UN',
          qCom: '1',
          vUnCom: '0',
          vProd: '0',
          vDesc: '0',
        },
        imposto: { ICMS: {} },
      },
    ],
  };
  if (chave) {
    infNFe.$ = { Id: `NFe${chave}` };
    infNFe.$Id = `NFe${chave}`;
  }

  const xmlData = {
    nfeProc: {
      NFe: { infNFe },
      protNFe: {
        infProt: { chNFe: chave },
      },
    },
  };

  return {
    nfeProc: xmlData.nfeProc,
    xmlData,
  };
}

/**
 * Extrai texto do PDF e retorna o JSON no formato esperado pelo backend (xmlData).
 */
export async function pdfToNfeJson(file: File): Promise<any> {
  const text = await extractTextFromPdf(file);
  const parsed = parseDanfeFromText(text);
  if (!parsed.xmlData?.nfeProc?.protNFe?.infProt?.chNFe) {
    throw new Error('Chave de acesso da NFe não encontrada no PDF. Verifique se o arquivo é um DANFE válido.');
  }
  return parsed.xmlData;
}

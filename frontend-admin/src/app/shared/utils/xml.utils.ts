// src/app/utils/xml-utils.ts
import { parseString } from 'xml2js';

export class XmlUtils {
  static xmlToJson(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
      parseString(xml, { explicitArray: false }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  // Organiza os dados de uma NF-e (modelo simplificado)
  static beautifyNFe(nfeRawJson: any): any {
    const infNFe = nfeRawJson?.NFe?.infNFe;

    if (!infNFe) return null;

    const ide = infNFe.ide || {};
    const emit = infNFe.emit || {};
    const dest = infNFe.dest || {};
    const total = infNFe.total?.ICMSTot || {};
    const transp = infNFe.transp || {};
    const det = Array.isArray(infNFe.det) ? infNFe.det : [infNFe.det];

    return {
      ide: {
        numero: ide.nNF,
        serie: ide.serie,
        dataEmissao: ide.dEmi,
        tipoOperacao: ide.natOp,
        modelo: ide.mod
      },
      emitente: {
        nome: emit.xNome,
        cnpj: emit.CNPJ,
        endereco: emit.enderEmit
      },
      destinatario: {
        nome: dest.xNome,
        cnpj: dest.CNPJ,
        endereco: dest.enderDest
      },
      produtos: det.map((item: any) => {
        const prod = item.prod;
        return {
          numeroItem: item.$?.nItem,
          descricao: prod.xProd,
          quantidade: prod.qCom,
          unidade: prod.uCom,
          valorUnitario: prod.vUnCom,
          valorTotal: prod.vProd,
          cfop: prod.CFOP
        };
      }),
      totais: {
        valorProdutos: total.vProd,
        valorNF: total.vNF,
        valorICMS: total.vICMS,
        valorPIS: total.vPIS,
        valorCOFINS: total.vCOFINS
      },
      transporte: {
        modalidadeFrete: transp.modFrete,
        transportadora: transp.transporta
      }
    };
  }
}

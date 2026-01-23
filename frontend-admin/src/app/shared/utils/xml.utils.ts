import { XMLParser } from 'fast-xml-parser';

export class XmlUtils {
  static xmlToJson(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: '$',
          textNodeName: '#text',
          parseAttributeValue: true,
          parseTagValue: true,
          trimValues: true,
          processEntities: true,
          isArray: (name, jpath) => {
            // Mantém arrays para elementos que podem ter múltiplas ocorrências
            if (
              jpath === 'nfeProc.NFe.infNFe.det' ||
              jpath === 'NFe.infNFe.det'
            )
              return true;
            return false;
          },
        });
        const result = parser.parse(xml);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Organiza os dados de uma NF-e (modelo simplificado)
  static beautifyNFe(
    nfeRawJson: any,
    nfModel = '55',
    stockProducts: any[]
  ): any {
    switch (nfModel) {
      // case '01': // Nota Fiscal (Mod. 01)
      //   return this.beautifyNFeMod01(infNFe);
      // case '04': // Nota Fiscal Produtor (Mod. 04)
      //   return this.beautifyNFeMod04(infNFe);
      case '55': // Nota Fiscal Eletrônica (Mod. 55)
        return this.beautifyNFeMod55(nfeRawJson, stockProducts);
      default:
        return this.beautifyNFeMod55(nfeRawJson, stockProducts);
    }
  }

  static beautifyNFeMod55(nfeRawJson: any, stockProducts: any[]): any {
    const infNFe = nfeRawJson?.NFe?.infNFe || nfeRawJson?.nfeProc?.NFe?.infNFe;

    if (!infNFe) return null;

    const ide = infNFe?.ide || {};
    const emit = infNFe?.emit || {};
    const dest = infNFe?.dest || {};
    const total = infNFe?.total?.ICMSTot || {};
    const transp = infNFe?.transp || {};
    const det = Array.isArray(infNFe?.det) ? infNFe.det : [infNFe?.det];

    let products = det.map((item: any) => {
      const prod = item?.prod;
      const imposto = item?.imposto;
      
      // Extrair dados do ICMS
      const icms = imposto?.ICMS || {};
      const icmsType = Object.keys(icms).find(key => key.startsWith('ICMS')) || '';
      const icmsData = icms[icmsType] || {};
      
      // Extrair dados do IPI
      const ipi = imposto?.IPI || {};
      const ipiTrib = ipi?.IPITrib || {};

      return {
        itemNumber: item?.$?.nItem,
        sku: prod?.cProd,
        ean: prod?.cEAN,
        description: prod?.xProd,
        ncm: prod?.NCM?.toString(),
        cst: icmsData?.CST?.toString() || icmsData?.CSOSN?.toString(),
        cfop: prod?.CFOP?.toString(),
        // Comercial
        unit: prod?.uCom,
        quantity: parseFloat(prod?.qCom || 0),
        unitValue: parseFloat(prod?.vUnCom || 0),
        discount: prod?.vDesc ? parseFloat(prod.vDesc.toString()) : undefined,
        totalValue: parseFloat(prod?.vProd || 0),
        // ICMS
        icmsBase: icmsData?.vBC ? parseFloat(icmsData.vBC.toString()).toFixed(2) : undefined,
        icmsValue: icmsData?.vICMS ? parseFloat(icmsData.vICMS.toString()).toFixed(2) : undefined,
        icmsRate: icmsData?.pICMS ? parseFloat(icmsData.pICMS.toString()) : undefined, // Já vem como percentual
        // ICMS ST
        icmsStBase: icmsData?.vBCST ? parseFloat(icmsData.vBCST.toString()).toFixed(2) : undefined,
        icmsStValue: icmsData?.vICMSST ? parseFloat(icmsData.vICMSST.toString()).toFixed(2) : undefined,
        // IPI
        ipiValue: ipiTrib?.vIPI ? parseFloat(ipiTrib.vIPI.toString()).toFixed(2) : undefined,
        ipiRate: ipiTrib?.pIPI ? parseFloat(ipiTrib.pIPI.toString()) : undefined, // Já vem como percentual
        // Valores calculados (unitários)
        unitCost: parseFloat(prod?.vUnCom || 0).toFixed(2), // Valor custo = valor unitário
        unitTotalWithTax: (() => {
          const unitPrice = parseFloat(prod?.vUnCom || 0);
          const stUnit = icmsData?.vICMSST ? parseFloat(icmsData.vICMSST.toString()) / parseFloat(prod?.qCom || 1) : 0;
          return (unitPrice + stUnit).toFixed(2);
        })(),
        // Valores calculados (totais)
        totalCost: (() => {
          const unitPrice = parseFloat(prod?.vUnCom || 0);
          const quantity = parseFloat(prod?.qCom || 0);
          return (unitPrice * quantity).toFixed(2);
        })(),
        totalWithTax: (() => {
          const unitPrice = parseFloat(prod?.vUnCom || 0);
          const quantity = parseFloat(prod?.qCom || 0);
          const stTotal = icmsData?.vICMSST ? parseFloat(icmsData.vICMSST.toString()) : 0;
          return (unitPrice * quantity + stTotal).toFixed(2);
        })(),
        // Tributação (mantido para compatibilidade)
        eanTrib: prod?.cEANTrib,
        unitTrib: prod?.uTrib,
        quantityTrib: prod?.qTrib,
        unitValueTrib: prod?.vUnTrib,
        indTot: prod?.indTot,
        // Impostos (mantido para compatibilidade)
        taxes: {
          totalTaxValue: imposto?.vTotTrib,
          icms: imposto?.ICMS,
          ipi: imposto?.IPI,
          pis: imposto?.PIS,
          cofins: imposto?.COFINS,
        },
      };
    });

    products = XmlUtils.productInStockValidation(products, stockProducts);

    return {
      identification: {
        number: ide?.nNF,
        series: ide?.serie,
        issueDate: ide?.dhEmi || ide?.dEmi || ide?.dhSaiEnt,
        operationType: ide?.natOp,
        model: ide?.mod,
      },
      issuer: {
        name: emit?.xNome,
        cnpj: emit?.CNPJ,
        address: {
          street: emit?.enderEmit?.xLgr,
          number: emit?.enderEmit?.nro,
          complement: emit?.enderEmit?.xCpl,
          neighborhood: emit?.enderEmit?.xBairro,
          cityCode: emit?.enderEmit?.cMun,
          city: emit?.enderEmit?.xMun,
          state: emit?.enderEmit?.UF,
          postalCode: emit?.enderEmit?.CEP,
          countryCode: emit?.enderEmit?.cPais, // Código do Brasil
          country: emit?.enderEmit?.xPais,
          phone: emit?.enderEmit?.fone,
        },
      },
      recipient: {
        name: dest?.xNome,
        cnpj: dest?.CNPJ,
        address: {
          street: dest?.enderDest?.xLgr,
          number: dest?.enderDest?.nro,
          complement: dest?.enderDest?.xCpl,
          neighborhood: dest?.enderDest?.xBairro,
          cityCode: dest?.enderDest?.cMun,
          city: dest?.enderDest?.xMun,
          state: dest?.enderDest?.UF,
          postalCode: dest?.enderDest?.CEP,
          countryCode: dest?.enderDest?.cPais, // Código do Brasil
          country: dest?.enderDest?.xPais,
          phone: dest?.enderDest?.fone,
        },
      },
      products,
      totals: {
        productValue: total?.vProd,
        invoiceValue: total?.vNF,
        icmsValue: total?.vICMS,
        pisValue: total?.vPIS,
        cofinsValue: total?.vCOFINS,
      },
      transportation: {
        freightMode: transp?.modFrete,
        carrier: transp?.transporta,
      },
    };
  }

  static productInStockValidation(productsXML: any[], stockProducts: any[]) {
    // Se não houver produtos no estoque para validar, marca todos como 'found'
    // pois serão criados automaticamente pelo backend
    if (!stockProducts || stockProducts.length === 0) {
      return productsXML.map(product => ({
        ...product,
        status: 'found', // Marca como encontrado pois será criado automaticamente
      }));
    }
    
    return productsXML.map(product => {
      const hasSameEan = stockProducts.some(item => item.ean === product.ean);
      const hasSameSku = stockProducts.some(item => item.sku === product.sku);
      const status = hasSameEan || hasSameSku ? 'found' : 'not-found';
      return {
        ...product,
        status: status,
      };
    });
  }
}

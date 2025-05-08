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
    const infNFe = nfeRawJson?.NFe?.infNFe || nfeRawJson?.nfeProc?.NFe?.infNFe;

    if (!infNFe) return null;

    const ide = infNFe.ide || {};
    const emit = infNFe.emit || {};
    const dest = infNFe.dest || {};
    const total = infNFe.total?.ICMSTot || {};
    const transp = infNFe.transp || {};
    const det = Array.isArray(infNFe.det) ? infNFe.det : [infNFe.det];

    return {
      identification: {
        number: ide.nNF,
        series: ide.serie,
        issueDate: ide.dEmi,
        operationType: ide.natOp,
        model: ide.mod,
      },
      issuer: {
        name: emit.xNome,
        cnpj: emit.CNPJ,
        address: emit.enderEmit,
      },
      recipient: {
        name: dest.xNome,
        cnpj: dest.CNPJ,
        address: dest.enderDest,
      },
      products: det.map((item: any) => {
        const prod = item.prod;
        return {
          itemNumber: item.$?.nItem,
          description: prod.xProd,
          quantity: prod.qCom,
          unit: prod.uCom,
          unitValue: prod.vUnCom,
          totalValue: prod.vProd,
          cfop: prod.CFOP,
        };
      }),
      totals: {
        productValue: total.vProd,
        invoiceValue: total.vNF,
        icmsValue: total.vICMS,
        pisValue: total.vPIS,
        cofinsValue: total.vCOFINS,
      },
      transportation: {
        freightMode: transp.modFrete,
        carrier: transp.transporta,
      },
    };
  }
}
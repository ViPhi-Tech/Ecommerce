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

    const ide = infNFe?.ide || {};
    const emit = infNFe?.emit || {};
    const dest = infNFe?.dest || {};
    const total = infNFe?.total?.ICMSTot || {};
    const transp = infNFe?.transp || {};
    const det = Array.isArray(infNFe?.det) ? infNFe.det : [infNFe?.det];

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
      products: det.map((item: any) => {
        const prod = item?.prod;
        return {
          itemNumber: item?.$?.nItem,
          description: prod?.xProd,
          quantity: prod?.qCom,
          unit: prod?.uCom,
          unitValue: prod?.vUnCom,
          totalValue: prod?.vProd,
          cfop: prod?.CFOP,
        };
      }),
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
}

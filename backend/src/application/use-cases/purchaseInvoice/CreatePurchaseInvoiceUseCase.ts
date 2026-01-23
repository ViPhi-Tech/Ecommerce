import { IPurchaseInvoiceRepository } from '../../../domain/repositories/IPurchaseInvoiceRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { ISupplierRepository } from '../../../domain/repositories/ISupplierRepository';
import { ITransactionRunner } from '../../../domain/repositories/ITransactionRunner';
import { ITransactionClient } from '../../../domain/repositories/ITransactionClient';
import { PurchaseInvoice } from '../../../domain/entities/PurchaseInvoice';
import { PurchaseInvoiceItem } from '../../../domain/entities/PurchaseInvoiceItem';
import { CreatePurchaseInvoiceInput } from '../../dto/purchaseInvoice/PurchaseInvoiceDTOs';
import { Prisma } from '../../../infrastructure/database/prismaClient';

type PurchaseInvoiceRepositoryFactory = (tx: ITransactionClient) => IPurchaseInvoiceRepository;
type ProductRepositoryFactory = (tx: ITransactionClient) => IProductRepository;

export class CreatePurchaseInvoiceUseCase {
  constructor(
    private transactionRunner: ITransactionRunner,
    private purchaseInvoiceRepositoryFactory: PurchaseInvoiceRepositoryFactory,
    private productRepositoryFactory: ProductRepositoryFactory,
    private supplierRepository: ISupplierRepository
  ) {}

  async execute(data: CreatePurchaseInvoiceInput): Promise<PurchaseInvoice> {
    return this.transactionRunner.run(async (tx) => {
      const purchaseInvoiceRepository = this.purchaseInvoiceRepositoryFactory(tx);
      const productRepository = this.productRepositoryFactory(tx);

      // Extrair dados do XML
      const xmlData = data.xmlData;
      const nfeProc = xmlData.nfeProc || xmlData;
      const nfe = nfeProc.NFe || nfeProc;
      const infNFe = nfe.infNFe || nfe;
      const protNFe = nfeProc.protNFe || {};

      // Extrair dados principais da nota
      const ide = infNFe.ide || {};
      const emit = infNFe.emit || {};
      const total = infNFe.total || {};
      const icmsTot = total.ICMSTot || {};
      
      // Garantir que det é um array
      const det = Array.isArray(infNFe.det) ? infNFe.det : (infNFe.det ? [infNFe.det] : []);

      // Extrair chave de acesso
      let chNFe = protNFe.infProt?.chNFe?.toString() || '';
      
      if (!chNFe && infNFe.$Id) {
        // Extrair chave de acesso do ID da NFe (formato: NFe41251106296130000108550010004875691490256908)
        chNFe = infNFe.$Id.toString().replace('NFe', '');
      }
      
      if (!chNFe) {
        throw new Error('Chave de acesso da NFe não encontrada');
      }

      // Verificar se a nota já existe
      const existingInvoice = await purchaseInvoiceRepository.findByAccessKey(chNFe);
      if (existingInvoice) {
        throw new Error('Nota fiscal já cadastrada');
      }

      // Buscar ou criar fornecedor pelo CNPJ
      const cnpj = emit.CNPJ?.toString() || '';
      if (!cnpj) {
        throw new Error('CNPJ do emitente não encontrado');
      }

      let supplier = await this.supplierRepository.findByCnpj(cnpj);
      
      if (!supplier) {
        // Criar fornecedor se não existir
        const enderEmit = emit.enderEmit || {};
        const address = `${enderEmit.xLgr || ''}, ${enderEmit.nro || ''} - ${enderEmit.xBairro || ''}, ${enderEmit.xMun || ''} - ${enderEmit.UF || ''}`;
        
        supplier = await this.supplierRepository.create({
          tradeName: emit.xFant || emit.xNome || '',
          legalName: emit.xNome || '',
          cnpj: cnpj,
          address: address.trim(),
          email: null,
          phone: null,
        });
      }

      // Preparar dados da nota fiscal
      const issueDate = new Date(ide.dhEmi || ide.dhSaiEnt || new Date());
      const entryDate = new Date(ide.dhSaiEnt || ide.dhEmi || new Date());
      
      const purchaseInvoiceData: PurchaseInvoice = {
        accessKey: chNFe,
        number: ide.nNF?.toString() || '',
        series: ide.serie?.toString() || '',
        model: ide.mod || 55,
        issueDate: issueDate,
        entryDate: entryDate,
        totalAmount: parseFloat(icmsTot.vNF?.toString() || '0'),
        totalTax: parseFloat(icmsTot.vTotTrib?.toString() || '0'),
        xmlRaw: xmlData,
        protocol: protNFe.infProt || {},
        supplierId: supplier.id!,
      };

      // Criar nota fiscal
      const purchaseInvoice = await purchaseInvoiceRepository.create(purchaseInvoiceData);

      // Processar itens
      const items: PurchaseInvoiceItem[] = [];
      const stockMovements: Array<{
        stockId: number;
        quantity: number;
        type: 'IN';
        unitCost: number;
        invoiceNumber: string;
        icms: number | null;
        st: number;
      }> = [];

      for (const item of det) {
        const prod = item.prod || {};
        const imposto = item.imposto || {};
        
        // Extrair EAN e validar
        let ean = prod.cEAN?.toString() || prod.cEANTrib?.toString() || '';
        // Se EAN for inválido, deixar vazio
        if (!ean || ean === '0' || ean === 'SEM GTIN' || ean.trim() === '') {
          ean = '0'; // Valor padrão do Prisma
        }
        
        const quantity = parseFloat(prod.qCom?.toString() || '0');
        const unitPrice = parseFloat(prod.vUnCom?.toString() || '0');
        const totalAmount = parseFloat(prod.vProd?.toString() || '0');
        const discount = parseFloat(prod.vDesc?.toString() || '0') || null;

        // Extrair dados do ICMS
        const icms = imposto.ICMS || {};
        const icmsType = Object.keys(icms)[0] || '';
        const icmsData = icms[icmsType] || {};
        
        // Extrair valores totais de ICMS e ST (Substituição Tributária)
        const icmsTotalValue = this.extractICMSValue(imposto);
        const stTotalValue = this.extractSTValue(imposto);
        
        // Calcular valores unitários das tributações
        const icmsUnitValue = quantity > 0 ? icmsTotalValue / quantity : 0;
        const stUnitValue = quantity > 0 ? stTotalValue / quantity : 0;
        
        // Calcular finalPrice = unitPrice + ST unitário (sem ICMS)
        const finalPrice = unitPrice + stUnitValue;
        
        // Extrair dados fiscais detalhados
        const code = prod.cProd?.toString() || null;
        const cst = icmsData.CST?.toString() || icmsData.CSOSN?.toString() || null;
        const unit = prod.uCom || null;
        const icmsBase = icmsData.vBC ? parseFloat(icmsData.vBC.toString()) : null;
        const icmsValue = icmsData.vICMS ? parseFloat(icmsData.vICMS.toString()) : null;
        const icmsRate = icmsData.pICMS ? parseFloat(icmsData.pICMS.toString()) : null;
        const icmsStBase = icmsData.vBCST ? parseFloat(icmsData.vBCST.toString()) : null;
        const icmsStValue = icmsData.vICMSST ? parseFloat(icmsData.vICMSST.toString()) : null;
        
        // Extrair dados do IPI
        const ipi = imposto.IPI || {};
        const ipiTrib = ipi.IPITrib || {};
        const ipiValue = ipiTrib.vIPI ? parseFloat(ipiTrib.vIPI.toString()) : null;
        const ipiRate = ipiTrib.pIPI ? parseFloat(ipiTrib.pIPI.toString()) : null;
        
        // Calcular valores unitários
        const unitCost = unitPrice; // Valor custo unitário
        const unitTotalWithTax = finalPrice; // Valor unitário com tributo = unitPrice + ST (sem ICMS)
        
        // Calcular valores totais
        const totalCost = unitCost * quantity; // Valor total do custo
        const totalWithTax = unitTotalWithTax * quantity; // Valor total com tributo

        // Buscar produto por EAN ou criar se não existir
        let productId: number | null = null;
        let product = null;
        
        // IMPORTANTE: Se EAN for "0" ou inválido, NÃO buscar por EAN para evitar conflitos
        // Produtos sem EAN devem ser identificados apenas por SKU
        if (ean && ean !== '0') {
          product = await productRepository.findByEan(ean);
        }
        
        // Se produto não existir, criar automaticamente
        if (!product) {
          const productName = prod.xProd || 'Produto sem nome';
          let productSku = prod.cProd?.toString() || (ean !== '0' ? ean : `PROD-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
          
          // Verificar se SKU já existe e gerar um único se necessário
          productSku = await this.generateUniqueSku(productRepository, productSku);
          
          // Criar produto com dados do XML
          // Se EAN for "0", garantir que será salvo como "0" (string) para evitar conflitos
          product = await productRepository.create({
            name: productName,
            ean: ean !== '0' ? ean : '0', // Sempre salvar "0" como string quando inválido
            sku: productSku,
            initialPrice: unitPrice,
            finalPrice: finalPrice, // Valor unitário + ST (sem ICMS)
            icms: icmsUnitValue, // Salvar ICMS unitário no produto
            st: stUnitValue, // Salvar ST unitário no produto
            description: productName,
            shortDescription: productName.length > 100 ? productName.substring(0, 100) : productName,
            companyId: null, // Opcional - pode ser ajustado depois
            categoryId: null, // Opcional - pode ser ajustado depois
            quantity: 0, // Será atualizado pela movimentação
          } as any); // Usar 'as any' pois o schema zod exige companyId e categoryId, mas o Prisma aceita null
        }
        
        productId = product.id!;
        
        // Buscar ou criar stock
        const stock = await productRepository.findStockByProductId([productId]);
        let stockId: number;
        
        if (stock.length === 0) {
          // Criar stock se não existir
          const newStock = await productRepository.updateStock(productId, 0, undefined);
          stockId = newStock.id!;
        } else {
          stockId = stock[0].id!;
        }

        // Incrementar estoque
        await productRepository.incrementMultipleStocks([{
          sku: productId,
          quantity: Math.floor(quantity)
        }]);
        
        // Preparar movimentação de estoque
        stockMovements.push({
          stockId: stockId,
          quantity: Math.floor(quantity),
          type: 'IN',
          unitCost: unitPrice,
          invoiceNumber: `${ide.serie || ''}-${ide.nNF || ''}`.replace(/^-/, ''),
          icms: null, // Não usar ICMS no cálculo, apenas salvar no banco
          st: stUnitValue, // Valor unitário da ST na hora da nota
        });

        items.push({
          purchaseInvoiceId: purchaseInvoice.id!,
          productId: productId,
          code: code,
          description: prod.xProd || '',
          ncm: prod.NCM?.toString() || '',
          cst: cst,
          cfop: prod.CFOP?.toString() || '',
          unit: unit,
          quantity: quantity,
          unitPrice: unitPrice,
          discount: discount,
          totalAmount: totalAmount,
          icmsBase: icmsBase,
          icmsValue: icmsValue,
          icmsRate: icmsRate,
          icmsStBase: icmsStBase,
          icmsStValue: icmsStValue,
          ipiValue: ipiValue,
          ipiRate: ipiRate,
          unitCost: unitCost,
          unitTotalWithTax: unitTotalWithTax,
          totalCost: totalCost,
          totalWithTax: totalWithTax,
          taxData: imposto,
        });
      }

      // Criar itens da nota fiscal
      await purchaseInvoiceRepository.createItems(purchaseInvoice.id!, items);

      // Criar movimentações de estoque
      if (stockMovements.length > 0) {
        await productRepository.updateManyStockMovements(
          stockMovements.map((mov) => ({
            stockId: mov.stockId,
            quantity: mov.quantity,
            type: mov.type,
            unitCost: mov.unitCost,
            invoiceNumber: mov.invoiceNumber,
            icms: mov.icms,
            st: mov.st,
          }))
        );
      }

      // Buscar nota fiscal completa
      const completeInvoice = await purchaseInvoiceRepository.findById(purchaseInvoice.id!);
      if (!completeInvoice) {
        throw new Error('Erro ao buscar nota fiscal criada');
      }

      return completeInvoice;
    });
  }

  /**
   * Extrai o valor do ICMS do objeto de impostos
   */
  private extractICMSValue(imposto: any): number {
    if (!imposto || !imposto.ICMS) {
      return 0;
    }

    const icms = imposto.ICMS;
    
    // ICMS pode ter diferentes estruturas: ICMS00, ICMS10, ICMS20, ICMS30, ICMS40, ICMS51, ICMS60, ICMS70, ICMS90, etc.
    // Todos têm vICMS (valor do ICMS)
    const icmsKeys = Object.keys(icms);
    
    for (const key of icmsKeys) {
      const icmsData = icms[key];
      if (icmsData && typeof icmsData === 'object' && icmsData.vICMS) {
        return parseFloat(icmsData.vICMS.toString() || '0');
      }
    }

    return 0;
  }

  /**
   * Extrai o valor da ST (Substituição Tributária) do objeto de impostos
   */
  private extractSTValue(imposto: any): number {
    if (!imposto || !imposto.ICMS) {
      return 0;
    }

    const icms = imposto.ICMS;
    
    // ST pode estar em ICMS10, ICMS30, ICMS70, ICMS90, etc.
    // O valor da ST geralmente está em vICMSST
    const icmsKeys = Object.keys(icms);
    
    for (const key of icmsKeys) {
      const icmsData = icms[key];
      if (icmsData && typeof icmsData === 'object') {
        // Verificar vICMSST (valor da ST)
        if (icmsData.vICMSST) {
          return parseFloat(icmsData.vICMSST.toString() || '0');
        }
        // Alguns casos podem ter vST
        if (icmsData.vST) {
          return parseFloat(icmsData.vST.toString() || '0');
        }
      }
    }

    return 0;
  }

  /**
   * Gera um SKU único verificando se já existe no banco
   */
  private async generateUniqueSku(
    productRepository: IProductRepository,
    baseSku: string
  ): Promise<string> {
    let sku = baseSku;
    let counter = 1;
    
    // Verificar se SKU já existe (busca exata por SKU)
    const existingProduct = await productRepository.findBySku(sku);
    
    if (!existingProduct) {
      return sku;
    }
    
    // Se existe, tentar adicionar sufixo numérico
    while (counter < 10000) {
      const newSku = `${baseSku}-${counter}`;
      const checkProduct = await productRepository.findBySku(newSku);
      
      if (!checkProduct) {
        return newSku;
      }
      
      counter++;
    }
    
    // Se não conseguir em 10000 tentativas, usar timestamp
    return `${baseSku}-${Date.now()}`;
  }
}

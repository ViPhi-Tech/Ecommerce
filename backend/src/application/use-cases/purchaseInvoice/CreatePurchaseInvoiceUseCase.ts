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
      }> = [];

      for (const item of det) {
        const prod = item.prod || {};
        const imposto = item.imposto || {};
        
        const ean = prod.cEAN?.toString() || prod.cEANTrib?.toString() || '';
        const quantity = parseFloat(prod.qCom?.toString() || '0');
        const unitPrice = parseFloat(prod.vUnCom?.toString() || '0');
        const totalAmount = parseFloat(prod.vProd?.toString() || '0');

        // Buscar produto por EAN ou criar se não existir
        let productId: number | null = null;
        if (ean && ean !== '0' && ean !== 'SEM GTIN') {
          let product = await productRepository.findByEan(ean);
          
          // Se produto não existir, criar automaticamente
          if (!product) {
            const productName = prod.xProd || 'Produto sem nome';
            const productSku = prod.cProd?.toString() || ean; // Usar código do produto ou EAN como SKU
            
            // Criar produto com dados do XML
            // Seguindo o mesmo padrão do CreateProductUseCase
            product = await productRepository.create({
              name: productName,
              ean: ean,
              sku: productSku,
              initialPrice: unitPrice,
              finalPrice: 0, // Valor de venda deve ser cadastrado manualmente depois
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
          });
        }

        items.push({
          purchaseInvoiceId: purchaseInvoice.id!,
          productId: productId,
          description: prod.xProd || '',
          ncm: prod.NCM?.toString() || '',
          cfop: prod.CFOP?.toString() || '',
          quantity: quantity,
          unitPrice: unitPrice,
          totalAmount: totalAmount,
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
}

import { IDeliveryRepository } from '../../../domain/repositories/IDeliveryRepository';

export class DeleteDeliveryUseCase {
  constructor(private deliveryRepository: IDeliveryRepository) {}

  async execute(uuid: string): Promise<void> {
    try {
      await this.deliveryRepository.deleteByUuid(uuid);
    } catch (error: any) {
      const message = error?.message?.toLowerCase() ?? '';
      if (message.includes('não encontrada') || message.includes('not found')) {
        throw new Error('Entrega não encontrada.');
      }
      throw new Error(error?.message || 'Erro interno ao deletar entrega.');
    }
  }
}


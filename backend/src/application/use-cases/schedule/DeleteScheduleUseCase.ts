import type { IScheduleRepository } from '../../../domain/repositories/IScheduleRepository';

export class DeleteScheduleUseCase {
  constructor(private scheduleRepository: IScheduleRepository) {}

  async execute(id: number, userId: number): Promise<void> {
    return this.scheduleRepository.delete(id, userId);
  }
}

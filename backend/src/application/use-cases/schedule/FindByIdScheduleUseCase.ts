import type { Schedule } from '../../../domain/entities/Schedule';
import type { IScheduleRepository } from '../../../domain/repositories/IScheduleRepository';

export class FindByIdScheduleUseCase {
  constructor(private scheduleRepository: IScheduleRepository) {}

  async execute(id: number, userId: number): Promise<Schedule | null> {
    return this.scheduleRepository.findById(id, userId);
  }
}

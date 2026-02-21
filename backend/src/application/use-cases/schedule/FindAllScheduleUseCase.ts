import type { Schedule } from '../../../domain/entities/Schedule';
import type { IScheduleRepository } from '../../../domain/repositories/IScheduleRepository';

export class FindAllScheduleUseCase {
  constructor(private scheduleRepository: IScheduleRepository) {}

  async execute(userId: number): Promise<Schedule[]> {
    return this.scheduleRepository.findAllByUserId(userId);
  }
}

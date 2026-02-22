import type { Schedule } from "../../../domain/entities/Schedule";
import type { IScheduleRepository } from "../../../domain/repositories/IScheduleRepository";

export class FindTodayScheduleUseCase {
  constructor(private scheduleRepository: IScheduleRepository) {}

  async execute(userId: number): Promise<Schedule[]> {
    return this.scheduleRepository.findToday(userId);
  }
}
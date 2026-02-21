import type { CreateScheduleDTO } from '../../dto/schedule/ScheduleDTOs';
import type { IScheduleRepository } from '../../../domain/repositories/IScheduleRepository';
import type { Schedule } from '../../../domain/entities/Schedule';

export class CreateScheduleUseCase {
  constructor(private scheduleRepository: IScheduleRepository) {}

  async execute(input: CreateScheduleDTO, userId: number): Promise<Schedule> {
    const startDateTime =
      typeof input.startDateTime === 'string'
        ? new Date(input.startDateTime)
        : input.startDateTime;
    const endDateTime =
      typeof input.endDateTime === 'string'
        ? new Date(input.endDateTime)
        : input.endDateTime;
    return this.scheduleRepository.create({
      title: input.title,
      description: input.description ?? null,
      startDateTime,
      endDateTime,
      location: input.location ?? null,
      isAllDay: input.isAllDay ?? false,
      status: input.status ?? 'SCHEDULED',
      userId,
    });
  }
}

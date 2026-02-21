import type { UpdateScheduleDTO } from '../../dto/schedule/ScheduleDTOs';
import type { Schedule } from '../../../domain/entities/Schedule';
import type { IScheduleRepository } from '../../../domain/repositories/IScheduleRepository';

export class UpdateScheduleUseCase {
  constructor(private scheduleRepository: IScheduleRepository) {}

  async execute(
    id: number,
    userId: number,
    input: UpdateScheduleDTO
  ): Promise<Schedule> {
    const data: {
      title?: string;
      description?: string | null;
      startDateTime?: Date;
      endDateTime?: Date;
      location?: string | null;
      isAllDay?: boolean;
      status?: string;
    } = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.startDateTime !== undefined) {
      data.startDateTime =
        typeof input.startDateTime === 'string'
          ? new Date(input.startDateTime)
          : input.startDateTime;
    }
    if (input.endDateTime !== undefined) {
      data.endDateTime =
        typeof input.endDateTime === 'string'
          ? new Date(input.endDateTime)
          : input.endDateTime;
    }
    if (input.location !== undefined) data.location = input.location;
    if (input.isAllDay !== undefined) data.isAllDay = input.isAllDay;
    if (input.status !== undefined) data.status = input.status;
    return this.scheduleRepository.update(id, userId, data);
  }
}

import { PrismaClient } from '../prismaClient';
import { Schedule } from '../../../domain/entities/Schedule';
import {
  IScheduleRepository,
  CreateScheduleInput,
  UpdateScheduleInput,
} from '../../../domain/repositories/IScheduleRepository';

export class ScheduleRepository implements IScheduleRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateScheduleInput): Promise<Schedule> {
    return this.prisma.schedule.create({
      data: {
        title: data.title,
        description: data.description ?? undefined,
        startDateTime: new Date(data.startDateTime),
        endDateTime: new Date(data.endDateTime),
        location: data.location ?? undefined,
        isAllDay: data.isAllDay ?? false,
        status: data.status ?? 'SCHEDULED',
        userId: data.userId,
      },
    });
  }

  async findById(id: number, userId: number): Promise<Schedule | null> {
    return this.prisma.schedule.findFirst({
      where: { id, userId },
    });
  }

  async findAllByUserId(userId: number): Promise<Schedule[]> {
    return this.prisma.schedule.findMany({
      where: { userId },
      orderBy: { startDateTime: 'asc' },
    });
  }

  async update(
    id: number,
    userId: number,
    data: UpdateScheduleInput
  ): Promise<Schedule> {
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new Error('Schedule not found');
    }
    return this.prisma.schedule.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.startDateTime !== undefined && {
          startDateTime: new Date(data.startDateTime),
        }),
        ...(data.endDateTime !== undefined && {
          endDateTime: new Date(data.endDateTime),
        }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.isAllDay !== undefined && { isAllDay: data.isAllDay }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });
  }

  async delete(id: number, userId: number): Promise<void> {
    const existing = await this.findById(id, userId);
    if (!existing) {
      throw new Error('Schedule not found');
    }
    await this.prisma.schedule.delete({
      where: { id },
    });
  }
}

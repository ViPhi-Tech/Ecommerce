import { Schedule } from "../entities/Schedule";

export interface CreateScheduleInput {
  title: string;
  description?: string | null;
  startDateTime: Date;
  endDateTime: Date;
  location?: string | null;
  isAllDay?: boolean;
  status?: string;
  userId: number;
}

export interface UpdateScheduleInput {
  title?: string;
  description?: string | null;
  startDateTime?: Date;
  endDateTime?: Date;
  location?: string | null;
  isAllDay?: boolean;
  status?: string;
}

export interface IScheduleRepository {
  create(data: CreateScheduleInput): Promise<Schedule>;
  findById(id: number, userId: number): Promise<Schedule | null>;
  findAllByUserId(userId: number): Promise<Schedule[]>;
  update(id: number, userId: number, data: UpdateScheduleInput): Promise<Schedule>;
  delete(id: number, userId: number): Promise<void>;
  findToday(userId: number): Promise<Schedule[]>;
}

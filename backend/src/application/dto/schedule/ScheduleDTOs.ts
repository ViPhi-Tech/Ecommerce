import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const scheduleStatusEnum = z.enum(['SCHEDULED', 'CANCELLED', 'COMPLETED']);

export const createScheduleSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional().nullable(),
  startDateTime: z.coerce.date(),
  endDateTime: z.coerce.date(),
  location: z.string().optional().nullable(),
  isAllDay: z.boolean().optional().default(false),
  status: scheduleStatusEnum.optional().default('SCHEDULED'),
});

export const updateScheduleSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  startDateTime: z.coerce.date().optional(),
  endDateTime: z.coerce.date().optional(),
  location: z.string().optional().nullable(),
  isAllDay: z.boolean().optional(),
  status: scheduleStatusEnum.optional(),
});

export const scheduleIdSchema = z.object({
  id: z.coerce.number().min(1, { message: 'Schedule id is required' }),
});

export const createScheduleJsonSchema = zodToJsonSchema(createScheduleSchema);
export const updateScheduleJsonSchema = zodToJsonSchema(updateScheduleSchema);
export const scheduleIdJsonSchema = zodToJsonSchema(scheduleIdSchema);

export type CreateScheduleDTO = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleDTO = z.infer<typeof updateScheduleSchema>;
export type ScheduleIdDTO = z.infer<typeof scheduleIdSchema>;

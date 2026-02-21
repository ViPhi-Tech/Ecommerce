import { prisma } from '../../database/prismaClient';
import { ScheduleRepository } from '../../database/repositories/ScheduleRepository';
import { CreateScheduleUseCase } from '../../../application/use-cases/schedule/CreateScheduleUseCase';
import { FindByIdScheduleUseCase } from '../../../application/use-cases/schedule/FindByIdScheduleUseCase';
import { FindAllScheduleUseCase } from '../../../application/use-cases/schedule/FindAllScheduleUseCase';
import { UpdateScheduleUseCase } from '../../../application/use-cases/schedule/UpdateScheduleUseCase';
import { DeleteScheduleUseCase } from '../../../application/use-cases/schedule/DeleteScheduleUseCase';
import { ScheduleController } from '../../http/controllers/ScheduleController';

export const scheduleRepository = new ScheduleRepository(prisma);

const createScheduleUseCase = new CreateScheduleUseCase(scheduleRepository);
const findByIdScheduleUseCase = new FindByIdScheduleUseCase(scheduleRepository);
const findAllScheduleUseCase = new FindAllScheduleUseCase(scheduleRepository);
const updateScheduleUseCase = new UpdateScheduleUseCase(scheduleRepository);
const deleteScheduleUseCase = new DeleteScheduleUseCase(scheduleRepository);

export const scheduleController = new ScheduleController(
  createScheduleUseCase,
  findByIdScheduleUseCase,
  findAllScheduleUseCase,
  updateScheduleUseCase,
  deleteScheduleUseCase
);

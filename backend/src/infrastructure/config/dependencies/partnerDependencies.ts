import { PartnerRepository } from '../../database/repositories/PartnerRepository';
import { CreatePartnerUseCase } from '../../../application/use-cases/partner/CreatePartnerUseCase';
import { FindAllPartnerUseCase } from '../../../application/use-cases/partner/FindAllPartnerUseCase';
import { FindByIdPartnerUseCase } from '../../../application/use-cases/partner/FindByIdPartnerUseCase';
import { UpdatePartnerUseCase } from '../../../application/use-cases/partner/UpdatePartnerUseCase';
import { DeletePartnerUseCase } from '../../../application/use-cases/partner/DeletePartnerUseCase';
import { PartnerController } from '../../http/controllers/PartnerController';
import { prismaClient } from '../../database/prismaClient';
import { IPartnerRepository } from '../../../domain/repositories/IPartnerRepository';

const partnerRepository: IPartnerRepository = new PartnerRepository(prismaClient);

const createPartnerUseCase = new CreatePartnerUseCase(partnerRepository);
const findAllPartnerUseCase = new FindAllPartnerUseCase(partnerRepository);
const findByIdPartnerUseCase = new FindByIdPartnerUseCase(partnerRepository);
const updatePartnerUseCase = new UpdatePartnerUseCase(partnerRepository);
const deletePartnerUseCase = new DeletePartnerUseCase(partnerRepository);

const partnerController = new PartnerController(
  createPartnerUseCase,
  findAllPartnerUseCase,
  findByIdPartnerUseCase,
  updatePartnerUseCase,
  deletePartnerUseCase,
);

export {
  partnerRepository,
  createPartnerUseCase,
  findAllPartnerUseCase,
  findByIdPartnerUseCase,
  updatePartnerUseCase,
  deletePartnerUseCase,
  partnerController,
};
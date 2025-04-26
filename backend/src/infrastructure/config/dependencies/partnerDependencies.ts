import { PartnerController } from '../../http/controllers/PartnerController';
import { CreatePartnerUseCase } from '../../../application/use-cases/partner/CreatePartnerUseCase';
import { FindAllPartnerUseCase } from '../../../application/use-cases/partner/FindAllPartnerUseCase';
import { FindByIdPartnerUseCase } from '../../../application/use-cases/partner/FindByIdPartnerUseCase';
import { UpdatePartnerUseCase } from '../../../application/use-cases/partner/UpdatePartnerUseCase';
import { DeletePartnerUseCase } from '../../../application/use-cases/partner/DeletePartnerUseCase';
import { IPartnerRepository } from '../../../domain/repositories/IPartnerRepository';
import { PartnerRepository } from '../../database/repositories/PartnerRepository';
import { container } from 'tsyringe';
import { PrismaClient } from '../../database/prismaClient';

const prismaClient = new PrismaClient()
container.register<IPartnerRepository>("IPartnerRepository", {
    useFactory: () => {
        return new PartnerRepository(prismaClient);
    },
});

container.register<CreatePartnerUseCase>(
  "CreatePartnerUseCase",
  CreatePartnerUseCase
);
container.register<FindAllPartnerUseCase>(
  "FindAllPartnerUseCase",
  FindAllPartnerUseCase
);
container.register<FindByIdPartnerUseCase>(
  "FindByIdPartnerUseCase",
  FindByIdPartnerUseCase
);
container.register<UpdatePartnerUseCase>(
  "UpdatePartnerUseCase",
  UpdatePartnerUseCase
);
container.register<DeletePartnerUseCase>(
  "DeletePartnerUseCase",
  DeletePartnerUseCase
);

container.register<PartnerController>("PartnerController", {
    useFactory: (c) => {
        const createPartnerUseCase = c.resolve<CreatePartnerUseCase>("CreatePartnerUseCase")
        const findAllPartnerUseCase = c.resolve<FindAllPartnerUseCase>("FindAllPartnerUseCase")
        const findByIdPartnerUseCase = c.resolve<FindByIdPartnerUseCase>("FindByIdPartnerUseCase")
        const updatePartnerUseCase = c.resolve<UpdatePartnerUseCase>("UpdatePartnerUseCase")
        const deletePartnerUseCase = c.resolve<DeletePartnerUseCase>("DeletePartnerUseCase")
        return new PartnerController(
            createPartnerUseCase,
            findAllPartnerUseCase,
            findByIdPartnerUseCase,
            updatePartnerUseCase,
            deletePartnerUseCase
        );
    }
});

export const partnerDependencies = {
    partnerRepository: "IPartnerRepository",
    createPartnerUseCase: "CreatePartnerUseCase",
    findAllPartnerUseCase: "FindAllPartnerUseCase",
    findByIdPartnerUseCase: "FindByIdPartnerUseCase",
    updatePartnerUseCase: "UpdatePartnerUseCase",
    deletePartnerUseCase: "DeletePartnerUseCase",
    partnerController: "PartnerController"
};
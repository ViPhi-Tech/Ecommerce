import { ClientRepository } from '../../database/repositories/ClientRepository';
import { CreateClientUseCase } from '../../../application/use-cases/client/CreateClientUseCase';
import { FindClientByDocument } from '../../../application/use-cases/client/FindClientByDocument';
import { FindAllClientUseCase } from '../../../application/use-cases/client/FindAllClientUseCase';
import { FindByIdClientUseCase } from '../../../application/use-cases/client/FindByIdClientUseCase';
import { UpdateClientUseCase } from '../../../application/use-cases/client/UpdateClientUseCase';
import { DeleteClientUseCase } from '../../../application/use-cases/client/DeleteClientUseCase';
import { ClientController } from '../../http/controllers/ClientController';
import { prisma } from '../../database/prismaClient';
import { IClientRepository } from '../../../domain/repositories/IClientRepository';

const clientRepository: IClientRepository = new ClientRepository(prisma);

const createClientUseCase = new CreateClientUseCase(clientRepository);
const findAllClientUseCase = new FindAllClientUseCase(clientRepository);
const findByIdClientUseCase = new FindByIdClientUseCase(clientRepository);
const updateClientUseCase = new UpdateClientUseCase(clientRepository);
const deleteClientUseCase = new DeleteClientUseCase(clientRepository);
const findClientByDocument = new FindClientByDocument(clientRepository)

const clientController = new ClientController(
  createClientUseCase,
  findAllClientUseCase,
  findByIdClientUseCase,
  updateClientUseCase,
  deleteClientUseCase,
  findClientByDocument
);

export {
  clientRepository,
  createClientUseCase,
  findAllClientUseCase,
  findByIdClientUseCase,
  updateClientUseCase,
  deleteClientUseCase,
  clientController,
}; 
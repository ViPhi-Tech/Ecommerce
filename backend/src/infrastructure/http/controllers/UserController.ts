import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateUserUseCase } from '../../../application/use-cases/user/CreateUserUseCase';
import { GetUserUseCase } from '../../../application/use-cases/user/GetUserUseCase';
import { UpdateUserUseCase } from '../../../application/use-cases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../../application/use-cases/user/DeleteUserUseCase';
import { CreateUserDTO, UpdateUserDTO } from '../dto/User.dto';
import { UpdateLoginDTO } from '../dto/Login.dto';
import { EmailAlreadyExistsError, UserNotFoundError } from '../../../shared/errors/UserErrors';
import { HTTP_MESSAGES } from "../../../shared/types/httpMessages";
import { HTTP_STATUS} from "../../../shared/types/httpStatus";

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getUserUseCase: GetUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userData = request.body as CreateUserDTO;
      
      const user = await this.createUserUseCase.execute(userData);

      return reply.code(HTTP_STATUS.API_STATUS_CREATED).send({
        id: user.id,
        full_name: user.fullName,
        is_active: user.isActive,
        login_id: user.loginId
      });
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        return reply.code(HTTP_STATUS.API_STATUS_CONFLICT).send({ message: error.message });
      }
      
      console.error(error);
      return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ message: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR });
    }
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const id = parseInt(request.params.id, 10);
      
      if (isNaN(id)) {
        return reply.code(400).send({ message: 'Invalid ID format' });
      }
      
      const user = await this.getUserUseCase.findById(id);

      return reply.code(200).send(user);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return reply.code(404).send({ message: error.message });
      }
      
      console.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const includeLogin = request.query && (request.query as any).includeLogin === 'true';
      
      const users = includeLogin 
        ? await this.getUserUseCase.findAllWithLogin()
        : await this.getUserUseCase.findAll();

      return reply.code(200).send(users);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const id = parseInt(request.params.id, 10);
      
      if (isNaN(id)) {
        return reply.code(400).send({ message: 'Invalid ID format' });
      }
      
      const { user: userData, login: loginData } = request.body as {
        user?: UpdateUserDTO;
        login?: UpdateLoginDTO;
      };
      
      if (!userData && !loginData) {
        return reply.code(400).send({ message: 'No data provided for update' });
      }
      
      const user = await this.updateUserUseCase.execute(id, userData || {}, loginData);

      return reply.code(200).send(user);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return reply.code(404).send({ message: error.message });
      }
      
      if (error instanceof EmailAlreadyExistsError) {
        return reply.code(409).send({ message: error.message });
      }
      
      console.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const id = parseInt(request.params.id, 10);
      
      if (isNaN(id)) {
        return reply.code(400).send({ message: 'Invalid ID format' });
      }
      
      await this.deleteUserUseCase.execute(id);

      return reply.code(204).send();
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return reply.code(404).send({ message: error.message });
      }
      
      console.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }
}
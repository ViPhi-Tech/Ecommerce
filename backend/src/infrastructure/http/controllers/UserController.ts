import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateUserUseCase } from '../../../application/use-cases/user/CreateUserUseCase';
import { GetUserUseCase } from '../../../application/use-cases/user/GetUserUseCase';
import { UpdateUserUseCase } from '../../../application/use-cases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../../application/use-cases/user/DeleteUserUseCase';
import { GetUserRolesUseCase } from '../../../application/use-cases/user/GetUserRolesUseCase';

import { ApiResponse } from '../../../shared/types/apiResponse';

import { 
  CreateUserDTO, 
  UpdateUserDTO, 
  createUserSchema, 
  updateUserSchema,
  UserResponse 
} from '../../../application/dto/user/UserDTOs';
import { UpdateLoginDTO, updateLoginSchema } from '../../../application/dto/login/LoginDTOs';
import { EmailAlreadyExistsError, UserNotFoundError } from '../../../shared/errors/UserErrors';
import { HTTP_MESSAGES } from "../../../shared/types/httpMessages";
import { HTTP_STATUS} from "../../../shared/types/httpStatus";

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getUserUseCase: GetUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private getUserRolesUseCase: GetUserRolesUseCase
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Mapear 'modules' para 'roles' se necessário (compatibilidade com frontend)
      const body = request.body as any;
      console.log('Body recebido:', JSON.stringify(body, null, 2));
      
      if (body.modules && !body.roles) {
        body.roles = body.modules;
        delete body.modules;
      }
      
      // Garantir que roles seja um array
      if (body.roles && !Array.isArray(body.roles)) {
        body.roles = [body.roles];
      }
      
      console.log('Body após mapeamento:', JSON.stringify(body, null, 2));
      console.log('Roles após processamento:', body.roles);
      
      // Validação usando o schema do application
      const validationResult = createUserSchema.safeParse(body);
      
      if (!validationResult.success) {
        console.error('Erro de validação completo:', JSON.stringify(validationResult.error.errors, null, 2));
        return reply.code(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
          message: 'Dados inválidos',
          errors: validationResult.error.errors
        });
      }
      
      const userData = validationResult.data;
      
      // Converter CreateUserDTO para CreateUserInput (senha é definida apenas pelo link no e-mail)
      const createUserInput = {
        fullName: userData.fullName,
        isActive: userData.isActive,
        email: userData.email,
        googleId: userData.googleId,
        roles: userData.roles
      };
      
      const user = await this.createUserUseCase.execute(createUserInput);

      return reply.code(HTTP_STATUS.API_STATUS_CREATED).send({
        id: user.id,
        full_name: user.fullName,
        is_active: user.isActive,
        login_id: user.loginId
      });
    } catch (error: any) {
      console.error('Erro completo ao criar usuário:', error);
      console.error('Stack trace:', error?.stack);
      
      if (error instanceof EmailAlreadyExistsError) {
        return reply.code(HTTP_STATUS.API_STATUS_CONFLICT).send({ message: error.message });
      }
      
      // Retornar mensagem de erro mais detalhada
      const errorMessage = error?.message || HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR;
      return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ 
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      });
    }
  };

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
  };

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
  };

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
  };

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
  };


  async getUserRoles(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<ApiResponse>  {
    try {
      const id = parseInt(request.params.id, 10);
      
      if (isNaN(id)) {
        return reply.code(400).send({ message: 'Invalid ID format' });
      }
      
      const roles = await this.getUserRolesUseCase.execute(id);

      return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: roles})

    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false, descricao: error instanceof Error ? error.message : HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
      }
      
      console.error(error);
        return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false, descricao: error instanceof Error ? error.message : HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
    }
};
}
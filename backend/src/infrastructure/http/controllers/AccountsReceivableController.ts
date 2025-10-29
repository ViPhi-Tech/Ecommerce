import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateAccountsReceivableUseCase } from '../../../application/use-cases/accounts-receivable/CreateAccountsReceivableUseCase';
import { FindAllAccountsReceivableUseCase } from '../../../application/use-cases/accounts-receivable/FindAllAccountsReceivableUseCase';
import { FindByIdAccountsReceivableUseCase } from '../../../application/use-cases/accounts-receivable/FindByIdAccountsReceivableUseCase';
import { FindByClientAccountsReceivableUseCase } from '../../../application/use-cases/accounts-receivable/FindByClientAccountsReceivableUseCase';
import { FindByStatusAccountsReceivableUseCase } from '../../../application/use-cases/accounts-receivable/FindByStatusAccountsReceivableUseCase';
import { FindOverdueAccountsReceivableUseCase } from '../../../application/use-cases/accounts-receivable/FindOverdueAccountsReceivableUseCase';
import { UpdateAccountsReceivableUseCase } from '../../../application/use-cases/accounts-receivable/UpdateAccountsReceivableUseCase';
import { DeleteAccountsReceivableUseCase } from '../../../application/use-cases/accounts-receivable/DeleteAccountsReceivableUseCase';
import { CreateAccountsReceivableInput, UpdateAccountsReceivableInput, UpdateAccountsReceivableStatusInput } from '../../../application/dto/accountsReceivable/AccountsReceivableDTOs';

export class AccountsReceivableController {
  constructor(
    private createAccountsReceivableUseCase: CreateAccountsReceivableUseCase,
    private findAllAccountsReceivableUseCase: FindAllAccountsReceivableUseCase,
    private findByIdAccountsReceivableUseCase: FindByIdAccountsReceivableUseCase,
    private findByClientAccountsReceivableUseCase: FindByClientAccountsReceivableUseCase,
    private findByStatusAccountsReceivableUseCase: FindByStatusAccountsReceivableUseCase,
    private findOverdueAccountsReceivableUseCase: FindOverdueAccountsReceivableUseCase,
    private updateAccountsReceivableUseCase: UpdateAccountsReceivableUseCase,
    private deleteAccountsReceivableUseCase: DeleteAccountsReceivableUseCase
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as CreateAccountsReceivableInput;
      const accountsReceivable = await this.createAccountsReceivableUseCase.execute(data);
      return reply.status(201).send({ success: true, message: 'Conta a receber criada com sucesso', data: accountsReceivable });
    } catch (error) {
      return reply.status(400).send({ success: false, message: error instanceof Error ? error.message : 'Erro ao criar conta a receber' });
    }
  }

  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.query as {};
      const accountsReceivable = await this.findAllAccountsReceivableUseCase.execute(data);
      return reply.status(200).send({ success: true, data: accountsReceivable });
    } catch (error) {
      return reply.status(500).send({ success: false, message: error instanceof Error ? error.message : 'Erro ao buscar contas a receber' });
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const accountsReceivable = await this.findByIdAccountsReceivableUseCase.execute(parseInt(id));
      if (!accountsReceivable) {
        return reply.status(404).send({ success: false, message: 'Conta a receber não encontrada' });
      }
      return reply.status(200).send({ success: true, data: accountsReceivable });
    } catch (error) {
      return reply.status(500).send({ success: false, message: error instanceof Error ? error.message : 'Erro ao buscar conta a receber' });
    }
  }

  async findByClient(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { clientId } = request.params as { clientId: string };
      const accountsReceivable = await this.findByClientAccountsReceivableUseCase.execute(parseInt(clientId));
      return reply.status(200).send({ success: true, data: accountsReceivable });
    } catch (error) {
      return reply.status(500).send({ success: false, message: error instanceof Error ? error.message : 'Erro ao buscar contas a receber por cliente' });
    }
  }

  async findByStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { status } = request.params as { status: string };
      const accountsReceivable = await this.findByStatusAccountsReceivableUseCase.execute(status);
      return reply.status(200).send({ success: true, data: accountsReceivable });
    } catch (error) {
      return reply.status(500).send({ success: false, message: error instanceof Error ? error.message : 'Erro ao buscar contas a receber por status' });
    }
  }

  async findOverdue(request: FastifyRequest, reply: FastifyReply) {
    try {
      const accountsReceivable = await this.findOverdueAccountsReceivableUseCase.execute();
      return reply.status(200).send({ success: true, data: accountsReceivable });
    } catch (error) {
      return reply.status(500).send({ success: false, message: error instanceof Error ? error.message : 'Erro ao buscar contas a receber em atraso' });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const data = request.body as UpdateAccountsReceivableInput;
      const accountsReceivable = await this.updateAccountsReceivableUseCase.execute(parseInt(id), data);
      return reply.status(200).send({ success: true, message: 'Conta a receber atualizada com sucesso', data: accountsReceivable });
    } catch (error) {
      return reply.status(400).send({ success: false, message: error instanceof Error ? error.message : 'Erro ao atualizar conta a receber' });
    }
  }

  async updateStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const { status } = request.body as UpdateAccountsReceivableStatusInput;
      const accountsReceivable = await this.updateAccountsReceivableUseCase.execute(parseInt(id), { status });
      return reply.status(200).send({ success: true, message: 'Status da conta a receber atualizado com sucesso', data: accountsReceivable });
    } catch (error) {
      return reply.status(400).send({ success: false, message: error instanceof Error ? error.message : 'Erro ao atualizar status da conta a receber' });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      await this.deleteAccountsReceivableUseCase.execute(parseInt(id));
      return reply.status(200).send({ success: true, message: 'Conta a receber deletada com sucesso' });
    } catch (error) {
      return reply.status(400).send({ success: false, message: error instanceof Error ? error.message : 'Erro ao deletar conta a receber' });
    }
  }
}

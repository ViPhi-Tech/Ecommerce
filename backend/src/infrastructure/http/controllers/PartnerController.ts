import { Request, Response } from 'express';
import Partner from '../../../domain/entities/Partner';
import { CreatePartnerUseCase, FindAllPartnerUseCase, FindByIdPartnerUseCase, UpdatePartnerUseCase, DeletePartnerUseCase } from '../../../application/use-cases/partner';
import { CreatePartnerDTO, UpdatePartnerDTO } from '../dto/Partner.dto';

export class PartnerController {
  constructor(
    private readonly createPartnerUseCase: CreatePartnerUseCase,
    private readonly findAllPartnerUseCase: FindAllPartnerUseCase,
    private readonly findByIdPartnerUseCase: FindByIdPartnerUseCase,
    private readonly updatePartnerUseCase: UpdatePartnerUseCase,
    private readonly deletePartnerUseCase: DeletePartnerUseCase,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, document, phone } = req.body as CreatePartnerDTO;
      const partner = new Partner();
      partner.name = name;
      partner.email = email;
      partner.document = document;
      partner.phone = phone;

      const createdPartner = await this.createPartnerUseCase.execute(partner);
      res.status(201).json(createdPartner);
    } catch (error) {
      res.status(500).json({ error: 'Error creating partner' });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const partners = await this.findAllPartnerUseCase.execute();
      res.json(partners);
    } catch (error) {
      res.status(500).json({ error: 'Error finding partners' });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const partner = await this.findByIdPartnerUseCase.execute(id);
      if (partner) {
        res.json(partner);
      } else {
        res.status(404).json({ error: 'Partner not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error finding partner' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email, document, phone } = req.body as UpdatePartnerDTO;
      const partner = new Partner();
      partner.name = name;
      partner.email = email;
      partner.document = document;
      partner.phone = phone;

      const updatedPartner = await this.updatePartnerUseCase.execute(id, partner);
      if (updatedPartner) {
        res.json(updatedPartner);
      } else {
        res.status(404).json({ error: 'Partner not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating partner' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.deletePartnerUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting partner' });
    }
  }
}
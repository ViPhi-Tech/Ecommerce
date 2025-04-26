import { Router } from 'express';
import { PartnerController } from '../controllers/PartnerController';

export const partnerRoutes = (router: Router) => {
  const partnerController = new PartnerController();

  router.post('/partners', (req, res) => partnerController.create(req, res));
  router.get('/partners', (req, res) => partnerController.findAll(req, res));
  router.get('/partners/:id', (req, res) => partnerController.findById(req, res));
  router.put('/partners/:id', (req, res) => partnerController.update(req, res));
  router.delete('/partners/:id', (req, res) => partnerController.delete(req, res));
};
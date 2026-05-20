import { FastifyReply, FastifyRequest } from 'fastify';
import { stripNonDigits, stripNonDigitsOrNull } from '../../../shared/utils/stringUtils';

type SupplierBody = {
  cnpj?: string;
  phone?: string | null;
};

export async function sanitizeSupplierBody(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  const body = request.body as SupplierBody | undefined;
  if (!body || typeof body !== 'object') {
    return;
  }

  if (typeof body.cnpj === 'string') {
    body.cnpj = stripNonDigits(body.cnpj);
  }

  if ('phone' in body) {
    body.phone = stripNonDigitsOrNull(body.phone) ?? null;
  }
}

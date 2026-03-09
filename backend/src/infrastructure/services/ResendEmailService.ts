import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';
import { IEmailService, CreatePasswordEmailVariables } from '../../domain/services/IEmailService';

export class ResendEmailService implements IEmailService {
  private readonly resend: Resend;
  private readonly from: string;

  constructor(apiKey: string, from: string) {
    this.resend = new Resend(apiKey);
    this.from = from;
  }

  async sendCreatePasswordEmail(to: string, variables: CreatePasswordEmailVariables): Promise<void> {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'shared',
      'emails-templates',
      'create-first-password.html'
    );
    let html = fs.readFileSync(templatePath, 'utf-8');

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      html = html.replace(placeholder, String(value ?? ''));
    }

    const { error } = await this.resend.emails.send({
      from: this.from,
      to: [to],
      subject: 'Bem-vindo ao SellUP - Crie sua senha',
      html
    });

    if (error) {
      const msg = error.message || '';
      if (msg.includes('only send testing emails') || msg.includes('verify a domain')) {
        throw new Error(
          'Resend em modo de teste só envia para o e-mail da sua conta. Para enviar para outros destinatários, verifique um domínio em https://resend.com/domains e defina RESEND_FROM com um e-mail desse domínio (ex: noreply@seudominio.com.br).'
        );
      }
      throw new Error(`Falha ao enviar e-mail: ${msg}`);
    }
  }
}

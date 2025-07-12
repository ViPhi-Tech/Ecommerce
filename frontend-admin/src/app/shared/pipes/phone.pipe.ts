import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
  standalone: true
})
export class PhonePipe implements PipeTransform {
  
  transform(value: string | number): string {
    if (!value) {
      return '';
    }

    // Remove todos os caracteres não numéricos
    const cleanValue = value.toString().replace(/\D/g, '');

    // Verifica o tipo de telefone baseado no número de dígitos
    switch (cleanValue.length) {
      case 8:
        // Telefone fixo sem DDD: 0000-0000
        return this.formatFixedPhone(cleanValue);
      
      case 9:
        // Celular sem DDD: 90000-0000
        return this.formatMobilePhone(cleanValue);
      
      case 10:
        // Telefone fixo com DDD: (00) 0000-0000
        return this.formatFixedPhoneWithDDD(cleanValue);
      
      case 11:
        // Celular com DDD: (00) 90000-0000
        return this.formatMobilePhoneWithDDD(cleanValue);
      
      case 13:
        // Telefone com código do país: +55 (00) 90000-0000
        return this.formatInternationalPhone(cleanValue);
      
      default:
        // Se não for um formato reconhecido, retorna o valor original
        return value.toString();
    }
  }

  private formatFixedPhone(phone: string): string {
    // Formato: 0000-0000
    return phone.replace(/(\d{4})(\d{4})/, '$1-$2');
  }

  private formatMobilePhone(phone: string): string {
    // Formato: 90000-0000
    return phone.replace(/(\d{5})(\d{4})/, '$1-$2');
  }

  private formatFixedPhoneWithDDD(phone: string): string {
    // Formato: (00) 0000-0000
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  private formatMobilePhoneWithDDD(phone: string): string {
    // Formato: (00) 90000-0000
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  private formatInternationalPhone(phone: string): string {
    // Remove o código do país (55) se presente e formata como celular com DDD
    if (phone.startsWith('55')) {
      const phoneWithoutCountryCode = phone.substring(2);
      return `+55 ${this.formatMobilePhoneWithDDD(phoneWithoutCountryCode)}`;
    }
    
    // Se não começar com 55, formata como número genérico
    return phone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
  }
}

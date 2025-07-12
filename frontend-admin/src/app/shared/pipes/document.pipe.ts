import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'document',
  standalone: true
})
export class DocumentPipe implements PipeTransform {
  
  transform(value: string | number): string {
    if (!value) {
      return '';
    }

    // Remove todos os caracteres não numéricos
    const cleanValue = value.toString().replace(/\D/g, '');

    // Verifica se é CPF (11 dígitos) ou CNPJ (14 dígitos)
    if (cleanValue.length === 11) {
      return this.formatCPF(cleanValue);
    } else if (cleanValue.length === 14) {
      return this.formatCNPJ(cleanValue);
    }

    // Se não for nem CPF nem CNPJ, retorna o valor original
    return value.toString();
  }

  private formatCPF(cpf: string): string {
    // Formato: 000.000.000-00
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  private formatCNPJ(cnpj: string): string {
    // Formato: 00.000.000/0000-00
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
}

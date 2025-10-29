import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

export interface ExportColumn {
  title: string;
  dataKey: string;
  type?: string;
  headerAlign?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExcelExportService {
  constructor() {}

  /**
   * Exporta dados para Excel
   * @param data Array de dados para exportar
   * @param columns Configuração das colunas
   * @param fileName Nome do arquivo (sem extensão)
   * @param sheetName Nome da planilha
   */
  exportToExcel(
    data: any[],
    columns: ExportColumn[],
    fileName = 'exportacao',
    sheetName = 'Dados'
  ): void {
    if (!data || data.length === 0) {
      console.warn('Nenhum dado para exportar');
      return;
    }

    // Preparar os dados formatados
    const formattedData = data.map(item => {
      const formattedItem: any = {};

      columns.forEach(column => {
        const value = item[column.dataKey];
        formattedItem[column.title] = this.formatValue(value, column.type);
      });

      return formattedItem;
    });

    // Criar workbook e worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    // Aplicar estilos ao cabeçalho
    this.styleHeader(worksheet, columns);

    // Ajustar largura das colunas
    this.autoSizeColumns(worksheet, formattedData, columns);

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Gerar arquivo e fazer download
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true,
    });

    this.saveExcelFile(excelBuffer, fileName);
  }

  /**
   * Formata valores baseado no tipo
   */
  private formatValue(value: any, type?: string): any {
    if (value === null || value === undefined) {
      return '';
    }

    switch (type) {
      case 'date':
        return dayjs(value).format('DD/MM/YYYY');

      case 'datetime':
        return dayjs(value).format('DD/MM/YYYY HH:mm');

      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(value);

      case 'phone':
        return this.formatPhone(value);

      case 'document':
        return this.formatDocument(value);

      case 'activeOrNot':
        return value === true ? 'Ativo' : value === false ? 'Inativo' : '';

      default:
        return value;
    }
  }

  /**
   * Formata telefone
   */
  private formatPhone(phone: string): string {
    if (!phone) return '';

    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return phone;
  }

  /**
   * Formata documento (CPF/CNPJ)
   */
  private formatDocument(document: string): string {
    if (!document) return '';

    const cleanDoc = document.replace(/\D/g, '');

    if (cleanDoc.length === 11) {
      // CPF
      return cleanDoc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleanDoc.length === 14) {
      // CNPJ
      return cleanDoc.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      );
    }

    return document;
  }

  /**
   * Aplica estilos ao cabeçalho
   */
  private styleHeader(
    worksheet: XLSX.WorkSheet,
    columns: ExportColumn[]
  ): void {
    const headerRow = 1;

    columns.forEach((column, index) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });

      if (!worksheet[cellRef]) return;

      worksheet[cellRef].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '4472C4' } },
        alignment: {
          horizontal: column.headerAlign || 'left',
          vertical: 'center',
        },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      };
    });
  }

  /**
   * Ajusta automaticamente a largura das colunas
   */
  private autoSizeColumns(
    worksheet: XLSX.WorkSheet,
    data: any[],
    columns: ExportColumn[]
  ): void {
    const colWidths: number[] = [];

    columns.forEach((column, index) => {
      // Largura mínima baseada no título
      let maxWidth = column.title.length;

      // Verificar largura dos dados
      data.forEach(row => {
        const cellValue = String(row[column.title] || '');
        if (cellValue.length > maxWidth) {
          maxWidth = cellValue.length;
        }
      });

      // Limitar largura máxima e mínima
      colWidths[index] = Math.min(Math.max(maxWidth + 2, 10), 50);
    });

    worksheet['!cols'] = colWidths.map(width => ({ width }));
  }

  /**
   * Salva o arquivo Excel
   */
  private saveExcelFile(buffer: any, fileName: string): void {
    const data = new Blob([buffer], { type: 'application/octet-stream' });
    const timestamp = dayjs().format('YYYY-MM-DD_HH-mm-ss');
    const fullFileName = `${fileName}_${timestamp}.xlsx`;

    // Usar file-saver se disponível, senão fallback para download nativo
    if (typeof saveAs === 'function') {
      saveAs(data, fullFileName);
    } else {
      this.downloadFile(data, fullFileName);
    }
  }

  /**
   * Fallback para download de arquivo
   */
  private downloadFile(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Exporta dados simples para Excel (sem formatação especial)
   */
  exportSimple(data: any[], fileName = 'exportacao'): void {
    if (!data || data.length === 0) {
      console.warn('Nenhum dado para exportar');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveExcelFile(excelBuffer, fileName);
  }
}

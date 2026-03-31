import { Injectable } from '@angular/core';
import ExcelJS from 'exceljs';
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
  /**
   * Exporta dados para Excel (formatação preservada via ExcelJS).
   */
  async exportToExcel(
    data: any[],
    columns: ExportColumn[],
    fileName = 'exportacao',
    sheetName = 'Dados'
  ): Promise<void> {
    if (!data || data.length === 0) {
      console.warn('Nenhum dado para exportar');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Sellup';

    const sheet = workbook.addWorksheet(sheetName, {
      views: [{ state: 'frozen', ySplit: 1 }],
    });

    const headerFill: ExcelJS.Fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };

    const zebraFill: ExcelJS.Fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF3F4F6' },
    };

    const borderThin: Partial<ExcelJS.Borders> = {
      top: { style: 'thin', color: { argb: 'FFB4B4B4' } },
      left: { style: 'thin', color: { argb: 'FFB4B4B4' } },
      bottom: { style: 'thin', color: { argb: 'FFB4B4B4' } },
      right: { style: 'thin', color: { argb: 'FFB4B4B4' } },
    };

    const headerRow = sheet.addRow(columns.map(c => c.title));
    headerRow.height = 22;
    headerRow.eachCell((cell, colNumber) => {
      const col = columns[colNumber - 1];
      const horizontal = this.excelHorizontalAlign(col.headerAlign);
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      cell.fill = headerFill;
      cell.alignment = { vertical: 'middle', horizontal };
      cell.border = borderThin as ExcelJS.Borders;
    });

    data.forEach((item, rowIndex) => {
      const values = columns.map(col =>
        this.formatValue(item[col.dataKey], col.type)
      );
      const row = sheet.addRow(values);
      const isZebra = rowIndex % 2 === 1;
      row.eachCell((cell, colNumber) => {
        const col = columns[colNumber - 1];
        const horizontal = this.bodyHorizontalAlign(col.type);
        cell.alignment = { vertical: 'middle', horizontal };
        cell.border = borderThin as ExcelJS.Borders;
        if (isZebra) {
          cell.fill = zebraFill;
        }
      });
    });

    columns.forEach((col, idx) => {
      const width = this.estimateColumnWidth(col, sheet, idx + 1);
      sheet.getColumn(idx + 1).width = width;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    this.saveExcelFile(buffer, fileName);
  }

  private excelHorizontalAlign(
    headerAlign?: string
  ): 'left' | 'center' | 'right' {
    if (headerAlign === 'center') return 'center';
    if (headerAlign === 'right') return 'right';
    return 'left';
  }

  private bodyHorizontalAlign(type?: string): 'left' | 'right' {
    if (
      type === 'currency' ||
      type === 'number' ||
      type === 'percent'
    ) {
      return 'right';
    }
    return 'left';
  }

  private estimateColumnWidth(
    col: ExportColumn,
    sheet: ExcelJS.Worksheet,
    colNumber: number
  ): number {
    let max = col.title.length;
    const rowCount = sheet.rowCount;
    for (let r = 1; r <= rowCount; r++) {
      const cell = sheet.getRow(r).getCell(colNumber);
      const v = cell.value;
      const len = v != null ? String(v).length : 0;
      if (len > max) max = len;
    }
    return Math.min(Math.max(max + 2, 10), 50);
  }

  private formatValue(value: any, type?: string): string | number {
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
        }).format(Number(value));

      case 'phone':
        return this.formatPhone(String(value));

      case 'document':
        return this.formatDocument(String(value));

      case 'activeOrNot':
        return value === true ? 'Ativo' : value === false ? 'Inativo' : '';

      default:
        return typeof value === 'number' ? value : String(value);
    }
  }

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

  private formatDocument(document: string): string {
    if (!document) return '';

    const cleanDoc = document.replace(/\D/g, '');

    if (cleanDoc.length === 11) {
      return cleanDoc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleanDoc.length === 14) {
      return cleanDoc.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      );
    }

    return document;
  }

  private saveExcelFile(buffer: BlobPart, fileName: string): void {
    const data = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const timestamp = dayjs().format('YYYY-MM-DD_HH-mm-ss');
    const fullFileName = `${fileName}_${timestamp}.xlsx`;

    if (typeof saveAs === 'function') {
      saveAs(data, fullFileName);
    } else {
      this.downloadFile(data, fullFileName);
    }
  }

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
   * Exportação simples (chaves do primeiro registro como colunas).
   */
  async exportSimple(
    data: Record<string, unknown>[],
    fileName = 'exportacao'
  ): Promise<void> {
    if (!data || data.length === 0) {
      console.warn('Nenhum dado para exportar');
      return;
    }

    const keys = Object.keys(data[0]);
    const columns: ExportColumn[] = keys.map(k => ({
      title: k,
      dataKey: k,
    }));
    await this.exportToExcel(data, columns, fileName);
  }
}

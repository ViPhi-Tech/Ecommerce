import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import * as XLSX from 'xlsx';

dayjs.extend(customParseFormat);

export const randomId = () => {
  return Math.random().toString(36).substring(2, 15);
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const isCpfValid = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;

  return remainder === parseInt(cpf.charAt(10));
};

export const isCnpjValid = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/\D/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }

  let remainder = sum % 11;
  if (remainder < 2) remainder = 0;
  else remainder = 11 - remainder;

  if (remainder !== parseInt(cnpj.charAt(12))) return false;

  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }

  remainder = sum % 11;
  if (remainder < 2) remainder = 0;
  else remainder = 11 - remainder;

  return remainder === parseInt(cnpj.charAt(13));
};

export const formatDocument = (document: string): string => {
  const type = document.length > 11 ? 'cnpj' : 'cpf';
  if (type === 'cpf') {
    return formatCpf(document);
  } else if (type === 'cnpj') {
    return formatCnpj(document);
  }
  return document;
};

export const formatCpf = (cpf: string): string => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatCnpj = (cnpj: string): string => {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

export const formatPhone = (phone: string): string => {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

export const formatDate = (date: string): string => {
  if (date) {
    return dayjs(date).format('YYYY-MM-DD');
  }
  return '';
};

/** Data de conta a pagar/receber: envia ISO com +3h sobre o início do dia (DD/MM/AAAA do formulário). */
export const formatAccountsDateForBackend = (dateStr: string): string => {
  if (!dateStr || typeof dateStr !== 'string') return dateStr;
  const parsed = dayjs(dateStr, 'DD/MM/YYYY', true);
  if (!parsed.isValid()) return dateStr;
  return parsed.startOf('day').add(3, 'hour').toISOString();
};

export const formatCurrency = (value: number): string => {
  if (!value && value !== 0) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const convertFileToJson = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
    reader.readAsArrayBuffer(file);
  });
};

export const generateXlsxFile = (
  sheets: { data: any[]; sheetName: string; mandatoryColumns?: string[] }[],
  fileName: string
): void => {
  const wb = XLSX.utils.book_new();
  sheets.forEach(sheet => {
    const ws = XLSX.utils.json_to_sheet(sheet.data);
    // Make header row bold for mandatory columns
    for (const col in ws) {
      if (col[0] !== '!' && ws[col].v) {
        const match = col.match(/\d+/);
        if (
          match &&
          parseInt(match[0]) === 1 &&
          sheet.mandatoryColumns?.includes(ws[col].v)
        ) {
          if (!ws[col].s) ws[col].s = {};
          ws[col].s.font = { bold: true };
        }
      }
    }
    XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName);
  });
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

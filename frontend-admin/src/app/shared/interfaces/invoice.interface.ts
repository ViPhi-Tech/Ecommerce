export interface InvoiceDetails {
  ide: Ide;
  emitente: Emitente;
  destinatario: Destinatario;
  produtos: Produto[];
  totais: Totais;
  transporte: Transporte;
}

export interface Ide {
  numero: string;
  serie: string;
  dataEmissao: string;
  tipoOperacao: string;
  modelo: string;
}

export interface Emitente {
  nome: string;
  cnpj: string;
  endereco: Endereco;
}

export interface Endereco {
  xLgr: string;
  nro: string;
  xCpl: string;
  xBairro: string;
  cMun: string;
  xMun: string;
  UF: string;
  CEP: string;
  cPais: string;
  xPais: string;
  fone: string;
}

export interface Destinatario {
  nome: string;
  cnpj: string;
  endereco: Endereco2;
}

export interface Endereco2 {
  xLgr: string;
  nro: string;
  xCpl: string;
  xBairro: string;
  cMun: string;
  xMun: string;
  UF: string;
  CEP: string;
  cPais: string;
  xPais: string;
  fone: string;
}

export interface Produto {
  numeroItem: string;
  descricao: string;
  quantidade: string;
  unidade: string;
  valorUnitario: string;
  valorTotal: string;
  cfop: string;
}

export interface Totais {
  valorProdutos: string;
  valorNF: string;
  valorICMS: string;
  valorPIS: string;
  valorCOFINS: string;
}

export interface Transporte {
  modalidadeFrete: string;
  transportadora: Transportadora;
}

export interface Transportadora {
  CNPJ: string;
  xNome: string;
  IE: string;
  xEnder: string;
  xMun: string;
  UF: string;
}

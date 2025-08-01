import { isCnpjValid, isCpfValid } from '../utils/utils';

export const emailAsyncValidator = (control: any) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = emailPattern.test(control.value);
  return Promise.resolve(isValid ? null : { invalidEmail: true });
};

export const cnpjValidator = (control: any) => {
  const isValid = isCnpjValid(control.value);
  return Promise.resolve(isValid ? null : { invalidCnpj: true });
};

export const cpfValidator = (control: any) => {
  const isValid = isCpfValid(control.value);
  return Promise.resolve(isValid ? null : { invalidCpf: true });
};

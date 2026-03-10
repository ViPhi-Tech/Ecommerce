export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('Email já em uso');
    this.name = 'EmailAlreadyExistsError';
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super('Usuário não encontrado');
    this.name = 'UserNotFoundError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor(message?: string) {
    super(message ?? 'Email ou senha inválidos');
    this.name = 'InvalidCredentialsError';
  }
}


export class NullValueError extends Error {
  constructor(fieldName: string) {
    super(`O campo ${fieldName} não pode ser nulo ou indefinido`);
    this.name = 'NullValueError';
    Error.captureStackTrace(this, NullValueError); // Captura a stack trace, para facilitar o debug
  }
}
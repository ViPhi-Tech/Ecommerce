export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('Email already in use');
    this.name = 'EmailAlreadyExistsError';
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super('User not found');
    this.name = 'UserNotFoundError';
  }
}

export class InvalidCredentialsError extends Error {
  constructor(message?: string) {
    super(message ?? 'Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}


export class NullValueError extends Error {
  constructor(fieldName: string) {
    super(`The field ${fieldName} cannot be null or undefined`);
    this.name = 'NullValueError';
    Error.captureStackTrace(this, NullValueError); // Captura a stack trace, para facilitar o debug
  }
}
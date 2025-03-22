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
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}
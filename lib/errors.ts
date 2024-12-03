export class UnauthorizedError extends Error {
  status = 401;

  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class InvalidCredentialsError extends UnauthorizedError {
  constructor(message = "Invalid credentials") {
    super(message);
  }
}

export class ExistingUsernameError extends Error {
  constructor(message = "Username already taken") {
    super(message);
  }
}

export class ExistingEmailError extends Error {
  constructor(message = "Email already taken") {
    super(message);
  }
}

export class ValidationError extends Error {
  status = 400;

  constructor(message = "Validation Error") {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  status = 404;

  constructor(message = "Not Found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class InternalServerError extends Error {
  status = 500;

  constructor(message = "Internal Server Error") {
    super(message);
    this.name = "InternalServerError";
  }
}

export class FileNotFound extends NotFoundError {
  constructor(filePath: string) {
    super(`File not found: ${filePath}`);
  }
}

export class UnsupportedContentType extends Error {
  constructor(contentType: string) {
    super(`Unsupported Content-Type: ${contentType}`);
  }
}

export class ShortPassword extends Error {
  constructor(message = "Invalid password") {
    super(message);
  }
}

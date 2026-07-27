export type AppErrorCode =
  | "AUTHENTICATION_REQUIRED"
  | "ACTIVE_ORGANIZATION_REQUIRED"
  | "FORBIDDEN"
  | "INVALID_INPUT"
  | "NOT_FOUND"
  | "CONFLICT"
  | "CONFIGURATION_ERROR"
  | "INTERNAL_ERROR";

type AppErrorOptions = {
  status: number;
  expose?: boolean;
  cause?: unknown;
  details?: Readonly<Record<string, unknown>>;
};

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number;
  readonly expose: boolean;
  readonly details: Readonly<Record<string, unknown>> | undefined;

  constructor(code: AppErrorCode, message: string, options: AppErrorOptions) {
    super(message, { cause: options.cause });
    this.name = "AppError";
    this.code = code;
    this.status = options.status;
    this.expose = options.expose ?? false;
    this.details = options.details;
  }
}

export class AuthenticationRequiredError extends AppError {
  constructor() {
    super("AUTHENTICATION_REQUIRED", "Authentication is required.", {
      status: 401,
      expose: true,
    });
    this.name = "AuthenticationRequiredError";
  }
}

export class ActiveOrganizationRequiredError extends AppError {
  constructor() {
    super("ACTIVE_ORGANIZATION_REQUIRED", "Select or create a workspace to continue.", {
      status: 403,
      expose: true,
    });
    this.name = "ActiveOrganizationRequiredError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action.") {
    super("FORBIDDEN", message, { status: 403, expose: true });
    this.name = "ForbiddenError";
  }
}

export class InvalidInputError extends AppError {
  constructor(message: string, options?: { cause?: unknown }) {
    super("INVALID_INPUT", message, {
      status: 400,
      expose: true,
      cause: options?.cause,
    });
    this.name = "InvalidInputError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "The requested record was not found.") {
    super("NOT_FOUND", message, { status: 404, expose: true });
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string, options?: { cause?: unknown }) {
    super("CONFLICT", message, {
      status: 409,
      expose: true,
      cause: options?.cause,
    });
    this.name = "ConflictError";
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string, options?: { cause?: unknown }) {
    super("CONFIGURATION_ERROR", message, {
      status: 500,
      cause: options?.cause,
    });
    this.name = "ConfigurationError";
  }
}

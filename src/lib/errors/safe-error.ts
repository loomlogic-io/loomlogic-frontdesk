import { AppError } from "@/lib/errors/app-error";

export type SafeError = {
  code: string;
  message: string;
  requestId: string;
};

export function toSafeError(error: unknown, requestId: string): SafeError {
  if (error instanceof AppError && error.expose) {
    return {
      code: error.code,
      message: error.message,
      requestId,
    };
  }

  return {
    code: "INTERNAL_ERROR",
    message: "Something went wrong. Try again or contact support with the request ID.",
    requestId,
  };
}

export function toSafeErrorResponse(error: unknown, requestId: string) {
  const safeError = toSafeError(error, requestId);
  const status = error instanceof AppError ? error.status : 500;

  return Response.json({ error: safeError }, { status });
}

const REQUEST_ID_PATTERN = /^[A-Za-z0-9._:-]{8,128}$/;

export function resolveRequestId(headers: Headers): string {
  const candidate = headers.get("x-request-id");

  if (candidate && REQUEST_ID_PATTERN.test(candidate)) {
    return candidate;
  }

  return crypto.randomUUID();
}

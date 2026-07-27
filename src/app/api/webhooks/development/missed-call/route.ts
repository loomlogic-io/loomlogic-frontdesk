import { createAdminSupabaseClient } from "@/lib/db/admin";
import { getServerEnvironment } from "@/lib/env/server";
import { ConfigurationError, InvalidInputError } from "@/lib/errors/app-error";
import { toSafeErrorResponse } from "@/lib/errors/safe-error";
import { logger } from "@/lib/logging/logger";
import { resolveRequestId } from "@/lib/request/request-id";
import { RecoveryCommandRepository } from "@/modules/recovery/repositories/recovery-command-repository";
import { missedCallFixtureSchema } from "@/modules/recovery/schemas/recovery-schemas";
import { IngestMissedCallService } from "@/modules/recovery/services/ingest-missed-call";
import {
  payloadSha256,
  verifyDevelopmentWebhook,
} from "@/modules/recovery/webhooks/development-signature";
import type { Json } from "@/types/database.generated";

export const runtime = "nodejs";

const MAX_PAYLOAD_BYTES = 64 * 1024;

export async function POST(request: Request) {
  const requestId = resolveRequestId(request.headers);

  if (process.env.NODE_ENV === "production") {
    return Response.json(
      {
        error: {
          code: "NOT_FOUND",
          message: "Not found.",
          requestId,
        },
      },
      { status: 404 },
    );
  }

  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_PAYLOAD_BYTES) {
      return Response.json(
        {
          error: {
            code: "PAYLOAD_TOO_LARGE",
            message: "Development fixture payload is too large.",
            requestId,
          },
        },
        { status: 413 },
      );
    }

    const environment = getServerEnvironment();
    if (!environment.DEV_WEBHOOK_SIGNING_SECRET) {
      throw new ConfigurationError(
        "DEV_WEBHOOK_SIGNING_SECRET is required for the development webhook.",
      );
    }

    const signatureIsValid = verifyDevelopmentWebhook({
      rawBody,
      timestamp: request.headers.get("x-loomlogic-timestamp"),
      signature: request.headers.get("x-loomlogic-signature"),
      secret: environment.DEV_WEBHOOK_SIGNING_SECRET,
    });

    if (!signatureIsValid) {
      logger.warn("development_webhook_rejected", {
        requestId,
        reason: "invalid_signature_or_timestamp",
      });

      return Response.json(
        {
          error: {
            code: "INVALID_SIGNATURE",
            message: "The development webhook signature is invalid or expired.",
            requestId,
          },
        },
        { status: 401 },
      );
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawBody);
    } catch (error) {
      throw new InvalidInputError("The development fixture must contain valid JSON.", {
        cause: error,
      });
    }

    const parsedFixture = missedCallFixtureSchema.safeParse(parsedJson);
    if (!parsedFixture.success) {
      throw new InvalidInputError("The development missed-call fixture is invalid.", {
        cause: parsedFixture.error,
      });
    }

    const repository = new RecoveryCommandRepository(createAdminSupabaseClient());
    const service = new IngestMissedCallService(repository);
    const result = await service.execute({
      fixture: parsedFixture.data,
      rawPayload: parsedJson as Json,
      payloadHash: payloadSha256(rawBody),
      requestId,
      receivedAt: new Date(),
    });

    logger.info("development_webhook_processed", {
      requestId,
      provider: "development_fixture",
      providerEventId: parsedFixture.data.provider_event_id,
      recoveryCaseId: result.recoveryCaseId,
      duplicate: result.duplicate,
    });

    return Response.json(
      {
        data: {
          accepted: true,
          duplicate: result.duplicate,
          recoveryCaseId: result.recoveryCaseId,
          reference: result.reference,
        },
        requestId,
      },
      {
        status: result.duplicate ? 200 : 202,
        headers: { "x-request-id": requestId },
      },
    );
  } catch (error) {
    logger.error("development_webhook_failed", {
      requestId,
      error,
    });
    return toSafeErrorResponse(error, requestId);
  }
}

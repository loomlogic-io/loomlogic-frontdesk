import { ForbiddenError } from "@/lib/errors/app-error";

const mutationRoles = new Set([
  "org:owner",
  "org:admin",
  "org:manager",
  "org:member",
  "owner",
  "admin",
  "manager",
  "member",
]);

const approvalRoles = new Set([
  "org:owner",
  "org:admin",
  "org:manager",
  "owner",
  "admin",
  "manager",
]);

export function assertCanManageRecovery(role: string | null) {
  if (!role || !mutationRoles.has(role)) {
    throw new ForbiddenError("Your workspace role cannot modify Recovery Cases.");
  }
}

export function assertCanApproveCustomerContact(role: string | null) {
  if (!role || !approvalRoles.has(role)) {
    throw new ForbiddenError("A manager or administrator must approve customer contact.");
  }
}

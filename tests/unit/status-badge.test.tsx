import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "@/components/ui/status-badge";

function toneOf(status: string) {
  const { container } = render(<StatusBadge status={status} />);
  return container.firstElementChild?.getAttribute("data-tone") ?? "";
}

describe("StatusBadge", () => {
  it("renders a readable label, never colour alone", () => {
    render(<StatusBadge status="awaiting_customer" />);
    expect(screen.getByText("awaiting customer")).toBeInTheDocument();
  });

  it("treats recovered outcomes as success", () => {
    for (const status of ["booked", "recovered", "sent", "approved"]) {
      expect(toneOf(status)).toBe("success");
    }
  });

  it("separates a genuine failure from work that needs attention", () => {
    // Regression: `failed` previously shared the warning set with `new` and
    // `pending`, and that set rendered neutral foreground text, so a failed
    // send was visually identical to a brand-new case.
    expect(toneOf("failed")).toBe("danger");
    expect(toneOf("new")).toBe("attention");
    expect(toneOf("failed")).not.toBe(toneOf("new"));
  });

  it("treats terminal non-recovered states as muted", () => {
    for (const status of ["lost", "closed", "opted_out", "disqualified"]) {
      expect(toneOf(status)).toBe("muted");
    }
  });

  it("gives every documented Recovery Case state an explicit tone", () => {
    const expectedTones = {
      new: "attention",
      engaging: "progress",
      qualified: "progress",
      awaiting_customer: "progress",
      awaiting_staff: "attention",
      booking_offered: "progress",
      booked: "success",
      escalated: "attention",
      recovered: "success",
      disqualified: "muted",
      opted_out: "muted",
      lost: "muted",
      closed: "muted",
    } as const;

    for (const [status, expectedTone] of Object.entries(expectedTones)) {
      expect(toneOf(status)).toBe(expectedTone);
    }
  });

  it("is case-insensitive and falls back without throwing", () => {
    expect(toneOf("BOOKED")).toBe("success");
    expect(toneOf("some_unmapped_state")).toBe("progress");
  });
});

/** Freshness window (hours). Change this one number to adjust the demo threshold. */
export const FRESHNESS_HOURS = 24;

export type ReportType = "available" | "unavailable" | "restricted";
export type TrustStatus = "recent" | "stale" | "uncertain";

export interface ReportLike {
  report_type: string;
  created_at: string;
  is_demo: boolean;
}

export interface TrustResult {
  status: TrustStatus;
  label: string;
  reason: string;
}

export const REPORT_LABELS: Record<ReportType, string> = {
  available: "Still Available",
  unavailable: "Unavailable",
  restricted: "Access Restricted",
};

export function timeAgo(iso: string | null | undefined, now = Date.now()): string {
  if (!iso) return "Never";
  const diff = Math.max(0, now - new Date(iso).getTime());
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h} hr ago`;
  return `${Math.round(h / 24)} days ago`;
}

export function computeTrust(
  lastConfirmedAt: string | null,
  reports: ReportLike[],
  now = Date.now(),
): TrustResult {
  const windowMs = FRESHNESS_HOURS * 3600 * 1000;
  const recent = reports.filter((r) => now - new Date(r.created_at).getTime() <= windowMs);
  const communityNote = "Based on community reports, not independent verification.";

  if (recent.length > 0) {
    const pos = recent.filter((r) => r.report_type === "available").length;
    const neg = recent.length - pos;
    if (pos > 0 && neg > 0) {
      return {
        status: "uncertain",
        label: "Status Uncertain",
        reason: `In the last ${FRESHNESS_HOURS} hours, ${pos} report(s) said available and ${neg} said unavailable or restricted. ${communityNote}`,
      };
    }
    if (neg > 0) {
      return {
        status: "uncertain",
        label: "Status Uncertain",
        reason: `${neg} recent report(s) said this place is unavailable or restricted. ${communityNote}`,
      };
    }
    return {
      status: "recent",
      label: "Recently Confirmed",
      reason: `${pos} report(s) in the last ${FRESHNESS_HOURS} hours said it is available. ${communityNote}`,
    };
  }

  if (lastConfirmedAt && now - new Date(lastConfirmedAt).getTime() <= windowMs) {
    return {
      status: "recent",
      label: "Recently Confirmed",
      reason: `Last confirmed ${timeAgo(lastConfirmedAt, now)} by the listed source. No community reports in the last ${FRESHNESS_HOURS} hours.`,
    };
  }

  return {
    status: "stale",
    label: "Needs Reconfirmation",
    reason: lastConfirmedAt
      ? `Last confirmed ${timeAgo(lastConfirmedAt, now)} — older than ${FRESHNESS_HOURS} hours.`
      : "This place has never been confirmed.",
  };
}

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

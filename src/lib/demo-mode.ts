import type { User } from "@supabase/supabase-js";
import type { FacilityReport, FacilityWithReports } from "./facilities";

export const DEMO_STORAGE_KEY = "aera_demo_mode_active";
export const DEMO_SAVED_KEY = "aera_demo_saved_ids";
export const DEMO_REPORTS_KEY = "aera_demo_reports";

export const DEMO_USER: User = {
  id: "00000000-0000-demo-user-000000000000",
  app_metadata: { provider: "demo" },
  user_metadata: {
    display_name: "AERA Demo Judge",
    email: "aera.demo@example.com",
    is_demo: true,
  },
  aud: "authenticated",
  confirmation_sent_at: "2026-01-01T00:00:00Z",
  confirmed_at: "2026-01-01T00:00:00Z",
  created_at: "2026-01-01T00:00:00Z",
  email: "aera.demo@example.com",
  phone: "",
  role: "authenticated",
  updated_at: new Date().toISOString(),
} as User;

// Initial sample facilities with verified coordinates in Hyderabad for the interactive map
export const INITIAL_SAMPLE_FACILITIES: FacilityWithReports[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    name: "Sample Water Kiosk A",
    category: "water",
    description: "Fictional drinking water point used to show a recently confirmed place.",
    address: "Koti Bus Station Circle, Sample Street 1 (fictional)",
    latitude: 17.385,
    longitude: 78.4867,
    opening_hours: "6:00 AM – 9:00 PM (sample)",
    has_water: true,
    has_shade: true,
    has_seating: false,
    is_free: true,
    public_access: true,
    resting_allowed: true,
    verification_source: "Fictional sample data",
    last_confirmed_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    is_demo: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    facility_reports: [
      {
        id: "192afc2a-5292-48af-bbd8-e92c66ed7166",
        facility_id: "00000000-0000-4000-8000-000000000001",
        report_type: "available",
        comment: "Sample report: water was cool and flowing.",
        is_demo: true,
        user_id: null,
        created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    name: "Sample Shaded Bench B",
    category: "shade",
    description: "Fictional shaded resting spot under leafy trees, open to all outdoor workers.",
    address: "Gandhi Bhavan Road, Sample Street 2 (fictional)",
    latitude: 17.3882,
    longitude: 78.4895,
    opening_hours: "Open 24 hours",
    has_water: false,
    has_shade: true,
    has_seating: true,
    is_free: true,
    public_access: true,
    resting_allowed: true,
    verification_source: "Fictional sample data",
    last_confirmed_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    is_demo: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    facility_reports: [
      {
        id: "2a34fc2a-5292-48af-bbd8-e92c66ed7167",
        facility_id: "00000000-0000-4000-8000-000000000002",
        report_type: "available",
        comment: "Sample report: clean bench with dense tree shade.",
        is_demo: true,
        user_id: null,
        created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    name: "Sample Rest Shelter C",
    category: "rest",
    description: "Covered municipal shelter with seated rest area and overhead fan.",
    address: "Abids Traffic Island, Sample Street 3 (fictional)",
    latitude: 17.382,
    longitude: 78.484,
    opening_hours: "7:00 AM – 8:00 PM",
    has_water: true,
    has_shade: true,
    has_seating: true,
    is_free: true,
    public_access: true,
    resting_allowed: true,
    verification_source: "Fictional sample data",
    last_confirmed_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    is_demo: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    facility_reports: [
      {
        id: "3b45fc2a-5292-48af-bbd8-e92c66ed7168",
        facility_id: "00000000-0000-4000-8000-000000000003",
        report_type: "available",
        comment: "Sample report: shelter intact and shaded.",
        is_demo: true,
        user_id: null,
        created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    name: "Sample Covered Spot D",
    category: "shade",
    description: "Wide covered arcade with protection from midday sun.",
    address: "Station Road Arcade, Sample Street 4 (fictional)",
    latitude: 17.3895,
    longitude: 78.4835,
    opening_hours: "Open 24 hours",
    has_water: false,
    has_shade: true,
    has_seating: false,
    is_free: true,
    public_access: true,
    resting_allowed: true,
    verification_source: "Fictional sample data",
    last_confirmed_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    is_demo: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    facility_reports: [],
  },
  {
    id: "00000000-0000-4000-8000-000000000005",
    name: "Public Chilled Water ATM",
    category: "water",
    description:
      "Reverse osmosis purified cold drinking water station for street vendors and delivery riders.",
    address: "Mozamjahi Market Crossing (fictional)",
    latitude: 17.3838,
    longitude: 78.4795,
    opening_hours: "5:30 AM – 10:00 PM",
    has_water: true,
    has_shade: true,
    has_seating: false,
    is_free: true,
    public_access: true,
    resting_allowed: true,
    verification_source: "Fictional sample data",
    last_confirmed_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    is_demo: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    facility_reports: [
      {
        id: "5d67fc2a-5292-48af-bbd8-e92c66ed7170",
        facility_id: "00000000-0000-4000-8000-000000000005",
        report_type: "available",
        comment: "Sample report: tap running strong, very cold water.",
        is_demo: true,
        user_id: null,
        created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "00000000-0000-4000-8000-000000000006",
    name: "Municipal Park Banyan Canopy",
    category: "rest",
    description:
      "Wide natural tree canopy with continuous natural shade, stone benches and cool breeze.",
    address: "Public Gardens Gate 3 (fictional)",
    latitude: 17.3912,
    longitude: 78.474,
    opening_hours: "5:00 AM – 8:30 PM",
    has_water: true,
    has_shade: true,
    has_seating: true,
    is_free: true,
    public_access: true,
    resting_allowed: true,
    verification_source: "Fictional sample data",
    last_confirmed_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    is_demo: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    facility_reports: [
      {
        id: "6e78fc2a-5292-48af-bbd8-e92c66ed7171",
        facility_id: "00000000-0000-4000-8000-000000000006",
        report_type: "available",
        comment: "Sample report: great shade during peak heat hours.",
        is_demo: true,
        user_id: null,
        created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      },
    ],
  },
];

export function isDemoModeActive(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(DEMO_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setDemoModeActive(active: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (active) {
      localStorage.setItem(DEMO_STORAGE_KEY, "true");
      // Pre-seed demo saved places with 1 sample item so judges immediately see the Saved tab working
      if (!localStorage.getItem(DEMO_SAVED_KEY)) {
        localStorage.setItem(
          DEMO_SAVED_KEY,
          JSON.stringify(["00000000-0000-4000-8000-000000000001"]),
        );
      }
    } else {
      localStorage.removeItem(DEMO_STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent("aera-demo-mode-change", { detail: { active } }));
  } catch {
    // ignore
  }
}

export function getDemoSavedIds(): string[] {
  if (typeof window === "undefined") return ["00000000-0000-4000-8000-000000000001"];
  try {
    const raw = localStorage.getItem(DEMO_SAVED_KEY);
    if (!raw) return ["00000000-0000-4000-8000-000000000001"];
    return JSON.parse(raw);
  } catch {
    return ["00000000-0000-4000-8000-000000000001"];
  }
}

export function toggleDemoSavedId(facilityId: string): boolean {
  const current = getDemoSavedIds();
  const exists = current.includes(facilityId);
  const updated = exists ? current.filter((id) => id !== facilityId) : [...current, facilityId];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(DEMO_SAVED_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("aera-demo-saved-change", { detail: { updated } }));
    } catch {
      // ignore
    }
  }
  return !exists;
}

export function getDemoReports(): FacilityReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DEMO_REPORTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addDemoReport(report: {
  facility_id: string;
  report_type: string;
  comment?: string | null;
}): FacilityReport {
  const newReport: FacilityReport = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `demo-report-${Date.now()}`,
    facility_id: report.facility_id,
    report_type: report.report_type,
    comment: report.comment ?? null,
    is_demo: true,
    user_id: DEMO_USER.id,
    created_at: new Date().toISOString(),
  };

  const existing = getDemoReports();
  const updated = [newReport, ...existing];

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(DEMO_REPORTS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("aera-demo-reports-change", { detail: { updated } }));
    } catch {
      // ignore
    }
  }

  return newReport;
}

export function resetDemoState(): void {
  if (typeof window === "undefined") return;
  try {
    // Reset saved places to initial 1 sample place
    localStorage.setItem(DEMO_SAVED_KEY, JSON.stringify(["00000000-0000-4000-8000-000000000001"]));
    // Clear user-added demo reports
    localStorage.removeItem(DEMO_REPORTS_KEY);
    // Notify listeners
    window.dispatchEvent(new CustomEvent("aera-demo-reset"));
  } catch {
    // ignore
  }
}

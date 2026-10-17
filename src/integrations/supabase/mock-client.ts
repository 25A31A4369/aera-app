// In-memory mock Supabase client for local development / preview without live credentials
import type { Session, User } from "@supabase/supabase-js";

export interface MockFacility {
  id: string;
  name: string;
  category: "water" | "shade" | "rest";
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  opening_hours: string | null;
  has_water: boolean | null;
  has_shade: boolean | null;
  has_seating: boolean | null;
  is_free: boolean | null;
  public_access: boolean | null;
  resting_allowed: boolean | null;
  verification_source: string | null;
  last_confirmed_at: string | null;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface MockReport {
  id: string;
  facility_id: string;
  user_id: string | null;
  report_type: "available" | "unavailable" | "restricted";
  comment: string | null;
  is_demo: boolean;
  created_at: string;
  [key: string]: unknown;
}

export interface MockSavedFacility {
  id: string;
  user_id: string;
  facility_id: string;
  created_at: string;
  [key: string]: unknown;
}

interface FilterRule {
  field: string;
  value: unknown;
}

const INITIAL_FACILITIES: MockFacility[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    name: "Sample Water Kiosk A",
    category: "water",
    description: "Fictional drinking water point used to show a recently confirmed place.",
    address: "Sample Street 1 (fictional)",
    latitude: 37.7749,
    longitude: -122.4194,
    opening_hours: "6:00 AM – 9:00 PM (sample)",
    has_water: true,
    has_shade: true,
    has_seating: false,
    is_free: true,
    public_access: true,
    resting_allowed: true,
    verification_source: "Fictional sample data",
    last_confirmed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    is_demo: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    name: "Sample Shaded Bench B",
    category: "shade",
    description: "Fictional shaded seating area whose information is old.",
    address: "Sample Park Road (fictional)",
    latitude: 37.7755,
    longitude: -122.418,
    opening_hours: null,
    has_water: false,
    has_shade: true,
    has_seating: true,
    is_free: true,
    public_access: true,
    resting_allowed: true,
    verification_source: "Fictional sample data",
    last_confirmed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    is_demo: true,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    name: "Sample Rest Shelter C",
    category: "rest",
    description: "Fictional rest shelter with conflicting community reports.",
    address: "Sample Market Lane (fictional)",
    latitude: 37.776,
    longitude: -122.421,
    opening_hours: null,
    has_water: true,
    has_shade: true,
    has_seating: true,
    is_free: true,
    public_access: true,
    resting_allowed: null,
    verification_source: "Fictional sample data",
    last_confirmed_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    is_demo: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    name: "Sample Covered Spot D",
    category: "shade",
    description: "Fictional location with unknown access details.",
    address: null,
    latitude: 37.774,
    longitude: -122.42,
    opening_hours: null,
    has_water: null,
    has_shade: true,
    has_seating: null,
    is_free: null,
    public_access: null,
    resting_allowed: null,
    verification_source: null,
    last_confirmed_at: null,
    is_demo: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_REPORTS: MockReport[] = [
  {
    id: "report-1",
    facility_id: "00000000-0000-4000-8000-000000000001",
    user_id: null,
    report_type: "available",
    comment: "Sample report: water was flowing.",
    is_demo: true,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "report-2",
    facility_id: "00000000-0000-4000-8000-000000000001",
    user_id: null,
    report_type: "available",
    comment: null,
    is_demo: true,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "report-3",
    facility_id: "00000000-0000-4000-8000-000000000002",
    user_id: null,
    report_type: "available",
    comment: "Sample report from long ago.",
    is_demo: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "report-4",
    facility_id: "00000000-0000-4000-8000-000000000003",
    user_id: null,
    report_type: "available",
    comment: "Sample report: open.",
    is_demo: true,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "report-5",
    facility_id: "00000000-0000-4000-8000-000000000003",
    user_id: null,
    report_type: "unavailable",
    comment: "Sample report: gate was locked.",
    is_demo: true,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

// Persistent state across component renders
const facilitiesStore: MockFacility[] = JSON.parse(
  JSON.stringify(INITIAL_FACILITIES),
) as MockFacility[];
const reportsStore: MockReport[] = JSON.parse(JSON.stringify(INITIAL_REPORTS)) as MockReport[];
const savedFacilitiesStore: MockSavedFacility[] = [];
const authListeners = new Set<(event: string, session: Session | null) => void>();

let currentSession: Session | null = null;

// Try to restore session from localStorage if in browser
if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem("aera_mock_session");
    if (raw) {
      currentSession = JSON.parse(raw) as Session;
    }
  } catch {
    // ignore
  }
}

function persistSession(session: Session | null) {
  currentSession = session;
  if (typeof window !== "undefined") {
    try {
      if (session) {
        localStorage.setItem("aera_mock_session", JSON.stringify(session));
      } else {
        localStorage.removeItem("aera_mock_session");
      }
    } catch {
      // ignore
    }
  }
  for (const listener of authListeners) {
    try {
      listener(session ? "SIGNED_IN" : "SIGNED_OUT", session);
    } catch {
      // ignore
    }
  }
}

interface RegisteredAccount {
  password: string;
  user: User;
}

const mockRegisteredAccounts = new Map<string, RegisteredAccount>([
  [
    "aera.demo@example.com",
    {
      password: "AeraDemo@2026",
      user: {
        id: "mock-demo-user-00000000-0000-0000",
        email: "aera.demo@example.com",
        app_metadata: { provider: "email" },
        user_metadata: { display_name: "AERA Demo", email: "aera.demo@example.com" },
        aud: "authenticated",
        created_at: "2026-01-01T00:00:00Z",
      } as User,
    },
  ],
]);

export function createMockSupabaseClient() {
  const auth = {
    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
      authListeners.add(callback);
      // Immediately notify of current state
      setTimeout(() => {
        callback(currentSession ? "INITIAL_SESSION" : "SIGNED_OUT", currentSession);
      }, 0);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authListeners.delete(callback);
            },
          },
        },
      };
    },
    async getSession() {
      return { data: { session: currentSession }, error: null };
    },
    async getUser() {
      return { data: { user: currentSession?.user ?? null }, error: null };
    },
    async signInWithPassword({ email, password }: { email: string; password?: string }) {
      const normalizedEmail = email.toLowerCase().trim();
      const account = mockRegisteredAccounts.get(normalizedEmail);
      if (!account) {
        return {
          data: { user: null, session: null },
          error: { message: "Invalid login credentials. User account not found." },
        };
      }
      if (account.password !== password) {
        return {
          data: { user: null, session: null },
          error: { message: "Invalid login credentials. Incorrect password." },
        };
      }
      const user = account.user;
      const session: Session = {
        access_token: "mock-jwt-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "mock-refresh-token",
        user,
      };
      persistSession(session);
      return { data: { user, session }, error: null };
    },
    async signUp({
      email,
      password,
      options,
    }: {
      email: string;
      password?: string;
      options?: { data?: Record<string, unknown> };
    }) {
      const normalizedEmail = email.toLowerCase().trim();
      const user: User = {
        id:
          "mock-user-" +
          Math.abs(
            normalizedEmail.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0),
          ),
        email: normalizedEmail,
        app_metadata: {},
        user_metadata: {
          display_name: options?.data?.["display_name"] || normalizedEmail.split("@")[0],
        },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      };
      if (password) {
        mockRegisteredAccounts.set(normalizedEmail, { password, user });
      }
      const session: Session = {
        access_token: "mock-jwt-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "mock-refresh-token",
        user,
      };
      persistSession(session);
      return { data: { user, session }, error: null };
    },
    async signOut() {
      persistSession(null);
      return { error: null };
    },
    async resetPasswordForEmail() {
      return { data: {}, error: null };
    },
    async updateUser({ password: _ }: { password?: string }) {
      return { data: { user: currentSession?.user ?? null }, error: null };
    },
  };

  function from(table: string) {
    let operation: "select" | "insert" | "delete" | "update" = "select";
    let insertData: unknown = null;
    let _selectFields = "*";
    const filters: FilterRule[] = [];
    let orderField: string | null = null;
    let orderAscending = true;
    let isSingle = false;

    type MockQueryResult = { data: unknown; error: unknown };

    interface MockBuilder {
      select: (fields?: string) => MockBuilder;
      insert: (data: unknown) => MockBuilder;
      delete: () => MockBuilder;
      update: (data: unknown) => MockBuilder;
      eq: (field: string, value: unknown) => MockBuilder;
      order: (
        field: string,
        options?: { ascending?: boolean; referencedTable?: string },
      ) => MockBuilder;
      maybeSingle: () => MockBuilder;
      single: () => MockBuilder;
      then: (
        resolve: (res: MockQueryResult) => void,
        reject?: (err: unknown) => void,
      ) => Promise<void>;
    }

    const builder: MockBuilder = {
      select(fields = "*") {
        operation = "select";
        _selectFields = fields;
        return builder;
      },
      insert(data: unknown) {
        operation = "insert";
        insertData = data;
        return builder;
      },
      delete() {
        operation = "delete";
        return builder;
      },
      update(data: unknown) {
        operation = "update";
        insertData = data;
        return builder;
      },
      eq(field: string, value: unknown) {
        filters.push({ field, value });
        return builder;
      },
      order(field: string, options?: { ascending?: boolean; referencedTable?: string }) {
        if (!options?.referencedTable) {
          orderField = field;
          orderAscending = options?.ascending ?? true;
        }
        return builder;
      },
      maybeSingle() {
        isSingle = true;
        return builder;
      },
      single() {
        isSingle = true;
        return builder;
      },
      async then(resolve: (res: MockQueryResult) => void, reject?: (err: unknown) => void) {
        try {
          const res = await execute();
          resolve(res);
        } catch (err) {
          if (reject) reject(err);
          else resolve({ data: null, error: err });
        }
      },
    };

    async function execute(): Promise<MockQueryResult> {
      if (table === "facilities") {
        if (operation === "select") {
          let list = [...facilitiesStore];
          for (const f of filters) {
            list = list.filter((item) => item[f.field] === f.value);
          }
          if (orderField) {
            const field = orderField;
            list.sort((a, b) => {
              const va = String(a[field] ?? "");
              const vb = String(b[field] ?? "");
              if (va < vb) return orderAscending ? -1 : 1;
              if (va > vb) return orderAscending ? 1 : -1;
              return 0;
            });
          }

          // Hydrate facility_reports if requested
          const hydrated = list.map((facility) => {
            const reports = reportsStore
              .filter((r) => r.facility_id === facility.id)
              .sort((a, b) => b.created_at.localeCompare(a.created_at));
            return {
              ...facility,
              facility_reports: reports,
            };
          });

          if (isSingle) {
            return { data: hydrated[0] ?? null, error: null };
          }
          return { data: hydrated, error: null };
        }
      }

      if (table === "facility_reports") {
        if (operation === "select") {
          let list = [...reportsStore];
          for (const f of filters) {
            list = list.filter((item) => item[f.field] === f.value);
          }
          if (orderField) {
            const field = orderField;
            list.sort((a, b) => {
              const va = String(a[field] ?? "");
              const vb = String(b[field] ?? "");
              if (va < vb) return orderAscending ? -1 : 1;
              if (va > vb) return orderAscending ? 1 : -1;
              return 0;
            });
          }

          // Hydrate facilities(name, is_demo) if requested
          const hydrated = list.map((report) => {
            const facility = facilitiesStore.find((f) => f.id === report.facility_id);
            return {
              ...report,
              facilities: facility ? { name: facility.name, is_demo: facility.is_demo } : null,
            };
          });

          if (isSingle) {
            return { data: hydrated[0] ?? null, error: null };
          }
          return { data: hydrated, error: null };
        }

        if (operation === "insert") {
          const items = Array.isArray(insertData)
            ? (insertData as Array<Record<string, unknown>>)
            : [insertData as Record<string, unknown>];
          for (const item of items) {
            const newReport: MockReport = {
              id: "report-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
              facility_id: String(item["facility_id"]),
              user_id: (item["user_id"] as string | null) ?? currentSession?.user?.id ?? null,
              report_type: item["report_type"] as "available" | "unavailable" | "restricted",
              comment: (item["comment"] as string | null) ?? null,
              is_demo: false,
              created_at: new Date().toISOString(),
            };
            reportsStore.unshift(newReport);

            // Trigger emulation: if 'available', update facility last_confirmed_at
            if (newReport.report_type === "available") {
              const fac = facilitiesStore.find((f) => f.id === newReport.facility_id);
              if (fac) {
                fac.last_confirmed_at = newReport.created_at;
                fac.updated_at = new Date().toISOString();
              }
            }
          }
          return { data: insertData, error: null };
        }
      }

      if (table === "saved_facilities") {
        if (operation === "select") {
          let list = [...savedFacilitiesStore];
          for (const f of filters) {
            list = list.filter((item) => item[f.field] === f.value);
          }
          if (orderField) {
            const field = orderField;
            list.sort((a, b) => {
              const va = String(a[field] ?? "");
              const vb = String(b[field] ?? "");
              if (va < vb) return orderAscending ? -1 : 1;
              if (va > vb) return orderAscending ? 1 : -1;
              return 0;
            });
          }
          return { data: list, error: null };
        }

        if (operation === "insert") {
          const items = Array.isArray(insertData)
            ? (insertData as Array<Record<string, unknown>>)
            : [insertData as Record<string, unknown>];
          for (const item of items) {
            const facilityId = String(item["facility_id"]);
            const userId = String(item["user_id"]);
            const existing = savedFacilitiesStore.find(
              (s) => s.facility_id === facilityId && s.user_id === userId,
            );
            if (!existing) {
              savedFacilitiesStore.push({
                id: "saved-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
                facility_id: facilityId,
                user_id: userId,
                created_at: new Date().toISOString(),
              });
            }
          }
          return { data: insertData, error: null };
        }

        if (operation === "delete") {
          for (let i = savedFacilitiesStore.length - 1; i >= 0; i--) {
            const item = savedFacilitiesStore[i];
            if (!item) continue;
            let match = true;
            for (const f of filters) {
              if (item[f.field] !== f.value) {
                match = false;
                break;
              }
            }
            if (match) {
              savedFacilitiesStore.splice(i, 1);
            }
          }
          return { data: null, error: null };
        }
      }

      if (table === "profiles") {
        return { data: null, error: null };
      }

      return { data: [], error: null };
    }

    return builder;
  }

  return {
    auth,
    from,
  };
}

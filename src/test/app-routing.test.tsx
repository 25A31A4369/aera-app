import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

describe("App routing", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

  it("matches a page for / instead of falling back to not found", () => {
    const matches = router.matchRoutes("/");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches /auth route", () => {
    const matches = router.matchRoutes("/auth");
    expect(matches.at(-1)?.routeId).toBe("/auth");
  });

  it("matches the 4 navigation destinations", () => {
    expect(router.matchRoutes("/").at(-1)?.routeId).toBe("/");
    expect(router.matchRoutes("/saved").at(-1)?.routeId).toBe("/saved");
    expect(router.matchRoutes("/history").at(-1)?.routeId).toBe("/history");
    expect(router.matchRoutes("/profile").at(-1)?.routeId).toBe("/profile");
  });
});

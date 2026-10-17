import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Compass,
  Droplets,
  ExternalLink,
  LocateFixed,
  Maximize2,
  Navigation,
  Sun,
  Tent,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { FacilityWithReports } from "@/lib/facilities";
import { CATEGORY_LABELS } from "@/lib/facilities";
import { computeTrust, timeAgo, haversineKm } from "@/lib/trust";
import { TrustBadge, DemoBadge, CategoryIcon } from "@/components/aera";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

interface ExploreMapProps {
  facilities: FacilityWithReports[];
  userLocation: { lat: number; lng: number } | null;
  onLocate: () => void;
  locState: { kind: "idle" | "loading" | "ok" | "error"; lat?: number; lng?: number; msg?: string };
}

// Leaflet type definitions for dynamic import
type LeafletModule = typeof import("leaflet");

export function ExploreMap({ facilities, userLocation, onLocate, locState }: ExploreMapProps) {
  const { t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);
  const markersLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const userMarkerRef = useRef<import("leaflet").Marker | null>(null);

  const [selectedFacility, setSelectedFacility] = useState<FacilityWithReports | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Filter facilities with valid coordinates
  const validFacilities = useMemo(() => {
    return facilities.filter(
      (f) => typeof f.latitude === "number" && typeof f.longitude === "number",
    );
  }, [facilities]);

  // Initialize Leaflet map safely on client side
  useEffect(() => {
    let isCancelled = false;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      try {
        const L = (await import("leaflet")).default || (await import("leaflet"));

        if (isCancelled || !mapContainerRef.current) return;

        // Determine initial center
        let initialLat = 17.385; // Default reference coordinates (Telangana / Andhra / India region)
        let initialLng = 78.4867;
        let initialZoom = 13;

        if (userLocation) {
          initialLat = userLocation.lat;
          initialLng = userLocation.lng;
          initialZoom = 14;
        } else if (validFacilities.length > 0) {
          initialLat = validFacilities[0]?.latitude ?? initialLat;
          initialLng = validFacilities[0]?.longitude ?? initialLng;
        }

        const map = L.map(mapContainerRef.current, {
          center: [initialLat, initialLng],
          zoom: initialZoom,
          zoomControl: false, // We'll add custom positioned zoom control
        });

        // Add standard OpenStreetMap tiles
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
        }).addTo(map);

        // Add zoom control top right
        L.control.zoom({ position: "topright" }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;
        mapInstanceRef.current = map;

        setMapReady(true);
      } catch (err) {
        console.error("Failed to load map:", err);
        setMapError("Could not initialize interactive map.");
      }
    }

    void initMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        userMarkerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update facility markers when facilities or map ready changes
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !markersLayerRef.current) return;

    let isCancelled = false;

    async function updateMarkers() {
      const L = (await import("leaflet")).default || (await import("leaflet"));
      if (isCancelled || !markersLayerRef.current || !mapInstanceRef.current) return;

      markersLayerRef.current.clearLayers();

      validFacilities.forEach((facility) => {
        if (facility.latitude == null || facility.longitude == null) return;

        const isWater = facility.category === "water";
        const isRest = facility.category === "rest";
        const isSelected = selectedFacility?.id === facility.id;

        // Marker Colors & SVGs
        // Water: Vibrant Cyan/Blue #0284C7
        // Shade: Forest Green #28563B
        // Rest: Rich Sage/Amber #3E6B48
        const bgColor = isWater ? "#0284C7" : isRest ? "#335C3E" : "#28563B";
        const iconSvg = isWater
          ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`
          : isRest
            ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z"/><path d="M3 10h18"/><path d="M10 20V10"/></svg>`
            : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;

        const html = `
          <div class="relative group cursor-pointer transition-transform duration-200 ${isSelected ? "scale-125 z-50" : "hover:scale-110"}">
            <div style="background-color: ${bgColor}; box-shadow: 0 4px 10px rgba(0,0,0,0.25);"
                 class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white transition-all">
              ${iconSvg}
            </div>
            <div style="border-top-color: ${bgColor};"
                 class="w-0 h-0 border-x-4 border-x-transparent border-t-[6px] mx-auto -mt-[1px]"></div>
          </div>
        `;

        const customIcon = L.divIcon({
          html,
          className: "custom-facility-pin",
          iconSize: [36, 42],
          iconAnchor: [18, 40],
        });

        const marker = L.marker([facility.latitude, facility.longitude], {
          icon: customIcon,
          title: facility.name,
        });

        marker.on("click", () => {
          setSelectedFacility(facility);
          mapInstanceRef.current?.panTo([facility.latitude!, facility.longitude!], {
            animate: true,
          });
        });

        markersLayerRef.current?.addLayer(marker);
      });

      // If we have facilities and no selected facility, fit bounds
      if (validFacilities.length > 0 && !selectedFacility && !userLocation) {
        const bounds = L.latLngBounds(
          validFacilities.map((f) => [f.latitude!, f.longitude!] as [number, number]),
        );
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }

    void updateMarkers();

    return () => {
      isCancelled = true;
    };
  }, [mapReady, validFacilities, selectedFacility, userLocation]);

  // Update user location marker
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    let isCancelled = false;

    async function updateUserMarker() {
      const L = (await import("leaflet")).default || (await import("leaflet"));
      if (isCancelled || !mapInstanceRef.current) return;

      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }

      if (userLocation) {
        const userHtml = `
          <div class="relative flex h-6 w-6 items-center justify-center">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60"></span>
            <span class="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-md"></span>
          </div>
        `;

        const userIcon = L.divIcon({
          html: userHtml,
          className: "custom-user-beacon",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([userLocation.lat, userLocation.lng], {
          icon: userIcon,
          title: "Your Location",
          zIndexOffset: 1000,
        }).addTo(mapInstanceRef.current);

        userMarkerRef.current = marker;
      }
    }

    void updateUserMarker();

    return () => {
      isCancelled = true;
    };
  }, [mapReady, userLocation]);

  // Center on user position
  const handleCenterOnUser = () => {
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 15, {
        animate: true,
      });
    } else {
      onLocate();
    }
  };

  // Fit all markers in view
  const handleFitAll = async () => {
    if (!mapInstanceRef.current || validFacilities.length === 0) return;
    const L = (await import("leaflet")).default || (await import("leaflet"));
    const bounds = L.latLngBounds(
      validFacilities.map((f) => [f.latitude!, f.longitude!] as [number, number]),
    );
    if (userLocation) {
      bounds.extend([userLocation.lat, userLocation.lng]);
    }
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  };

  // Calculate distance to selected facility
  const selectedDistance = useMemo(() => {
    if (!selectedFacility || !userLocation) return null;
    if (selectedFacility.latitude == null || selectedFacility.longitude == null) return null;
    return haversineKm(
      { lat: userLocation.lat, lng: userLocation.lng },
      { lat: selectedFacility.latitude, lng: selectedFacility.longitude },
    );
  }, [selectedFacility, userLocation]);

  // Selected facility trust
  const selectedTrust = selectedFacility
    ? computeTrust(selectedFacility.last_confirmed_at, selectedFacility.facility_reports)
    : null;

  return (
    <div className="relative w-full rounded-2xl border bg-card shadow-soft overflow-hidden">
      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className="h-[440px] sm:h-[500px] w-full bg-muted/40 z-0"
        style={{ touchAction: "pan-x pan-y" }}
      />

      {/* Loading Overlay */}
      {!mapReady && !mapError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/85 backdrop-blur-xs">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="mt-2 text-xs font-semibold text-muted-foreground">Loading map...</p>
        </div>
      )}

      {/* Error Fallback */}
      {mapError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/90 p-5 text-center">
          <AlertCircle className="h-8 w-8 text-caution mb-2" />
          <h4 className="font-bold text-sm text-foreground">{t("map_error_title")}</h4>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs">{t("map_error_desc")}</p>
        </div>
      )}

      {/* Floating Action Controls on Map (Top-Left / Bottom-Right) */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {/* Recenter / Fit All Button */}
        <button
          type="button"
          onClick={handleFitAll}
          title="Fit all places in view"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card/95 text-foreground shadow-md backdrop-blur-xs hover:bg-muted active:scale-95 transition"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Locate Me Button */}
        <button
          type="button"
          onClick={handleCenterOnUser}
          disabled={locState.kind === "loading"}
          title={userLocation ? "Center on your location" : "Use current location"}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl border shadow-md backdrop-blur-xs transition active:scale-95",
            userLocation
              ? "border-blue-400 bg-blue-50/95 text-blue-600"
              : "border-border bg-card/95 text-foreground hover:bg-muted",
          )}
        >
          {locState.kind === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <LocateFixed className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Marker Legend Pill */}
      <div className="absolute top-3 right-14 z-20 hidden xs:flex items-center gap-3 rounded-full border border-border/80 bg-card/95 px-3 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur-xs">
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[#0284C7]" />
          Water
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[#28563B]" />
          Shade / Rest
        </span>
      </div>

      {/* Selected Facility Floating Preview Card */}
      {selectedFacility && (
        <div className="absolute inset-x-3 bottom-3 z-30 transition-all duration-200">
          <div className="relative rounded-2xl border border-primary/30 bg-card p-4 shadow-xl backdrop-blur-md">
            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => setSelectedFacility(null)}
              className="absolute top-3 right-3 rounded-full p-1 text-muted-foreground hover:bg-muted/70 transition"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-3 pr-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <CategoryIcon category={selectedFacility.category} className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h4 className="font-bold text-sm text-foreground leading-snug truncate max-w-[200px] xs:max-w-xs">
                    {selectedFacility.name}
                  </h4>
                  {selectedFacility.is_demo && <DemoBadge />}
                </div>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {CATEGORY_LABELS[selectedFacility.category] ?? selectedFacility.category}
                  {selectedDistance != null &&
                    ` · ${selectedDistance < 1 ? `${Math.round(selectedDistance * 1000)} m` : `${selectedDistance.toFixed(1)} km`}`}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {selectedTrust && (
                    <TrustBadge
                      status={selectedTrust.status}
                      label={
                        selectedTrust.status === "recent"
                          ? t("trust_recent")
                          : selectedTrust.status === "stale"
                            ? t("trust_stale")
                            : t("trust_uncertain")
                      }
                    />
                  )}
                  {selectedFacility.last_confirmed_at && (
                    <span className="text-[11px] text-muted-foreground">
                      Confirmed {timeAgo(selectedFacility.last_confirmed_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-border/60">
              <span className="text-[11px] text-muted-foreground truncate">
                {selectedFacility.address ??
                  selectedFacility.opening_hours ??
                  "Public outdoor relief"}
              </span>

              <Link
                to="/facility/$id"
                params={{ id: selectedFacility.id }}
                className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
              >
                <span>View Details</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

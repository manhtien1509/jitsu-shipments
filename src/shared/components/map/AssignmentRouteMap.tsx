import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

import type { Shipment } from "@/features/shipments/types/shipment.types";

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 18px; height: 18px;
      border-radius: 9999px;
      background: #2563eb;
      border: 3px solid white;
      box-shadow: 0 0 0 2px #2563eb, 0 2px 6px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

L.Marker.prototype.options.icon = defaultIcon;

interface Props {
  shipments: Shipment[];
  selectedShipmentId: string | null;
  className?: string;
}

function FitOrCenter({
  positions,
  center,
}: {
  positions: [number, number][];
  center: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, Math.max(map.getZoom(), 12));
      return;
    }
    if (positions.length === 1) {
      map.setView(positions[0], 12);
      return;
    }
    if (positions.length > 1) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center?.[0], center?.[1], positions.length]);

  return null;
}

export function AssignmentRouteMap({
  shipments,
  selectedShipmentId,
  className,
}: Props) {
  const sorted = useMemo(
    () =>
      [...shipments].sort(
        (a, b) => new Date(a.eta).getTime() - new Date(b.eta).getTime(),
      ),
    [shipments],
  );

  const positions = useMemo<[number, number][]>(
    () => sorted.map((s) => [s.lat, s.lng]),
    [sorted],
  );

  const selected = shipments.find((s) => s.id === selectedShipmentId) ?? null;
  const center: [number, number] | null = selected
    ? [selected.lat, selected.lng]
    : null;

  if (shipments.length === 0) {
    return (
      <div
        className={className}
        style={{
          background: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          fontSize: 13,
        }}
      >
        No locations to display
      </div>
    );
  }

  const initialCenter: [number, number] = center ?? positions[0];

  return (
    <div className={className}>
      <MapContainer
        center={initialCenter}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {positions.length > 1 && (
          <Polyline
            positions={positions}
            pathOptions={{ color: "#2563eb", weight: 3, opacity: 0.7 }}
          />
        )}

        {sorted.map((s) => {
          const isSelected = s.id === selectedShipmentId;
          return (
            <Marker
              key={s.id}
              position={[s.lat, s.lng]}
              icon={isSelected ? selectedIcon : defaultIcon}
            >
              <Popup>
                <div className="text-xs">
                  <div className="font-semibold">{s.client_name}</div>
                  <div className="text-neutral-500">{s.label}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <FitOrCenter positions={positions} center={center} />
      </MapContainer>
    </div>
  );
}

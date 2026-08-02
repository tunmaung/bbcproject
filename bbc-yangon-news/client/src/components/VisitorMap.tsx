import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { trpc } from "@/lib/trpc";
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
export default function VisitorMap() {
const { data: visitors } =
  trpc.admin.visitorLocations.useQuery(undefined, {
    refetchInterval: 5000,
  });
  return (
    <MapContainer
      center={[16.8661, 96.1951]}
      zoom={6}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />{visitors?.map((v: any) => (
  <Marker
    key={v.id}
    position={[
      Number(v.latitude),
      Number(v.longitude),
    ]}
  >
    <Popup>
      <div className="space-y-1">
        <div><strong>{v.country}</strong></div>
        <div>{v.city}</div>
        <div>{v.browser} / {v.os}</div>
        <div>{v.device}</div>
        <div>{v.publicIp}</div>
      </div>
    </Popup>
  </Marker>
))}
    </MapContainer>
  );
}

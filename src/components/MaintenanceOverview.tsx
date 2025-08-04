import { Card, CardHeader, Icon } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/alert.js";
import "@ui5/webcomponents-icons/dist/history.js";
import "@ui5/webcomponents-icons/dist/sys-enter-2.js";
import "@ui5/webcomponents-icons/dist/flight.js";
import { Aircraft } from "./AircraftCard";
import NotificationButton from "./NotificationButton";
import type { LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export type MaintenanceStatus = 'overdue' | 'urgent' | 'due-soon' | 'good';

interface MaintenanceOverviewProps {
  aircraft: Aircraft[];
  onStatCardClick: (status: MaintenanceStatus) => void;
  showNotification?: boolean;
}

export const MaintenanceOverview = ({ aircraft, onStatCardClick, showNotification = true }: MaintenanceOverviewProps) => {
  const calculateMaintenanceStats = () => {
    const today = new Date();
    let overdue = 0;
    let urgent = 0; // within 30 days
    let dueSoon = 0; // within 90 days
    let good = 0;

    aircraft.forEach(plane => {
      const checkDate = new Date(plane.nextCheck);
      const diffTime = checkDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) overdue++;
      else if (diffDays <= 30) urgent++;
      else if (diffDays <= 90) dueSoon++;
      else good++;
    });

    return { overdue, urgent, dueSoon, good, total: aircraft.length };
  };

  const stats = calculateMaintenanceStats();

  const StatCard = ({ 
    title, 
    count, 
    total, 
    icon, 
    className,
    variant,
    onClick,
  }: { 
    title: string; 
    count: number; 
    total: number; 
    icon: string; 
    className: string;
    variant: 'error' | 'warning' | 'info' | 'success';
    onClick: () => void;
  }) => (
    <Card 
        header={<CardHeader titleText={title} />}
        onClick={onClick} 
        className={`sap-tile ${className} border-l-4 hover:shadow-enterprise transition-all duration-300`}
    >
        <div className="p-xl">
            <div className="space-y-md">
            <div className="flex items-center justify-between">
                <Icon name={icon} className={`w-6 h-6 ${
                variant === 'error' ? 'text-error' :
                variant === 'warning' ? 'text-warning' :
                variant === 'info' ? 'text-info' :
                'text-success'
                }`} />
                <div className={`px-sm py-xs rounded-md text-xs font-medium ${
                variant === 'error' ? 'status-error' :
                variant === 'warning' ? 'status-warning' :
                variant === 'info' ? 'status-info' :
                'status-success'
                }`}>
                {count > 0 ? 'ATTENTION' : 'NORMAL'}
                </div>
            </div>
            <div>
                <p className="sap-caption mb-xs">{title}</p>
                <div className="flex items-baseline space-x-sm">
                <p className="text-3xl font-bold text-foreground">{count}</p>
                <p className="sap-body-2">of {total}</p>
                </div>
            </div>
            </div>
        </div>
    </Card>
  );

  return (
    <div className="sap-section">
      <div className="mb-2xl">
        {/* This is from the 'feat-map' branch */}
        <div style={{ width: '100%', height: '400px', marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <LeafletMapEmbed />
        </div>

        {/* This is from your 'HEAD' branch */}
        <div className="flex items-center justify-between mb-sm">
          <h2 className="sap-heading-2">Fleet Maintenance Overview</h2>
          <NotificationButton isVisible={showNotification} />
        </div>
        
        <p className="sap-body-2">Real-time status monitoring and maintenance scheduling for SkyLink Airlines fleet</p>
      </div>
      
      {/* SAP Fiori KPI Tiles */}
      <div className="sap-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-2xl">
        <StatCard
          title="Overdue Maintenance"
          count={stats.overdue}
          total={stats.total}
          icon="alert"
          className="border-l-error"
          variant="error"
          onClick={() => onStatCardClick('overdue')}
        />
        <StatCard
          title="Urgent (≤30 days)"
          count={stats.urgent}
          total={stats.total}
          icon="history"
          className="border-l-warning"
          variant="warning"
          onClick={() => onStatCardClick('urgent')}
        />
        <StatCard
          title="Due Soon (≤90 days)"
          count={stats.dueSoon}
          total={stats.total}
          icon="history"
          className="border-l-info"
          variant="info"
          onClick={() => onStatCardClick('due-soon')}
        />
        <StatCard
          title="Good Status"
          count={stats.good}
          total={stats.total}
          icon="sys-enter-2"
          className="border-l-success"
          variant="success"
          onClick={() => onStatCardClick('good')}
        />
      </div>

      {/* SAP Fiori Message Strip */}
      {stats.overdue > 0 && (
        <Card 
            header={
                <CardHeader 
                    titleText="Critical System Alert" 
                    avatar={<Icon name="alert" className="w-5 h-5 text-error" />}
                />
            }
            className="border-l-4 border-l-error bg-error-light/50 shadow-enterprise"
        >
            <div className="p-6">
                <div className="space-y-sm">
                <p className="sap-body-1 text-error font-medium">
                    {stats.overdue} aircraft require immediate maintenance attention
                </p>
                <p className="sap-body-2">
                    Immediate action required to ensure flight safety compliance and regulatory adherence. 
                    Review maintenance schedules and coordinate with operations team.
                </p>
                </div>
            </div>
        </Card>
      )}

      {/* Fleet Health Summary */}
      <div className="mt-2xl">
        <Card 
            header={
                <CardHeader 
                    titleText="Fleet Health Summary" 
                    avatar={<Icon name="flight" className="w-5 h-5 text-primary" />}
                />
            }
            className="sap-card shadow-enterprise"
        >
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
              <div className="text-center p-lg border border-border rounded-lg">
                <p className="text-3xl font-bold text-success mb-sm">
                  {Math.round(((stats.good + stats.dueSoon) / stats.total) * 100)}%
                </p>
                <p className="sap-caption">Fleet Availability</p>
              </div>
              <div className="text-center p-lg border border-border rounded-lg">
                <p className="text-3xl font-bold text-primary mb-sm">
                  {stats.total}
                </p>
                <p className="sap-caption">Total Aircraft</p>
              </div>
              <div className="text-center p-lg border border-border rounded-lg">
                <p className="text-3xl font-bold text-info mb-sm">
                  {stats.urgent + stats.dueSoon}
                </p>
                <p className="sap-caption">Scheduled Maintenance</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const randomPins = [
  // NORTH AMERICA (15)
  { lat: 40.7128, lng: -74.0060 }, // New York
  { lat: 34.0522, lng: -118.2437 }, // Los Angeles
  { lat: 41.8781, lng: -87.6298 }, // Chicago
  { lat: 29.7604, lng: -95.3698 }, // Houston
  { lat: 45.4215, lng: -75.6972 }, // Ottawa
  { lat: 49.2827, lng: -123.1207 }, // Vancouver
  { lat: 25.7617, lng: -80.1918 }, // Miami
  { lat: 32.7767, lng: -96.7970 }, // Dallas
  { lat: 39.7392, lng: -104.9903 }, // Denver
  { lat: 43.6532, lng: -79.3832 }, // Toronto
  { lat: 45.5017, lng: -73.5673 }, // Montreal
  { lat: 61.2181, lng: -149.9003 }, // Anchorage
  { lat: 21.3069, lng: -157.8583 }, // Honolulu
  { lat: 20.6597, lng: -103.3496 }, // Guadalajara
  { lat: 25.6866, lng: -100.3161 }, // Monterrey

  // SOUTH AMERICA (15)
  { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
  { lat: -23.5505, lng: -46.6333 }, // São Paulo
  { lat: -12.0464, lng: -77.0428 }, // Lima
  { lat: -15.8267, lng: -47.9218 }, // Brasília
  { lat: -3.1190, lng: -60.0217 }, // Manaus
  { lat: 4.7110, lng: -74.0721 }, // Bogotá
  { lat: 6.2442, lng: -75.5812 }, // Medellín
  { lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro
  { lat: -16.4090, lng: -71.5375 }, // Arequipa
  { lat: -33.4489, lng: -70.6693 }, // Santiago
  { lat: -3.7319, lng: -38.5267 }, // Fortaleza
  { lat: -8.0476, lng: -34.8770 }, // Recife
  { lat: -1.4558, lng: -48.5024 }, // Belém
  { lat: -2.1710, lng: -79.9224 }, // Guayaquil
  { lat: 10.5000, lng: -66.9167 }, // Caracas

  // EUROPE (15)
  { lat: 51.5074, lng: -0.1278 }, // London
  { lat: 48.8566, lng: 2.3522 }, // Paris
  { lat: 41.9028, lng: 12.4964 }, // Rome
  { lat: 52.5200, lng: 13.4050 }, // Berlin
  { lat: 59.3293, lng: 18.0686 }, // Stockholm
  { lat: 55.7558, lng: 37.6173 }, // Moscow
  { lat: 50.8503, lng: 4.3517 }, // Brussels
  { lat: 47.3769, lng: 8.5417 }, // Zurich
  { lat: 60.1699, lng: 24.9384 }, // Helsinki
  { lat: 55.6761, lng: 12.5683 }, // Copenhagen
  { lat: 52.3676, lng: 4.9041 }, // Amsterdam
  { lat: 48.2082, lng: 16.3738 }, // Vienna
  { lat: 41.0082, lng: 28.9784 }, // Istanbul
  { lat: 37.9838, lng: 23.7275 }, // Athens
  { lat: 45.4408, lng: 12.3155 }, // Venice

  // AFRICA (10)
  { lat: 30.0444, lng: 31.2357 }, // Cairo
  { lat: -1.2921, lng: 36.8219 }, // Nairobi
  { lat: -26.2041, lng: 28.0473 }, // Johannesburg
  { lat: 14.6928, lng: -17.4467 }, // Dakar
  { lat: 6.5244, lng: 3.3792 }, // Lagos
  { lat: -33.9249, lng: 18.4241 }, // Cape Town
  { lat: 36.8065, lng: 10.1815 }, // Tunis
  { lat: 9.0579, lng: 7.4951 }, // Abuja
  { lat: 12.9714, lng: -2.3470 }, // Ouagadougou
  { lat: -4.0435, lng: 39.6682 }, // Mombasa

  // ASIA (15)
  { lat: 35.6895, lng: 139.6917 }, // Tokyo
  { lat: 19.0760, lng: 72.8777 }, // Mumbai
  { lat: 28.6139, lng: 77.2090 }, // New Delhi
  { lat: 39.9042, lng: 116.4074 }, // Beijing
  { lat: 1.3521, lng: 103.8198 }, // Singapore
  { lat: 31.2304, lng: 121.4737 }, // Shanghai
  { lat: 3.1390, lng: 101.6869 }, // Kuala Lumpur
  { lat: 13.7563, lng: 100.5018 }, // Bangkok
  { lat: 37.5665, lng: 126.9780 }, // Seoul
  { lat: 23.8103, lng: 90.4125 }, // Dhaka
  { lat: 35.1796, lng: 129.0756 }, // Busan
  { lat: 21.0285, lng: 105.8542 }, // Hanoi
  { lat: 34.6937, lng: 135.5023 }, // Osaka
  { lat: 25.276987, lng: 55.296249 }, // Dubai
  { lat: 33.6844, lng: 73.0479 }, // Islamabad

  // AUSTRALIA / OCEANIA (5)
  { lat: -33.8688, lng: 151.2093 }, // Sydney
  { lat: -37.8136, lng: 144.9631 }, // Melbourne
  { lat: -27.4698, lng: 153.0251 }, // Brisbane
  { lat: -36.8485, lng: 174.7633 }, // Auckland
  { lat: -17.7134, lng: 178.0650 }, // Suva (Fiji)

  // IN-FLIGHT PLANES (15) – random lat/lng over oceans
  { lat: 50.0, lng: -30.0 }, // over North Atlantic
  { lat: 40.0, lng: -40.0 }, // over Atlantic mid-route
  { lat: 30.0, lng: -50.0 }, // over South Atlantic
  { lat: 10.0, lng: -20.0 }, // near Africa/Atlantic
  { lat: 0.0, lng: -140.0 }, // central Pacific
  { lat: 20.0, lng: -150.0 }, // Pacific, west of Mexico
  { lat: 35.0, lng: -160.0 }, // Pacific, near Hawaii
  { lat: -10.0, lng: 110.0 }, // Indian Ocean
  { lat: 0.0, lng: 90.0 }, // Indian Ocean equator
  { lat: -25.0, lng: 135.0 }, // over Australia inland
  { lat: -40.0, lng: 170.0 }, // near New Zealand waters
  { lat: 60.0, lng: -100.0 }, // Northern Canada (in air)
  { lat: 45.0, lng: 60.0 }, // Central Asia, en route
  { lat: 33.0, lng: 50.0 }, // Middle East airspace
  { lat: 55.0, lng: 10.0 }, // over Northern Europe
];

function LeafletMapEmbed() {
  const planeIcon = new L.Icon({
    iconUrl: 'airplane.png',
    iconSize: [32, 32], // adjust as needed
    iconAnchor: [16, 16], // center the icon
    popupAnchor: [0, -16],
  });
  const center: LatLngExpression = [20, 0]; // Center of the world
  return (
    <MapContainer center={center} zoom={2} style={{ width: '100%', height: '100%' }} >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {randomPins.map((pin, idx) => (
        <Marker key={idx} position={[pin.lat, pin.lng]} icon={planeIcon}>
          <Popup>
            Lat: {pin.lat}, Lng: {pin.lng}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

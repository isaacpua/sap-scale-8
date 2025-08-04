import { useState, useMemo } from "react";
import { AircraftCard, Aircraft } from "@/components/AircraftCard";
import { MaintenanceOverview, MaintenanceStatus } from "@/components/MaintenanceOverview";
import { PredictiveInsights } from "@/components/PredictiveInsights";
import { CSVUploader } from "@/components/CSVUploader";
import NotificationButton from "@/components/NotificationButton";
import {
  TabContainer,
  Tab,
  Input,
  Select,
  Option,
  Button,
  Icon,
} from "@ui5/webcomponents-react";
import { Badge } from "@/components/ui/badge"; // Reverted import
import "@ui5/webcomponents-icons/dist/flight.js";
import "@ui5/webcomponents-icons/dist/search.js";
import "@ui5/webcomponents-icons/dist/decline.js";

const calculateDaysUntilMaintenance = (nextCheck: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(nextCheck);
  checkDate.setHours(0, 0, 0, 0);
  const diffTime = checkDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getMaintenanceStatus = (aircraft: Aircraft): MaintenanceStatus => {
  const daysUntil = calculateDaysUntilMaintenance(aircraft.nextCheck);
  if (daysUntil < 0) return "overdue";
  if (daysUntil <= 30) return "urgent";
  if (daysUntil <= 90) return "due-soon";
  return "good";
};

const Index = () => {
  const [aircraftData, setAircraftData] = useState<Aircraft[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState("overview");
  const [maintenanceFilter, setMaintenanceFilter] =
    useState<MaintenanceStatus | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const handleDataLoad = (data: Aircraft[]) => {
    setAircraftData(data);
  };

  const handleStatCardClick = (status: MaintenanceStatus) => {
    setActiveTab("aircraft");
    setMaintenanceFilter(status);
  };

  const handleTabChange = (event) => {
    setActiveTab(event.detail.tab.dataset.id);
    setMaintenanceFilter(null);
  };

  const filteredAndSortedAircraft = useMemo(() => {
    let filteredData = aircraftData;

    if (maintenanceFilter) {
      filteredData = aircraftData.filter(
        (aircraft) => getMaintenanceStatus(aircraft) === maintenanceFilter
      );
    }

    return filteredData
      .filter((aircraft) =>
        aircraft.tailNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const daysA = calculateDaysUntilMaintenance(a.nextCheck);
        const daysB = calculateDaysUntilMaintenance(b.nextCheck);
        return sortOrder === "asc" ? daysA - daysB : daysB - daysA;
      });
  }, [aircraftData, searchTerm, sortOrder, maintenanceFilter]);

  return (
    <div className="min-h-screen bg-background">
      {/* SAP Fiori Shell Header */}
      <header className="bg-card border-b border-border shadow-enterprise sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-lg shadow-md">
                <Icon name="flight" className="w-7 h-7" />
              </div>
              <div>
                <h1 className="sap-heading-3">SkyLink Airlines</h1>
                <p className="sap-caption">Predictive Maintenance System</p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="sap-body-1 font-medium">
                SAP UI5 Enterprise Solution
              </p>
              <p className="sap-caption">
                Powered by SAP HANA & Analytics Cloud
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with SAP Fiori Layout */}
      <main className="max-w-[1600px] mx-auto px-xl py-2xl">
        {aircraftData.length === 0 ? (
          <div className="max-w-3xl mx-auto">
            <div className="sap-section">
              <div className="text-center mb-2xl">
                <h1 className="sap-heading-1 mb-md">
                  Aircraft Maintenance Analytics
                </h1>
                <p className="sap-body-2 max-w-2xl mx-auto">
                  Welcome to the SkyLink Airlines predictive maintenance
                  dashboard. Load your aircraft data to begin analyzing
                  maintenance schedules and optimizing fleet operations.
                </p>
              </div>
              <CSVUploader 
                onDataLoad={handleDataLoad}
                onUploadSuccess={() => setShowNotification(true)}
              />
            </div>
          </div>
        ) : (
          <div className="sap-section">
            {/* SAP Fiori Object Page Header */}
            <div className="bg-primary text-primary-foreground rounded-lg p-2xl mb-2xl shadow-enterprise">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-lg">
                <div>
                  <h1 className="text-3xl font-bold mb-sm">
                    Fleet Operations Dashboard
                  </h1>
                  <p className="text-primary-foreground/80">
                    {aircraftData.length} aircraft • Real-time maintenance
                    insights • SAP Analytics Cloud
                  </p>
                </div>
                <div className="flex items-center space-x-lg text-right">
                  <div>
                    <p className="text-2xl font-bold">99.2%</p>
                    <p className="text-primary-foreground/80 text-sm">
                      Fleet Availability
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">$2.4M</p>
                    <p className="text-primary-foreground/80 text-sm">
                      Cost Savings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SAP Fiori Icon Tab Bar */}
            <TabContainer onTabSelect={handleTabChange}>
              <Tab text="Fleet Overview" data-id="overview" selected={activeTab === 'overview'}/>
              <Tab text="Aircraft Details" data-id="aircraft" selected={activeTab === 'aircraft'}/>
              <Tab text="Predictive Insights" data-id="insights" selected={activeTab === 'insights'}/>
            </TabContainer>

            {activeTab === 'overview' && (
              <div className="sap-section mt-2xl">
                <MaintenanceOverview
                  aircraft={aircraftData}
                  onStatCardClick={handleStatCardClick}
                  showNotification={showNotification}
                />
              </div>
            )}

            {activeTab === 'aircraft' && (
              <div className="sap-section mt-2xl">
                <div className="mb-2xl">
                  <h2 className="sap-heading-2 mb-sm">
                    Aircraft Fleet Details
                  </h2>
                  <p className="sap-body-2">
                    Individual aircraft maintenance status and scheduling
                    optimization
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-md sm:justify-between mb-lg">
                  <div className="relative w-full max-w-sm">
                    <Input
                      icon={<Icon name="search" />}
                      placeholder="Search by tail number..."
                      value={searchTerm}
                      onInput={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select onChange={(e) => setSortOrder(e.detail.selectedOption.dataset.id as "asc" | "desc")}>
                    <Option data-id="asc">Days Ascending</Option>
                    <Option data-id="desc">Days Descending</Option>
                  </Select>
                </div>

                {maintenanceFilter && (
                  <div className="flex items-center justify-between bg-accent/50 p-md rounded-md mb-lg">
                    <p className="sap-body-1 font-medium">
                      <span className="text-muted-foreground">
                        Filtered by:
                      </span>{" "}
                      <Badge
                        className={
                          maintenanceFilter === "overdue"
                            ? "status-error"
                            : maintenanceFilter === "urgent"
                            ? "status-warning"
                            : maintenanceFilter === "due-soon"
                            ? "status-info"
                            : "status-success"
                        }
                      >
                        {maintenanceFilter.replace("-", " ")}
                      </Badge>
                    </p>
                    <Button
                      design="Transparent"
                      onClick={() => setMaintenanceFilter(null)}
                    >
                      <Icon name="decline" className="w-4 h-4 mr-sm" />
                      Clear Filter
                    </Button>
                  </div>
                )}

                <div className="sap-grid-responsive">
                  {filteredAndSortedAircraft.map((aircraft) => (
                    <AircraftCard
                      key={aircraft.tailNumber}
                      aircraft={aircraft}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="sap-section mt-2xl">
                <PredictiveInsights aircraft={aircraftData} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
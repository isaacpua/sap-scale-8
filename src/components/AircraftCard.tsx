import { Button, Card, CardHeader } from "@ui5/webcomponents-react";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/calendar.js";
import "@ui5/webcomponents-icons/dist/history.js";
import "@ui5/webcomponents-icons/dist/alert.js";
import "@ui5/webcomponents-icons/dist/sys-enter-2.js";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog } from "@ui5/webcomponents-react";

export interface Aircraft {
  tailNumber: string;
  model: string;
  lastCheck: string;
  nextCheck: string;
  flightHours: number;
}

interface AircraftCardProps {
  aircraft: Aircraft;
}

export const AircraftCard = ({ aircraft }: AircraftCardProps) => {
  const calculateDaysUntilMaintenance = (nextCheck: string) => {
    const today = new Date();
    const checkDate = new Date(nextCheck);
    const diffTime = checkDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMaintenanceStatus = (daysUntil: number) => {
    if (daysUntil < 0)
      return { status: "overdue", variant: "error" as const, icon: "alert" };
    if (daysUntil <= 30)
      return { status: "urgent", variant: "warning" as const, icon: "alert" };
    if (daysUntil <= 90)
      return { status: "due-soon", variant: "info" as const, icon: "history" };
    return { status: "good", variant: "success" as const, icon: "sys-enter-2" };
  };

  const daysUntil = calculateDaysUntilMaintenance(aircraft.nextCheck);
  const maintenanceInfo = getMaintenanceStatus(daysUntil);

  const getStatusText = () => {
    if (daysUntil < 0) return `${Math.abs(daysUntil)} days overdue`;
    if (daysUntil === 0) return "Due today";
    return `${daysUntil} days remaining`;
  };

  const iconColorClass =
    maintenanceInfo.variant === "error"
      ? "text-error"
      : maintenanceInfo.variant === "warning"
      ? "text-warning"
      : maintenanceInfo.variant === "info"
      ? "text-info"
      : "text-success";

  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        header={
          <CardHeader
            titleText={aircraft.tailNumber}
            subtitleText={aircraft.model}
            additionalText={getStatusText()}
            avatar={
              <Icon name={maintenanceInfo.icon} className={iconColorClass} />
            }
          />
        }
        className="sap-tile hover:shadow-enterprise border border-border transition-all duration-300 group"
        onClick={() => setOpen(true)}
        style={{ cursor: "pointer" }}
      >
        <div className="space-y-md p-4">
          <div className="bg-muted/30 rounded-md p-md">
            <div className="grid grid-cols-2 gap-lg">
              <div className="space-y-xs">
                <div className="flex items-center space-x-xs">
                  <Icon
                    name="calendar"
                    className="w-3 h-3 text-muted-foreground"
                  />
                  <p className="sap-caption">Last Check</p>
                </div>
                <p className="sap-body-1 font-medium">
                  {format(new Date(aircraft.lastCheck), "MMM dd, yyyy")}
                </p>
              </div>
              <div className="space-y-xs">
                <div className="flex items-center space-x-xs">
                  <Icon
                    name="calendar"
                    className="w-3 h-3 text-muted-foreground"
                  />
                  <p className="sap-caption">Next Check</p>
                </div>
                <p className="sap-body-1 font-medium">
                  {format(new Date(aircraft.nextCheck), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-md bg-accent/30 rounded-md">
            <div className="flex items-center space-x-sm">
              <Icon name="history" className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="sap-caption">Total Flight Hours</p>
                <p className="sap-body-1 font-bold">
                  {aircraft.flightHours.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="sap-caption">Usage Level</p>
              <p
                className={`text-sm font-medium ${
                  aircraft.flightHours > 4000
                    ? "text-warning"
                    : aircraft.flightHours > 2000
                    ? "text-info"
                    : "text-success"
                }`}
              >
                {aircraft.flightHours > 4000
                  ? "High"
                  : aircraft.flightHours > 2000
                  ? "Medium"
                  : "Low"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Dialog
        open={open}
        headerText={aircraft.tailNumber}
        onAfterClose={() => setOpen(false)}
      >
        <div className="p-6 flex flex-col items-center text-center space-y-6">
          <img
            src="aircraft_wireframe.png"
            alt="Aircraft Wireframe"
            className="w-64 h-auto"
          />
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Icon
                name={maintenanceInfo.icon}
                className={iconColorClass + " w-6 h-6"}
              />
              <span className="font-bold text-lg" style={{ letterSpacing: 1 }}>
                {maintenanceInfo.status.toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <p className="font-bold text-base mb-1">Model:</p>
            <p className="text-base">{aircraft.model}</p>
          </div>
          <div>
            <p className="font-bold text-base mb-1">Next Maintenance:</p>
            <p className="text-base">
              {format(new Date(aircraft.nextCheck), "MMM dd, yyyy")}
            </p>
            <a className="text-blue-600 hover:text-blue-800 underline" href="https://www.eamtc.org/wp-content/uploads/2011/04/Aircraft-Maintenance-Engineers-Logbook.pdf" target="_blank">View Maintenance Checklist</a>
          </div>
        </div>
        <div slot="footer" className="flex justify-center">
          <button className="sap-button" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      </Dialog>
    </>
  );
};

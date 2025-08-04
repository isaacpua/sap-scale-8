import { useState, useRef } from "react";
import { Card, CardHeader, Button, Icon } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/upload.js";
import "@ui5/webcomponents-icons/dist/document-text.js";
import "@ui5/webcomponents-icons/dist/error.js";
import "@ui5/webcomponents-icons/dist/lightbulb.js";
import { Aircraft } from "./AircraftCard";

interface CSVUploaderProps {
  onDataLoad: (data: Aircraft[]) => void;
  onUploadSuccess: () => void;
}

export const CSVUploader = ({ onDataLoad, onUploadSuccess }: CSVUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): Aircraft[] => {
    const lines = text.trim().split('\n');
    const header = lines[0].split(';');
    
    // Validate header
    const expectedHeaders = ['tailNumber', 'model', 'lastCheck', 'nextCheck', 'flightHours'];
    const isValidHeader = expectedHeaders.every(h => header.includes(h));
    
    if (!isValidHeader) {
      throw new Error('Invalid CSV format. Expected headers: tailNumber, model, lastCheck, nextCheck, flightHours');
    }
    
    return lines.slice(1).map(line => {
      const values = line.split(';');
      return {
        tailNumber: values[0],
        model: values[1],
        lastCheck: values[2],
        nextCheck: values[3],
        flightHours: parseInt(values[4], 10)
      };
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const aircraft = parseCSV(text);
      onDataLoad(aircraft);
      onUploadSuccess(); // Trigger notification button visibility
    } catch (err) { // This is where the error was
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    const sampleData: Aircraft[] = [
      {
        tailNumber: "SA8880",
        model: "Airbus A330",
        lastCheck: "2024-09-24",
        nextCheck: "2026-03-27",
        flightHours: 2847
      },
      {
        tailNumber: "KE2815",
        model: "Airbus A350",
        lastCheck: "2025-01-30",
        nextCheck: "2026-01-28",
        flightHours: 3714
      },
      {
        tailNumber: "DL6343",
        model: "Airbus A350",
        lastCheck: "2024-08-16",
        nextCheck: "2025-07-11",
        flightHours: 1122
      },
      {
        tailNumber: "QR5924",
        model: "Airbus A320",
        lastCheck: "2024-08-14",
        nextCheck: "2025-07-19",
        flightHours: 1289
      },
      {
        tailNumber: "AF1454",
        model: "Boeing 737",
        lastCheck: "2025-01-19",
        nextCheck: "2025-11-20",
        flightHours: 4439
      },
      {
        tailNumber: "ET4010",
        model: "Boeing 747",
        lastCheck: "2024-11-17",
        nextCheck: "2026-01-28",
        flightHours: 883
      },
      {
        tailNumber: "SK3823",
        model: "Airbus A330",
        lastCheck: "2024-12-12",
        nextCheck: "2026-01-13",
        flightHours: 1723
      },
      {
        tailNumber: "LA9571",
        model: "Airbus A330",
        lastCheck: "2024-06-26",
        nextCheck: "2025-06-12",
        flightHours: 137
      },
      {
        tailNumber: "AA7291",
        model: "Airbus A320",
        lastCheck: "2024-09-09",
        nextCheck: "2025-06-06",
        flightHours: 4763
      },
      {
        tailNumber: "BA8817",
        model: "Boeing 737",
        lastCheck: "2024-10-12",
        nextCheck: "2025-11-26",
        flightHours: 1935
      },
      {
        tailNumber: "AF8764",
        model: "Boeing 747",
        lastCheck: "2025-04-15",
        nextCheck: "2026-02-04",
        flightHours: 1537
      },
      {
        tailNumber: "WN2726",
        model: "Airbus A320",
        lastCheck: "2025-03-09",
        nextCheck: "2025-12-13",
        flightHours: 4444
      }
    ];
    
    onDataLoad(sampleData);
  };

  return (
    <Card
      header={
        <CardHeader
          titleText="Data Integration Hub"
          subtitleText="Connect your aircraft maintenance data source"
          avatar={<Icon name="document-text" />}
        />
      }
      className="sap-card border-2 border-dashed border-primary/30 hover:border-primary hover:shadow-enterprise transition-all duration-300"
    >
      <div className="space-y-xl p-6">
        <div className="text-center space-y-xl">
          <div className="space-y-md">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="upload" className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-sm">
              <p className="sap-body-1 font-medium">
                Import Aircraft Fleet Data
              </p>
              <p className="sap-body-2 max-w-md mx-auto">
                Upload your maintenance records or start with our sample dataset to explore the predictive analytics capabilities
              </p>
            </div>
          </div>
          
          {/* SAP Fiori Button Bar */}
          <div className="flex flex-col sm:flex-row gap-md justify-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              design="Transparent"
            >
              {isLoading ? (
                <div className="flex items-center space-x-sm">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-sm">
                  <Icon name="upload" className="w-4 h-4" />
                  <span>Upload CSV File</span>
                </div>
              )}
            </Button>
            
            <Button
              onClick={loadSampleData}
              design="Emphasized"
            >
              <div className="flex items-center space-x-sm">
                <Icon name="lightbulb" className="w-4 h-4" />
                <span>Load Sample Data</span>
              </div>
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* SAP Fiori Message */}
        {error && (
          <div className="status-error p-lg rounded-md">
            <div className="flex items-start space-x-sm">
              <Icon name="error" className="w-5 h-5 mt-xs flex-shrink-0" />
              <div>
                <p className="sap-body-1 font-medium mb-xs">Data Import Error</p>
                <p className="sap-body-2">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* SAP Fiori Information Panel */}
        <div className="bg-info-light/30 border border-info/20 p-lg rounded-md">
          <div className="space-y-sm">
            <p className="sap-body-1 font-medium text-info">Data Format Requirements</p>
            <div className="space-y-xs">
              <p className="sap-caption">CSV file with semicolon (;) delimiter</p>
              <div className="bg-card p-sm rounded border font-mono text-xs">
                tailNumber;model;lastCheck;nextCheck;flightHours
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
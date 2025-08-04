import { Card, CardHeader, ProgressIndicator, Icon } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/line-chart.js";
import "@ui5/webcomponents-icons/dist/arrow-down.js";
import "@ui5/webcomponents-icons/dist/alert.js";
import "@ui5/webcomponents-icons/dist/lightbulb.js";
import { Aircraft } from "./AircraftCard";

interface PredictiveInsightsProps {
  aircraft: Aircraft[];
}

export const PredictiveInsights = ({ aircraft }: PredictiveInsightsProps) => {
  const generatePredictiveInsights = () => {
    // Return early if there's no data to prevent potential errors
    if (!aircraft || aircraft.length === 0) {
      return [];
    }

    const insights = [];

    // High flight hours analysis
    const highHoursAircraft = aircraft.filter(a => a.flightHours > 4000);
    if (highHoursAircraft.length > 0) {
      insights.push({
        type: 'high-usage',
        severity: 'warning',
        title: 'High Flight Hours Detected',
        description: `${highHoursAircraft.length} aircraft with >4000 flight hours may require additional inspections`,
        aircraft: highHoursAircraft,
        recommendation: 'Schedule detailed component inspections'
      });
    }

    // Model-specific insights
    const modelGroups = aircraft.reduce((acc, a) => {
      acc[(a.model)] = (acc[(a.model)] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Added a check to ensure modelGroups is not empty before sorting
    const sortedModels = Object.entries(modelGroups).sort((a, b) => b[(1)] - a[(1)]);
    if (sortedModels.length > 0) {
      const predominantModel = sortedModels[(0)];
      if (predominantModel[(1)] > 2) {
        insights.push({
          type: 'fleet-optimization',
          severity: 'info',
          title: 'Fleet Standardization Opportunity',
          description: `${predominantModel[(1)]} ${predominantModel[(0)]} aircraft in fleet`,
          recommendation: 'Consider bulk parts procurement and specialized maintenance teams'
        });
      }
    }

    // Seasonal maintenance prediction
    const winterMonths = aircraft.filter(a => {
      const month = new Date(a.nextCheck).getMonth();
      return month >= 5 || month <= 8; // Months are 0-indexed: 5=Jun, 6=Jul, 7=Aug
    });

    if (winterMonths.length > aircraft.length * 0.4) {
      insights.push({
        type: 'seasonal',
        severity: 'info',
        title: 'Winter Maintenance Peak',
        description: `${winterMonths.length} aircraft scheduled for maintenance in winter months`,
        recommendation: 'Prepare for increased hangar utilization and parts inventory'
      });
    }

    return insights;
  };

  const insights = generatePredictiveInsights();

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'warning':
        return { color: 'border-warning text-warning', icon: "alert" };
      case 'info':
        return { color: 'border-info text-info', icon: "lightbulb" };
      default:
        return { color: 'border-muted text-muted-foreground', icon: "line-chart" };
    }
  };

  const calculateMaintenanceCapacity = () => {
    const today = new Date();
    const next30Days = aircraft.filter(a => {
      const checkDate = new Date(a.nextCheck);
      const diffTime = checkDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30;
    }).length;

    const capacity = 8; // Assume 8 aircraft maintenance capacity per month
    const utilizationPercentage = Math.min((next30Days / capacity) * 100, 100);

    return { next30Days, capacity, utilizationPercentage };
  };

  const capacityData = calculateMaintenanceCapacity();

  return (
    <div className="sap-section">
      <div className="mb-2xl">
        <h2 className="sap-heading-2 mb-sm">Predictive Maintenance Insights</h2>
        <p className="sap-body-2">AI-powered analysis powered by SAP Analytics Cloud and machine learning algorithms</p>
      </div>

      {/* SAP Fiori Analytical Cards */}
      <div className="sap-grid grid-cols-1 lg:grid-cols-2 mb-2xl">
        {/* Maintenance Capacity */}
        <Card
            header={
                <CardHeader
                    titleText="Maintenance Capacity Analysis"
                    subtitleText="Next 30 days scheduling overview"
                    avatar={<Icon name="line-chart" />}
                />
            }
            className="sap-card shadow-enterprise"
        >
          <div className="space-y-lg p-6">
            <div className="flex justify-between items-center p-md bg-muted/30 rounded-md">
              <span className="sap-body-2">Scheduled Maintenance</span>
              <span className="sap-heading-4">{capacityData.next30Days} / {capacityData.capacity}</span>
            </div>
            <div className="space-y-sm">
              <div className="flex justify-between items-center">
                <span className="sap-caption">Capacity Utilization</span>
                <span className={`sap-body-1 font-bold ${capacityData.utilizationPercentage > 80 ? 'text-warning' : 'text-success'}`}>
                  {Math.round(capacityData.utilizationPercentage)}%
                </span>
              </div>
              <ProgressIndicator value={capacityData.utilizationPercentage} className="h-3" />
            </div>
            {capacityData.utilizationPercentage > 80 && (
              <div className="status-warning p-sm rounded-md">
                <p className="text-xs font-medium">High capacity utilization detected</p>
              </div>
            )}
          </div>
        </Card>

        {/* Average Maintenance Downtime Card (Previously Cost Savings) */}
        <Card
          header={
            <CardHeader
              titleText="Average Maintenance Downtime"
              avatar={<Icon name="line-chart" />}
            />
          }
          className="sap-card shadow-enterprise"
        >
          <div className="p-md">
            <div className="w-full h-[450px] border border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
              <img
                src="logo.png" // Make sure logo.png is in your public folder
                alt="Chart showing average maintenance downtime"
                className="w-full h-full object-contain rounded-md"
              />
            </div>
          </div>
        </Card>

        {/* Predictive Cost Savings Card (Previously Average Downtime) */}
        <Card
            header={
                <CardHeader
                    titleText="Predictive Cost Savings"
                    subtitleText="Annual optimization potential"
                    avatar={<Icon name="arrow-down" />}
                />
            }
            className="sap-card shadow-enterprise"
        >
          <div className="space-y-lg p-6">
            <div className="text-center p-xl bg-success-light rounded-lg">
              <p className="text-4xl font-bold text-success mb-xs">$2.4M</p>
              <p className="sap-caption">Projected Annual Savings</p>
            </div>
            <div className="space-y-md">
              <div className="flex justify-between items-center p-sm border-l-4 border-l-success bg-success-light/30 rounded-r-md">
                <span className="sap-body-2">Unplanned maintenance reduction</span>
                <span className="sap-body-1 font-bold text-success">$1.2M</span>
              </div>
              <div className="flex justify-between items-center p-sm border-l-4 border-l-info bg-info-light/30 rounded-r-md">
                <span className="sap-body-2">Optimized parts inventory</span>
                <span className="sap-body-1 font-bold text-info">$800K</span>
              </div>
              <div className="flex justify-between items-center p-sm border-l-4 border-l-warning bg-warning-light/30 rounded-r-md">
                <span className="sap-body-2">Extended component life</span>
                <span className="sap-body-1 font-bold text-warning">$400K</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* SAP Fiori Object List */}
      <div className="space-y-lg">
        <div className="flex items-center justify-between">
          <h3 className="sap-heading-3">AI-Generated Insights</h3>
          <div className="flex items-center space-x-sm">
            <Icon name="lightbulb" className="w-4 h-4 text-primary" />
            <span className="sap-caption">Powered by SAP HANA ML</span>
          </div>
        </div>

        <div className="space-y-md">
          {insights.length > 0 ? insights.map((insight, index) => {
            const config = getSeverityConfig(insight.severity);

            return (
              <Card
                header={
                    <CardHeader
                        titleText={insight.title}
                        avatar={<Icon name={config.icon} />}
                    />
                }
                key={index}
                className={`sap-card border-l-4 ${config.color.split(' ')[0]} shadow-enterprise hover:shadow-lg transition-all duration-300`}
              >
                <div className="space-y-md p-6">
                  <p className="sap-body-1">{insight.description}</p>
                  <div className="bg-accent/20 border border-accent/40 p-lg rounded-md">
                    <div className="flex items-start space-x-sm">
                      <Icon name="lightbulb" className="w-4 h-4 text-primary mt-xs flex-shrink-0" />
                      <div>
                        <p className="sap-body-1 font-medium text-foreground mb-xs">Recommended Action:</p>
                        <p className="sap-body-2">{insight.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          }) : (
            <p className="sap-body-2 text-muted-foreground">No predictive insights available at this time.</p>
          )}
        </div>
      </div>
    </div>
  );
};
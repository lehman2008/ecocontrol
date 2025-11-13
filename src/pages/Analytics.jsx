import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import KPICards from "../components/analytics/KPICards";
import ConsumptionComparison from "../components/analytics/ConsumptionComparison";
import AlertsOverview from "../components/analytics/AlertsOverview";
import CostBreakdown from "../components/analytics/CostBreakdown";

export default function AnalyticsPage() {
  const { data: energyReadings = [] } = useQuery({
    queryKey: ['energyReadings'],
    queryFn: () => base44.entities.EnergyReading.list('-reading_date', 365),
  });

  const { data: waterReadings = [] } = useQuery({
    queryKey: ['waterReadings'],
    queryFn: () => base44.entities.WaterReading.list('-reading_date', 365),
  });

  const { data: fuelReadings = [] } = useQuery({
    queryKey: ['gasConsumption'],
    queryFn: () => base44.entities.GasConsumption.list('-reading_date', 365),
  });

  const { data: occupancyData = [] } = useQuery({
    queryKey: ['occupancyData'],
    queryFn: () => base44.entities.OccupancyData.list('-date', 365),
  });

  const { data: equipment = [] } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => base44.entities.Equipment.list(),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['maintenanceTasks'],
    queryFn: () => base44.entities.MaintenanceTask.list('-scheduled_date'),
  });

  const handleExportReport = () => {
    // Preparar datos para exportación
    const reportData = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalEnergy: energyReadings.reduce((s, r) => s + (r.consumption_kwh || 0), 0),
        totalWater: waterReadings.reduce((s, r) => s + (r.consumption_m3 || 0), 0),
        totalFuel: fuelReadings.reduce((s, r) => s + (r.kwh_equivalent || 0), 0),
        totalCost: [
          ...energyReadings.map(r => r.cost_estimate || 0),
          ...waterReadings.map(r => r.cost_estimate || 0),
          ...fuelReadings.map(r => r.cost || 0)
        ].reduce((a, b) => a + b, 0)
      },
      equipment: {
        total: equipment.length,
        operational: equipment.filter(e => e.status === 'operativo').length,
        maintenance: equipment.filter(e => e.status === 'mantenimiento').length,
        broken: equipment.filter(e => e.status === 'averiado').length
      },
      tasks: {
        pending: tasks.filter(t => t.status === 'pendiente').length,
        inProgress: tasks.filter(t => t.status === 'en_proceso').length,
        completed: tasks.filter(t => t.status === 'completada').length
      }
    };

    // Convertir a JSON y descargar
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ecocontrol-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Analíticas y KPIs
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Indicadores clave de rendimiento y análisis avanzados
            </p>
          </div>
          <Button
            onClick={handleExportReport}
            variant="outline"
            className="border-2"
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar Reporte
          </Button>
        </div>

        {/* KPI Cards */}
        <KPICards
          energyReadings={energyReadings}
          waterReadings={waterReadings}
          fuelReadings={fuelReadings}
          occupancyData={occupancyData}
        />

        {/* Consumption Comparison */}
        <ConsumptionComparison
          energyReadings={energyReadings}
          waterReadings={waterReadings}
          fuelReadings={fuelReadings}
        />

        {/* Alerts and Cost Breakdown */}
        <div className="grid lg:grid-cols-2 gap-6">
          <AlertsOverview
            equipment={equipment}
            tasks={tasks}
            energyReadings={energyReadings}
            waterReadings={waterReadings}
          />
          <CostBreakdown
            energyReadings={energyReadings}
            waterReadings={waterReadings}
            fuelReadings={fuelReadings}
          />
        </div>
      </div>
    </div>
  );
}
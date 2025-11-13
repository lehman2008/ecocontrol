import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  ArrowRight,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardMetrics from "../components/dashboard/DashboardMetrics";
import QuickActions from "../components/dashboard/QuickActions";
import SystemOverview from "../components/dashboard/SystemOverview";
import UpcomingMaintenance from "../components/dashboard/UpcomingMaintenance";
import RecentAlerts from "../components/dashboard/RecentAlerts";
import ConsumptionWidget from "../components/dashboard/ConsumptionWidget";
import EquipmentStatus from "../components/dashboard/EquipmentStatus";

export default function Dashboard() {
  const { data: energyReadings = [] } = useQuery({
    queryKey: ['energyReadings'],
    queryFn: () => base44.entities.EnergyReading.list('-reading_date', 50),
  });

  const { data: waterReadings = [] } = useQuery({
    queryKey: ['waterReadings'],
    queryFn: () => base44.entities.WaterReading.list('-reading_date', 50),
  });

  const { data: fuelReadings = [] } = useQuery({
    queryKey: ['gasConsumption'],
    queryFn: () => base44.entities.GasConsumption.list('-reading_date', 50),
  });

  const { data: poolMeasurements = [] } = useQuery({
    queryKey: ['poolMeasurements'],
    queryFn: () => base44.entities.PoolMeasurement.list('-measurement_date', 20),
  });

  const { data: equipment = [] } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => base44.entities.Equipment.list(),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['maintenanceTasks'],
    queryFn: () => base44.entities.MaintenanceTask.list('-scheduled_date'),
  });

  const { data: occupancyData = [] } = useQuery({
    queryKey: ['occupancyData'],
    queryFn: () => base44.entities.OccupancyData.list('-date', 30),
  });

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
              Panel de Control
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Vista general del sistema de mantenimiento
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to={createPageUrl("Analytics")}>
              <Button variant="outline" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Ver Analíticas
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Metrics */}
        <DashboardMetrics 
          energyReadings={energyReadings}
          waterReadings={waterReadings}
          fuelReadings={fuelReadings}
          equipment={equipment}
          tasks={tasks}
          occupancyData={occupancyData}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* System Overview & Alerts */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SystemOverview 
              equipment={equipment}
              tasks={tasks}
              poolMeasurements={poolMeasurements}
            />
            <ConsumptionWidget
              energyReadings={energyReadings}
              waterReadings={waterReadings}
              fuelReadings={fuelReadings}
            />
          </div>

          <div className="space-y-6">
            <EquipmentStatus equipment={equipment} />
            <UpcomingMaintenance tasks={tasks} />
            <RecentAlerts 
              equipment={equipment}
              tasks={tasks}
              poolMeasurements={poolMeasurements}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
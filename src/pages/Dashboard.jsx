import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Zap, 
  Droplets, 
  Waves, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MetricCard from "../components/dashboard/MetricCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import AlertsPanel from "../components/dashboard/AlertsPanel";
import ConsumptionChart from "../components/dashboard/ConsumptionChart";

export default function Dashboard() {
  const { data: energyReadings = [] } = useQuery({
    queryKey: ['energyReadings'],
    queryFn: () => base44.entities.EnergyReading.list('-reading_date', 50),
  });

  const { data: waterReadings = [] } = useQuery({
    queryKey: ['waterReadings'],
    queryFn: () => base44.entities.WaterReading.list('-reading_date', 50),
  });

  const { data: poolMeasurements = [] } = useQuery({
    queryKey: ['poolMeasurements'],
    queryFn: () => base44.entities.PoolMeasurement.list('-measurement_date', 20),
  });

  // Calculate metrics
  const totalEnergyConsumption = energyReadings
    .slice(0, 7)
    .reduce((sum, r) => sum + (r.consumption_kwh || 0), 0);
  
  const totalSolarProduction = energyReadings
    .slice(0, 7)
    .reduce((sum, r) => sum + (r.solar_production_kwh || 0), 0);

  const totalWaterConsumption = waterReadings
    .slice(0, 7)
    .reduce((sum, r) => sum + (r.consumption_m3 || 0), 0);

  const latestPoolStatus = poolMeasurements[0];
  const poolStatus = latestPoolStatus?.status || 'sin_datos';

  // Check for alerts
  const poolAlerts = poolMeasurements.filter(m => 
    m.status === 'requiere_atencion' || m.status === 'critico'
  ).length;

  const quickActions = [
    {
      title: "Registrar Energía",
      icon: Zap,
      url: createPageUrl("Energy"),
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "Registrar Agua",
      icon: Droplets,
      url: createPageUrl("Water"),
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "Medición Piscina",
      icon: Waves,
      url: createPageUrl("Pool"),
      color: "from-cyan-400 to-teal-500"
    },
  ];

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
              Panel de Control
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Monitoreo en tiempo real de todos los sistemas del hotel
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-green-700">Sistema Activo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.url}>
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur cursor-pointer overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-slate-800">{action.title}</p>
                        <p className="text-sm text-slate-500">Nueva lectura</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Consumo Energía"
            value={`${totalEnergyConsumption.toFixed(1)} kWh`}
            subtitle="Últimos 7 días"
            icon={Zap}
            trend={-5.2}
            gradient="from-amber-500 to-orange-500"
          />
          <MetricCard
            title="Producción Solar"
            value={`${totalSolarProduction.toFixed(1)} kWh`}
            subtitle="Últimos 7 días"
            icon={Zap}
            trend={8.3}
            gradient="from-green-500 to-emerald-500"
          />
          <MetricCard
            title="Consumo Agua"
            value={`${totalWaterConsumption.toFixed(1)} m³`}
            subtitle="Últimos 7 días"
            icon={Droplets}
            trend={-2.1}
            gradient="from-blue-400 to-blue-600"
          />
          <MetricCard
            title="Estado Piscina"
            value={poolStatus === 'optimo' ? 'Óptimo' : poolStatus === 'aceptable' ? 'Aceptable' : poolStatus === 'requiere_atencion' ? 'Requiere Atención' : 'Sin Datos'}
            subtitle={poolAlerts > 0 ? `${poolAlerts} alertas activas` : 'Sin alertas'}
            icon={Waves}
            statusColor={poolStatus === 'optimo' ? 'green' : poolStatus === 'aceptable' ? 'blue' : poolStatus === 'requiere_atencion' ? 'orange' : 'gray'}
            gradient="from-cyan-400 to-teal-500"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ConsumptionChart 
              energyReadings={energyReadings}
              waterReadings={waterReadings}
            />
          </div>
          <div className="space-y-6">
            <AlertsPanel poolMeasurements={poolMeasurements} />
            <RecentActivity 
              energyReadings={energyReadings}
              waterReadings={waterReadings}
              poolMeasurements={poolMeasurements}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
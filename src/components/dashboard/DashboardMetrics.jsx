import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Droplets, Wrench, Package, TrendingUp, TrendingDown, Users } from "lucide-react";

export default function DashboardMetrics({ 
  energyReadings, 
  waterReadings, 
  fuelReadings, 
  equipment, 
  tasks,
  occupancyData 
}) {
  // Calcular métricas
  const last7Days = {
    energy: energyReadings.slice(0, 7),
    water: waterReadings.slice(0, 7),
    fuel: fuelReadings.slice(0, 7),
    occupancy: occupancyData.slice(0, 7)
  };

  const prev7Days = {
    energy: energyReadings.slice(7, 14),
    water: waterReadings.slice(7, 14)
  };

  const totalEnergy = last7Days.energy.reduce((sum, r) => sum + (r.consumption_kwh || 0), 0);
  const prevEnergy = prev7Days.energy.reduce((sum, r) => sum + (r.consumption_kwh || 0), 0);
  const energyChange = prevEnergy > 0 ? ((totalEnergy - prevEnergy) / prevEnergy * 100) : 0;

  const totalWater = last7Days.water.reduce((sum, r) => sum + (r.consumption_m3 || 0), 0);
  const prevWater = prev7Days.water.reduce((sum, r) => sum + (r.consumption_m3 || 0), 0);
  const waterChange = prevWater > 0 ? ((totalWater - prevWater) / prevWater * 100) : 0;

  const operationalEquipment = equipment.filter(e => e.status === 'operativo').length;
  const equipmentRate = equipment.length > 0 ? (operationalEquipment / equipment.length * 100) : 100;

  const pendingTasks = tasks.filter(t => t.status === 'pendiente').length;
  const completedTasks = tasks.filter(t => t.status === 'completada').length;

  const avgOccupancy = last7Days.occupancy.length > 0
    ? last7Days.occupancy.reduce((sum, o) => sum + (o.occupancy_percentage || 0), 0) / last7Days.occupancy.length
    : 0;

  const metrics = [
    {
      title: "Consumo Energético",
      value: `${totalEnergy.toFixed(0)} kWh`,
      subtitle: "Últimos 7 días",
      change: energyChange,
      icon: Zap,
      gradient: "from-amber-500 to-orange-500"
    },
    {
      title: "Consumo de Agua",
      value: `${totalWater.toFixed(1)} m³`,
      subtitle: "Últimos 7 días",
      change: waterChange,
      icon: Droplets,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Equipos Operativos",
      value: `${equipmentRate.toFixed(0)}%`,
      subtitle: `${operationalEquipment}/${equipment.length} equipos`,
      icon: Package,
      gradient: "from-green-500 to-emerald-500",
      success: equipmentRate >= 90
    },
    {
      title: "Tareas Pendientes",
      value: pendingTasks.toString(),
      subtitle: `${completedTasks} completadas`,
      icon: Wrench,
      gradient: "from-purple-500 to-pink-500",
      alert: pendingTasks > 10
    },
    {
      title: "Ocupación Media",
      value: `${avgOccupancy.toFixed(1)}%`,
      subtitle: "Últimos 7 días",
      icon: Users,
      gradient: "from-indigo-500 to-violet-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => (
        <Card 
          key={index} 
          className={`border-0 shadow-xl bg-white/80 backdrop-blur overflow-hidden transition-all hover:shadow-2xl hover:scale-105 ${
            metric.alert ? 'ring-2 ring-red-300 animate-pulse' : ''
          }`}
        >
          <div className={`h-1.5 bg-gradient-to-r ${metric.gradient}`} />
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  {metric.title}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
                  {metric.value}
                </h3>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center shadow-lg`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium">{metric.subtitle}</p>
              {metric.change !== undefined && (
                <div className="flex items-center gap-1">
                  {metric.change >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-red-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-green-600" />
                  )}
                  <span className={`text-xs font-bold ${metric.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {Math.abs(metric.change).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
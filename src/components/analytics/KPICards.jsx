import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react";

export default function KPICards({ energyReadings, waterReadings, fuelReadings, occupancyData }) {
  // Calcular KPIs
  const last30Days = {
    energy: energyReadings.slice(0, 30),
    water: waterReadings.slice(0, 30),
    fuel: fuelReadings.slice(0, 30),
    occupancy: occupancyData.slice(0, 30)
  };

  const previous30Days = {
    energy: energyReadings.slice(30, 60),
    water: waterReadings.slice(30, 60),
    fuel: fuelReadings.slice(30, 60)
  };

  // Consumo por habitación ocupada
  const totalOccupiedRooms = last30Days.occupancy.reduce((sum, o) => sum + (o.occupied_rooms || 0), 0);
  const avgOccupiedRooms = totalOccupiedRooms / (last30Days.occupancy.length || 1);
  
  const totalEnergyKwh = last30Days.energy.reduce((sum, e) => sum + (e.consumption_kwh || 0), 0);
  const energyPerRoom = avgOccupiedRooms > 0 ? totalEnergyKwh / totalOccupiedRooms : 0;

  const totalWaterM3 = last30Days.water.reduce((sum, w) => sum + (w.consumption_m3 || 0), 0);
  const waterPerRoom = avgOccupiedRooms > 0 ? totalWaterM3 / totalOccupiedRooms : 0;

  // Costos totales
  const totalCost = [
    ...last30Days.energy.map(e => e.cost_estimate || 0),
    ...last30Days.water.map(w => w.cost_estimate || 0),
    ...last30Days.fuel.map(f => f.cost || 0)
  ].reduce((a, b) => a + b, 0);

  const costPerRoom = avgOccupiedRooms > 0 ? totalCost / totalOccupiedRooms : 0;

  // Comparativa con mes anterior
  const prevTotalEnergy = previous30Days.energy.reduce((sum, e) => sum + (e.consumption_kwh || 0), 0);
  const energyChange = prevTotalEnergy > 0 ? ((totalEnergyKwh - prevTotalEnergy) / prevTotalEnergy * 100) : 0;

  const prevTotalWater = previous30Days.water.reduce((sum, w) => sum + (w.consumption_m3 || 0), 0);
  const waterChange = prevTotalWater > 0 ? ((totalWaterM3 - prevTotalWater) / prevTotalWater * 100) : 0;

  // Ocupación promedio
  const avgOccupancy = last30Days.occupancy.length > 0
    ? last30Days.occupancy.reduce((sum, o) => sum + (o.occupancy_percentage || 0), 0) / last30Days.occupancy.length
    : 0;

  const kpis = [
    {
      title: "Energía por Habitación",
      value: `${energyPerRoom.toFixed(1)} kWh`,
      subtitle: "Últimos 30 días",
      change: energyChange,
      icon: TrendingUp,
      gradient: "from-amber-500 to-orange-500"
    },
    {
      title: "Agua por Habitación",
      value: `${waterPerRoom.toFixed(2)} m³`,
      subtitle: "Últimos 30 días",
      change: waterChange,
      icon: TrendingDown,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Ocupación Media",
      value: `${avgOccupancy.toFixed(1)}%`,
      subtitle: `${avgOccupiedRooms.toFixed(0)} hab/día`,
      icon: Users,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Coste por Habitación",
      value: `${costPerRoom.toFixed(2)} €`,
      subtitle: "Últimos 30 días",
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur overflow-hidden">
          <div className={`h-1 bg-gradient-to-r ${kpi.gradient}`} />
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  {kpi.title}
                </p>
                <h3 className="text-2xl font-bold text-slate-800">
                  {kpi.value}
                </h3>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-md`}>
                <kpi.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium">{kpi.subtitle}</p>
              {kpi.change !== undefined && (
                <div className="flex items-center gap-1">
                  {kpi.change >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-red-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-green-600" />
                  )}
                  <span className={`text-xs font-bold ${kpi.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {Math.abs(kpi.change).toFixed(1)}%
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
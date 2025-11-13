import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, TrendingDown, Leaf, Euro } from "lucide-react";

export default function EnergyStats({ readings }) {
  const last7Days = readings.slice(0, 7);
  
  const totalConsumption = last7Days.reduce((sum, r) => sum + (r.consumption_kwh || 0), 0);
  const totalProduction = last7Days.reduce((sum, r) => sum + (r.solar_production_kwh || 0), 0);
  const totalCost = last7Days.reduce((sum, r) => sum + (r.cost_estimate || 0), 0);
  const netConsumption = totalConsumption - totalProduction;
  const selfSufficiency = totalConsumption > 0 ? ((totalProduction / totalConsumption) * 100) : 0;

  const stats = [
    {
      title: "Consumo Total",
      value: `${totalConsumption.toFixed(1)} kWh`,
      subtitle: "Últimos 7 días",
      icon: Zap,
      gradient: "from-amber-500 to-orange-500"
    },
    {
      title: "Producción Solar",
      value: `${totalProduction.toFixed(1)} kWh`,
      subtitle: `${selfSufficiency.toFixed(1)}% autosuficiencia`,
      icon: Leaf,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Consumo Neto",
      value: `${netConsumption.toFixed(1)} kWh`,
      subtitle: "Consumo - Producción",
      icon: TrendingDown,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Coste Estimado",
      value: `${totalCost.toFixed(2)} €`,
      subtitle: "Últimos 7 días",
      icon: Euro,
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur overflow-hidden">
          <div className={`h-1 bg-gradient-to-r ${stat.gradient}`} />
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-slate-800">
                  {stat.value}
                </h3>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
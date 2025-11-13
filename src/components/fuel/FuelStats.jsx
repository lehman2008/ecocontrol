import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, TrendingDown, Leaf, Euro } from "lucide-react";

export default function FuelStats({ readings }) {
  const last30Days = readings.slice(0, 30);
  
  const totalKwh = last30Days.reduce((sum, r) => sum + (r.kwh_equivalent || 0), 0);
  const totalCost = last30Days.reduce((sum, r) => sum + (r.cost || 0), 0);
  const totalCO2 = last30Days.reduce((sum, r) => sum + (r.co2_emissions_kg || 0), 0);

  // Calcular distribución por tipo de combustible
  const byFuelType = last30Days.reduce((acc, r) => {
    const type = r.fuel_type || 'unknown';
    acc[type] = (acc[type] || 0) + (r.kwh_equivalent || 0);
    return acc;
  }, {});

  const mainFuelType = Object.entries(byFuelType).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    {
      title: "Consumo Total",
      value: `${totalKwh.toFixed(0)} kWh`,
      subtitle: "Últimos 30 días",
      icon: Flame,
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "Combustible Principal",
      value: mainFuelType ? mainFuelType[0].replace(/_/g, ' ') : '-',
      subtitle: mainFuelType ? `${mainFuelType[1].toFixed(0)} kWh` : 'Sin datos',
      icon: Flame,
      gradient: "from-red-500 to-pink-500"
    },
    {
      title: "Emisiones CO₂",
      value: `${totalCO2.toFixed(0)} kg`,
      subtitle: "Últimos 30 días",
      icon: Leaf,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Coste Total",
      value: `${totalCost.toFixed(2)} €`,
      subtitle: "Últimos 30 días",
      icon: Euro,
      gradient: "from-purple-500 to-indigo-500"
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
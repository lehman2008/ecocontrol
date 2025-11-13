import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Droplets, Thermometer, Gauge, Euro } from "lucide-react";

export default function WaterStats({ readings }) {
  const last7Days = readings.slice(0, 7);
  
  const totalColdWater = last7Days
    .filter(r => r.water_type === 'fria')
    .reduce((sum, r) => sum + (r.consumption_m3 || 0), 0);
  
  const totalACS = last7Days
    .filter(r => r.water_type === 'acs')
    .reduce((sum, r) => sum + (r.consumption_m3 || 0), 0);
  
  const totalCost = last7Days.reduce((sum, r) => sum + (r.cost_estimate || 0), 0);
  
  const acsReadings = readings.filter(r => r.water_type === 'acs' && r.boiler_temperature);
  const avgBoilerTemp = acsReadings.length > 0
    ? acsReadings.reduce((sum, r) => sum + (r.boiler_temperature || 0), 0) / acsReadings.length
    : 0;

  const stats = [
    {
      title: "Agua Fría",
      value: `${totalColdWater.toFixed(2)} m³`,
      subtitle: "Últimos 7 días",
      icon: Droplets,
      gradient: "from-blue-400 to-blue-600"
    },
    {
      title: "ACS",
      value: `${totalACS.toFixed(2)} m³`,
      subtitle: "Últimos 7 días",
      icon: Droplets,
      gradient: "from-orange-400 to-red-500"
    },
    {
      title: "Temp. Media Caldera",
      value: `${avgBoilerTemp.toFixed(1)} °C`,
      subtitle: "Promedio actual",
      icon: Thermometer,
      gradient: "from-red-500 to-pink-500"
    },
    {
      title: "Coste Estimado",
      value: `${totalCost.toFixed(2)} €`,
      subtitle: "Últimos 7 días",
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
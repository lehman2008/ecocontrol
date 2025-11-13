import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Waves, ThermometerSun, Droplet, AlertTriangle } from "lucide-react";

export default function PoolStats({ measurements }) {
  const latest = measurements[0];
  
  const alerts = measurements.filter(m => 
    m.status === 'requiere_atencion' || m.status === 'critico'
  ).length;

  const avgPh = measurements.slice(0, 7).length > 0
    ? measurements.slice(0, 7).reduce((sum, m) => sum + (m.ph_level || 0), 0) / measurements.slice(0, 7).length
    : 0;

  const avgTemp = measurements.slice(0, 7).length > 0
    ? measurements.slice(0, 7).reduce((sum, m) => sum + (m.water_temperature || 0), 0) / measurements.slice(0, 7).length
    : 0;

  const stats = [
    {
      title: "Último pH",
      value: latest?.ph_level ? `${latest.ph_level.toFixed(1)}` : '-',
      subtitle: `Promedio 7 días: ${avgPh.toFixed(1)}`,
      icon: Droplet,
      gradient: "from-blue-400 to-blue-600",
      status: latest?.ph_level && (latest.ph_level < 7.2 || latest.ph_level > 7.6) ? 'warning' : 'ok'
    },
    {
      title: "Cloro Libre",
      value: latest?.free_chlorine ? `${latest.free_chlorine.toFixed(2)} mg/L` : '-',
      subtitle: latest?.pool_name?.replace(/_/g, ' ') || 'Sin datos',
      icon: Waves,
      gradient: "from-cyan-400 to-teal-500",
      status: latest?.free_chlorine && (latest.free_chlorine < 0.5 || latest.free_chlorine > 2.0) ? 'warning' : 'ok'
    },
    {
      title: "Temperatura",
      value: latest?.water_temperature ? `${latest.water_temperature.toFixed(1)} °C` : '-',
      subtitle: `Promedio 7 días: ${avgTemp.toFixed(1)} °C`,
      icon: ThermometerSun,
      gradient: "from-orange-400 to-red-500"
    },
    {
      title: "Alertas Activas",
      value: alerts.toString(),
      subtitle: alerts === 0 ? 'Todo en orden' : 'Requieren atención',
      icon: AlertTriangle,
      gradient: alerts === 0 ? "from-green-500 to-emerald-500" : "from-red-500 to-orange-500",
      status: alerts > 0 ? 'alert' : 'ok'
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
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md ${stat.status === 'warning' || stat.status === 'alert' ? 'animate-pulse' : ''}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {stat.status === 'warning' && (
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
              )}
              {stat.status === 'alert' && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
              <p className="text-xs text-slate-500 font-medium">{stat.subtitle}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
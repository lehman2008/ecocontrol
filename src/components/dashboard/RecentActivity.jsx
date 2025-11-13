import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Droplets, Waves } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function RecentActivity({ energyReadings, waterReadings, poolMeasurements }) {
  const activities = [
    ...energyReadings.slice(0, 3).map(r => ({
      type: 'energy',
      date: r.reading_date,
      location: r.meter_location,
      value: `${r.consumption_kwh} kWh`,
      icon: Zap,
      color: 'from-amber-500 to-orange-500'
    })),
    ...waterReadings.slice(0, 3).map(r => ({
      type: 'water',
      date: r.reading_date,
      location: r.meter_location,
      value: `${r.consumption_m3} m³`,
      icon: Droplets,
      color: 'from-blue-400 to-blue-600'
    })),
    ...poolMeasurements.slice(0, 3).map(m => ({
      type: 'pool',
      date: m.measurement_date,
      location: m.pool_name,
      value: `pH ${m.ph_level}`,
      icon: Waves,
      color: 'from-cyan-400 to-teal-500'
    }))
  ]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 6);

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-slate-800">
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                <activity.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-800 truncate">
                  {activity.location?.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-slate-500">
                  {format(new Date(activity.date), "dd MMM, HH:mm", { locale: es })}
                </p>
              </div>
              <Badge variant="secondary" className="bg-white border border-slate-200 text-slate-700 font-bold text-xs">
                {activity.value}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
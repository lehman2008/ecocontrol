import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Waves } from "lucide-react";

export default function RecentAlerts({ equipment, tasks, poolMeasurements }) {
  const alerts = [];

  // Equipos averiados
  equipment.filter(e => e.status === 'averiado').forEach(eq => {
    alerts.push({
      type: 'critical',
      title: `Equipo Averiado: ${eq.name}`,
      description: eq.zone?.replace(/_/g, ' '),
      icon: AlertCircle,
      color: 'red',
      timestamp: eq.updated_date || eq.created_date
    });
  });

  // Tareas vencidas
  const now = new Date();
  tasks.filter(t => t.status === 'pendiente' && new Date(t.scheduled_date) < now)
    .slice(0, 3)
    .forEach(task => {
      alerts.push({
        type: 'warning',
        title: `Mantenimiento Vencido`,
        description: task.title,
        icon: AlertTriangle,
        color: 'orange',
        timestamp: task.scheduled_date
      });
    });

  // Alertas de piscina
  poolMeasurements
    .filter(m => m.status === 'requiere_atencion' || m.status === 'critico')
    .slice(0, 2)
    .forEach(m => {
      alerts.push({
        type: 'warning',
        title: `Piscina: ${m.pool_name?.replace(/_/g, ' ')}`,
        description: `pH: ${m.ph_level} - Cloro: ${m.free_chlorine} mg/L`,
        icon: Waves,
        color: m.status === 'critico' ? 'red' : 'yellow',
        timestamp: m.measurement_date
      });
    });

  // Ordenar por fecha
  alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const recentAlerts = alerts.slice(0, 5);

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Alertas Recientes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {recentAlerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-slate-700">¡Todo bien!</p>
            <p className="text-xs text-slate-500 mt-1">No hay alertas recientes</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentAlerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.color === 'red' ? 'bg-red-50 border-red-500' :
                  alert.color === 'orange' ? 'bg-orange-50 border-orange-500' :
                  'bg-yellow-50 border-yellow-500'
                }`}
              >
                <div className="flex items-start gap-2">
                  <alert.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    alert.color === 'red' ? 'text-red-600' :
                    alert.color === 'orange' ? 'text-orange-600' :
                    'text-yellow-600'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-slate-800 mb-0.5 line-clamp-1">
                      {alert.title}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-1">
                      {alert.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
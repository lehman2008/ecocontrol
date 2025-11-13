import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Wrench, AlertCircle } from "lucide-react";

export default function AlertsOverview({ equipment, tasks, energyReadings, waterReadings }) {
  const alerts = [];

  // Equipos averiados
  const brokenEquipment = equipment.filter(e => e.status === 'averiado');
  if (brokenEquipment.length > 0) {
    alerts.push({
      type: "critical",
      icon: AlertCircle,
      title: "Equipos Averiados",
      count: brokenEquipment.length,
      message: `${brokenEquipment.length} equipo(s) requieren reparación urgente`,
      color: "red"
    });
  }

  // Tareas vencidas
  const overdueTasks = tasks.filter(t => 
    t.status === 'pendiente' && 
    new Date(t.scheduled_date) < new Date()
  );
  if (overdueTasks.length > 0) {
    alerts.push({
      type: "warning",
      icon: Wrench,
      title: "Mantenimientos Vencidos",
      count: overdueTasks.length,
      message: `${overdueTasks.length} tarea(s) de mantenimiento pasadas de fecha`,
      color: "orange"
    });
  }

  // Consumo elevado de energía (>15% sobre media)
  const last7DaysEnergy = energyReadings.slice(0, 7);
  const prev7DaysEnergy = energyReadings.slice(7, 14);
  
  const avgLast7 = last7DaysEnergy.reduce((s, e) => s + (e.consumption_kwh || 0), 0) / (last7DaysEnergy.length || 1);
  const avgPrev7 = prev7DaysEnergy.reduce((s, e) => s + (e.consumption_kwh || 0), 0) / (prev7DaysEnergy.length || 1);
  
  if (avgPrev7 > 0 && ((avgLast7 - avgPrev7) / avgPrev7) > 0.15) {
    alerts.push({
      type: "warning",
      icon: TrendingUp,
      title: "Consumo Energético Elevado",
      count: 1,
      message: `Consumo un ${(((avgLast7 - avgPrev7) / avgPrev7) * 100).toFixed(1)}% superior a la semana anterior`,
      color: "yellow"
    });
  }

  // Consumo elevado de agua
  const last7DaysWater = waterReadings.slice(0, 7);
  const prev7DaysWater = waterReadings.slice(7, 14);
  
  const avgLast7Water = last7DaysWater.reduce((s, w) => s + (w.consumption_m3 || 0), 0) / (last7DaysWater.length || 1);
  const avgPrev7Water = prev7DaysWater.reduce((s, w) => s + (w.consumption_m3 || 0), 0) / (prev7DaysWater.length || 1);
  
  if (avgPrev7Water > 0 && ((avgLast7Water - avgPrev7Water) / avgPrev7Water) > 0.15) {
    alerts.push({
      type: "warning",
      icon: TrendingUp,
      title: "Consumo de Agua Elevado",
      count: 1,
      message: `Consumo un ${(((avgLast7Water - avgPrev7Water) / avgPrev7Water) * 100).toFixed(1)}% superior a la semana anterior`,
      color: "blue"
    });
  }

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          Alertas y Notificaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-slate-700">¡Todo en orden!</p>
            <p className="text-sm text-slate-500 mt-1">No hay alertas activas en el sistema</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl border-l-4 ${
                  alert.color === 'red' ? 'bg-red-50 border-red-500' :
                  alert.color === 'orange' ? 'bg-orange-50 border-orange-500' :
                  alert.color === 'yellow' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <alert.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    alert.color === 'red' ? 'text-red-600' :
                    alert.color === 'orange' ? 'text-orange-600' :
                    alert.color === 'yellow' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-slate-800">{alert.title}</h4>
                      <Badge className={`${
                        alert.color === 'red' ? 'bg-red-100 text-red-700' :
                        alert.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                        alert.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {alert.count}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{alert.message}</p>
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
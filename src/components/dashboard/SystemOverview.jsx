import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Clock, Package } from "lucide-react";

export default function SystemOverview({ equipment, tasks, poolMeasurements }) {
  const equipmentByStatus = {
    operativo: equipment.filter(e => e.status === 'operativo').length,
    mantenimiento: equipment.filter(e => e.status === 'mantenimiento').length,
    averiado: equipment.filter(e => e.status === 'averiado').length
  };

  const tasksByStatus = {
    pendiente: tasks.filter(t => t.status === 'pendiente').length,
    en_proceso: tasks.filter(t => t.status === 'en_proceso').length,
    completada: tasks.filter(t => t.status === 'completada').length
  };

  const overdueTasks = tasks.filter(t => 
    t.status === 'pendiente' && 
    new Date(t.scheduled_date) < new Date()
  ).length;

  const poolAlerts = poolMeasurements.filter(m => 
    m.status === 'requiere_atencion' || m.status === 'critico'
  ).length;

  const sections = [
    {
      title: "Equipos",
      icon: Package,
      total: equipment.length,
      items: [
        { label: "Operativos", value: equipmentByStatus.operativo, color: "bg-green-500", percentage: (equipmentByStatus.operativo / equipment.length * 100) || 0 },
        { label: "En Mantenimiento", value: equipmentByStatus.mantenimiento, color: "bg-yellow-500", percentage: (equipmentByStatus.mantenimiento / equipment.length * 100) || 0 },
        { label: "Averiados", value: equipmentByStatus.averiado, color: "bg-red-500", percentage: (equipmentByStatus.averiado / equipment.length * 100) || 0 }
      ]
    },
    {
      title: "Mantenimientos",
      icon: Clock,
      total: tasks.length,
      items: [
        { label: "Pendientes", value: tasksByStatus.pendiente, color: "bg-blue-500", percentage: (tasksByStatus.pendiente / tasks.length * 100) || 0 },
        { label: "En Proceso", value: tasksByStatus.en_proceso, color: "bg-purple-500", percentage: (tasksByStatus.en_proceso / tasks.length * 100) || 0 },
        { label: "Completadas", value: tasksByStatus.completada, color: "bg-green-500", percentage: (tasksByStatus.completada / tasks.length * 100) || 0 }
      ]
    }
  ];

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="text-2xl font-bold text-slate-800">
          Resumen del Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{section.title}</h3>
                  <p className="text-sm text-slate-500">Total: {section.total}</p>
                </div>
              </div>
              <div className="space-y-3">
                {section.items.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                      <span className="text-sm font-bold text-slate-800">{item.value}</span>
                    </div>
                    <div className="relative">
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} transition-all duration-500`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 mt-1 inline-block">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Alertas Destacadas */}
        {(overdueTasks > 0 || poolAlerts > 0) && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Requiere Atención
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              {overdueTasks > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-bold text-red-800">
                    {overdueTasks} tarea{overdueTasks > 1 ? 's' : ''} vencida{overdueTasks > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-red-600">Mantenimiento atrasado</p>
                </div>
              )}
              {poolAlerts > 0 && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm font-bold text-orange-800">
                    {poolAlerts} alerta{poolAlerts > 1 ? 's' : ''} de piscina
                  </p>
                  <p className="text-xs text-orange-600">Calidad del agua</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
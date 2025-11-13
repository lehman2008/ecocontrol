import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Package, AlertTriangle, Wrench, CheckCircle } from "lucide-react";

export default function EquipmentStats({ equipment }) {
  const totalEquipment = equipment.length;
  
  const operationalCount = equipment.filter(e => e.status === 'operativo').length;
  const maintenanceCount = equipment.filter(e => e.status === 'mantenimiento').length;
  const brokenCount = equipment.filter(e => e.status === 'averiado').length;
  
  const criticalEquipment = equipment.filter(e => e.criticality === 'critica' || e.criticality === 'alta').length;

  const stats = [
    {
      title: "Total Equipos",
      value: totalEquipment.toString(),
      subtitle: `${operationalCount} operativos`,
      icon: Package,
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      title: "Equipos Críticos",
      value: criticalEquipment.toString(),
      subtitle: "Alta prioridad",
      icon: AlertTriangle,
      gradient: "from-red-500 to-orange-500"
    },
    {
      title: "En Mantenimiento",
      value: maintenanceCount.toString(),
      subtitle: "Actualmente",
      icon: Wrench,
      gradient: "from-yellow-500 to-amber-500"
    },
    {
      title: "Averiados",
      value: brokenCount.toString(),
      subtitle: brokenCount === 0 ? "¡Perfecto!" : "Requieren atención",
      icon: brokenCount === 0 ? CheckCircle : AlertTriangle,
      gradient: brokenCount === 0 ? "from-green-500 to-emerald-500" : "from-red-600 to-red-700"
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
                <h3 className="text-3xl font-bold text-slate-800">
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
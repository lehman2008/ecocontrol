import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function FireSafetyStats({ records }) {
  const totalEquipment = records.length;
  const operational = records.filter(r => r.status === 'operativo').length;
  const requiresAttention = records.filter(r => r.status === 'requiere_atencion' || r.status === 'defectuoso').length;
  
  // Inspecciones próximas (30 días)
  const upcomingInspections = records.filter(r => {
    if (!r.next_inspection_date) return false;
    const daysUntil = Math.floor((new Date(r.next_inspection_date) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30 && daysUntil >= 0;
  }).length;

  const stats = [
    {
      title: "Total Equipos",
      value: totalEquipment,
      icon: Shield,
      gradient: "from-red-500 to-orange-500",
      bgGradient: "from-red-50 to-orange-50"
    },
    {
      title: "Operativos",
      value: operational,
      subtitle: `${totalEquipment > 0 ? Math.round((operational / totalEquipment) * 100) : 0}%`,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      title: "Requieren Atención",
      value: requiresAttention,
      icon: AlertTriangle,
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50"
    },
    {
      title: "Inspecciones Próximas",
      value: upcomingInspections,
      subtitle: "Próximos 30 días",
      icon: Clock,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className={`border-0 shadow-lg bg-gradient-to-br ${stat.bgGradient}`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
                )}
              </div>
              <stat.icon className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} text-white p-2 rounded-xl`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
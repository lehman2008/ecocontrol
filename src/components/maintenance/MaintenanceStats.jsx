import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";

export default function MaintenanceStats({ tasks, pendingCount, inProgressCount, completedCount }) {
  const today = new Date();
  const overdueCount = tasks.filter(t => 
    t.status === 'pendiente' && 
    new Date(t.scheduled_date) < today
  ).length;

  const thisWeekCount = tasks.filter(t => {
    const taskDate = new Date(t.scheduled_date);
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return t.status === 'pendiente' && taskDate >= today && taskDate <= weekFromNow;
  }).length;

  const completionRate = tasks.length > 0 
    ? ((completedCount / tasks.length) * 100).toFixed(1)
    : 0;

  const stats = [
    {
      title: "Pendientes",
      value: pendingCount.toString(),
      subtitle: overdueCount > 0 ? `${overdueCount} vencidas` : "Al día",
      icon: Clock,
      gradient: "from-yellow-500 to-amber-500",
      alert: overdueCount > 0
    },
    {
      title: "En Proceso",
      value: inProgressCount.toString(),
      subtitle: "Activas ahora",
      icon: TrendingUp,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Esta Semana",
      value: thisWeekCount.toString(),
      subtitle: "Próximos 7 días",
      icon: AlertTriangle,
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "Tasa de Cumplimiento",
      value: `${completionRate}%`,
      subtitle: `${completedCount} completadas`,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500"
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
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md ${stat.alert ? 'animate-pulse' : ''}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className={`text-xs font-medium ${stat.alert ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
              {stat.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
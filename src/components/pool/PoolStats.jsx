import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Waves, CheckCircle, AlertTriangle, Activity, FileCheck } from "lucide-react";

export default function PoolStats({ measurements }) {
  const totalMeasurements = measurements.length;
  const compliantMeasurements = measurements.filter(m => m.complies_with_rd742).length;
  const nonCompliantMeasurements = measurements.filter(m => !m.complies_with_rd742).length;
  const criticalStatus = measurements.filter(m => m.status === 'no_apto' || m.status === 'critico').length;

  const complianceRate = totalMeasurements > 0 
    ? ((compliantMeasurements / totalMeasurements) * 100).toFixed(1)
    : 0;

  const stats = [
    {
      title: "Total Mediciones",
      value: totalMeasurements,
      icon: Activity,
      gradient: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700"
    },
    {
      title: "Cumple RD 742/2013",
      value: compliantMeasurements,
      subtitle: `${complianceRate}% cumplimiento`,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "No Cumple Normativa",
      value: nonCompliantMeasurements,
      icon: AlertTriangle,
      gradient: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      title: "Estado Crítico/No Apto",
      value: criticalStatus,
      icon: FileCheck,
      gradient: "from-red-500 to-pink-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
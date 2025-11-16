import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

export default function AlertStats({ total, unread, unresolved, critical }) {
  const stats = [
    {
      title: "Total de Alertas",
      value: total,
      icon: Bell,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Sin Leer",
      value: unread,
      icon: AlertCircle,
      gradient: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      title: "Activas",
      value: unresolved,
      icon: AlertTriangle,
      gradient: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    },
    {
      title: "Críticas",
      value: critical,
      icon: AlertTriangle,
      gradient: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
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
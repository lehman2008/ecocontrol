import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  statusColor,
  gradient 
}) {
  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur overflow-hidden group hover:shadow-2xl transition-all duration-300">
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
              {title}
            </p>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">
              {value}
            </h3>
            <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
          </div>
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
        
        {trend !== undefined && (
          <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
            {trend >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span className={`text-sm font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(trend)}%
            </span>
            <span className="text-sm text-slate-500">vs. período anterior</span>
          </div>
        )}
        
        {statusColor && (
          <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
            <div className={`w-3 h-3 rounded-full ${
              statusColor === 'green' ? 'bg-green-500' :
              statusColor === 'blue' ? 'bg-blue-500' :
              statusColor === 'orange' ? 'bg-orange-500' :
              'bg-gray-400'
            }`} />
            <span className="text-sm text-slate-600 font-medium">
              Estado actual del sistema
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
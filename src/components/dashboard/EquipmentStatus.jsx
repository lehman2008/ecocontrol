import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Package, ArrowRight, AlertCircle } from "lucide-react";

export default function EquipmentStatus({ equipment }) {
  const criticalEquipment = equipment.filter(e => 
    e.status === 'averiado' || 
    (e.criticality === 'critica' && e.status !== 'operativo')
  ).slice(0, 5);

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-500" />
            Equipos Críticos
          </CardTitle>
          <Link to={createPageUrl("Equipment")}>
            <ArrowRight className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {criticalEquipment.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Todo en orden</p>
            <p className="text-xs text-slate-500 mt-1">No hay equipos críticos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {criticalEquipment.map((eq) => (
              <div 
                key={eq.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{eq.name}</h4>
                  <Badge 
                    variant="outline"
                    className={`${
                      eq.status === 'averiado' 
                        ? 'bg-red-100 text-red-700 border-red-200' 
                        : 'bg-orange-100 text-orange-700 border-orange-200'
                    } text-xs flex-shrink-0`}
                  >
                    {eq.status === 'averiado' ? (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    ) : null}
                    {eq.status?.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    {eq.zone?.replace(/_/g, ' ')}
                  </span>
                  {eq.criticality === 'critica' && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                      Crítico
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
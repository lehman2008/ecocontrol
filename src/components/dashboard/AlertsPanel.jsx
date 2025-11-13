import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

export default function AlertsPanel({ poolMeasurements }) {
  const alerts = poolMeasurements
    .filter(m => m.status === 'requiere_atencion' || m.status === 'critico')
    .slice(0, 5);

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-800">
            Alertas del Sistema
          </CardTitle>
          {alerts.length === 0 ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-orange-500 animate-pulse" />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              ¡Todo en orden!
            </p>
            <p className="text-xs text-slate-500 mt-1">
              No hay alertas activas en el sistema
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((measurement, index) => (
              <div 
                key={index}
                className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm text-slate-800">
                        {measurement.pool_name?.replace(/_/g, ' ')}
                      </p>
                      <Badge 
                        variant="secondary"
                        className={`${
                          measurement.status === 'critico' 
                            ? 'bg-red-100 text-red-700 border-red-200' 
                            : 'bg-orange-100 text-orange-700 border-orange-200'
                        } border text-xs`}
                      >
                        {measurement.status === 'critico' ? 'Crítico' : 'Requiere Atención'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      pH: {measurement.ph_level} • Cloro: {measurement.free_chlorine} mg/L
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
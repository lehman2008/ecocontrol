import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_CONFIG = {
  optimo: {
    label: "Óptimo",
    icon: CheckCircle,
    className: "bg-green-100 text-green-700 border-green-200"
  },
  aceptable: {
    label: "Aceptable",
    icon: Info,
    className: "bg-blue-100 text-blue-700 border-blue-200"
  },
  requiere_atencion: {
    label: "Requiere Atención",
    icon: AlertTriangle,
    className: "bg-orange-100 text-orange-700 border-orange-200"
  },
  critico: {
    label: "Crítico",
    icon: AlertCircle,
    className: "bg-red-100 text-red-700 border-red-200"
  }
};

export default function PoolList({ measurements, isLoading, onEdit }) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Historial de Mediciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="text-2xl font-bold text-slate-800">
          Historial de Mediciones
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-bold">Fecha</TableHead>
                <TableHead className="font-bold">Piscina</TableHead>
                <TableHead className="font-bold text-center">pH</TableHead>
                <TableHead className="font-bold text-center">Cloro Libre</TableHead>
                <TableHead className="font-bold text-center">Temp.</TableHead>
                <TableHead className="font-bold text-center">Turbidez</TableHead>
                <TableHead className="font-bold text-center">Estado</TableHead>
                <TableHead className="font-bold text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {measurements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                    No hay mediciones registradas aún
                  </TableCell>
                </TableRow>
              ) : (
                measurements.map((measurement) => {
                  const status = STATUS_CONFIG[measurement.status] || STATUS_CONFIG.aceptable;
                  const StatusIcon = status.icon;
                  
                  return (
                    <TableRow key={measurement.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-medium">
                        {format(new Date(measurement.measurement_date), "dd MMM yyyy, HH:mm", { locale: es })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 border border-slate-200">
                          {measurement.pool_name?.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-semibold ${
                          measurement.ph_level >= 7.2 && measurement.ph_level <= 7.6 
                            ? 'text-green-600' 
                            : 'text-orange-600'
                        }`}>
                          {measurement.ph_level?.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-semibold ${
                          measurement.free_chlorine >= 0.5 && measurement.free_chlorine <= 2.0 
                            ? 'text-green-600' 
                            : 'text-orange-600'
                        }`}>
                          {measurement.free_chlorine?.toFixed(2)} mg/L
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {measurement.water_temperature?.toFixed(1)} °C
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="outline" 
                          className={`
                            ${measurement.turbidity === 'cristalina' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                            ${measurement.turbidity === 'ligeramente_turbia' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                            ${measurement.turbidity === 'turbia' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                            ${measurement.turbidity === 'muy_turbia' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                          `}
                        >
                          {measurement.turbidity?.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`${status.className} border font-semibold`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(measurement)}
                          className="hover:bg-slate-100"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
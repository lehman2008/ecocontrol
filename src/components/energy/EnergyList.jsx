import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function EnergyList({ readings, isLoading, onEdit }) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Historial de Lecturas</CardTitle>
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
          Historial de Lecturas
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-bold">Fecha</TableHead>
                <TableHead className="font-bold">Ubicación</TableHead>
                <TableHead className="font-bold text-right">Consumo</TableHead>
                <TableHead className="font-bold text-right">Producción</TableHead>
                <TableHead className="font-bold text-right">Neto</TableHead>
                <TableHead className="font-bold text-right">Coste</TableHead>
                <TableHead className="font-bold text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {readings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    No hay lecturas registradas aún
                  </TableCell>
                </TableRow>
              ) : (
                readings.map((reading) => (
                  <TableRow key={reading.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-medium">
                      {format(new Date(reading.reading_date), "dd MMM yyyy, HH:mm", { locale: es })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 border border-slate-200">
                        {reading.meter_location?.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-orange-600">
                      {reading.consumption_kwh?.toFixed(2)} kWh
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {reading.solar_production_kwh?.toFixed(2) || '0.00'} kWh
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {(reading.net_consumption_kwh || 0) > 0 ? (
                          <TrendingUp className="w-4 h-4 text-red-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-green-500" />
                        )}
                        <span className="font-bold">
                          {reading.net_consumption_kwh?.toFixed(2) || '0.00'} kWh
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {reading.cost_estimate?.toFixed(2) || '0.00'} €
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(reading)}
                        className="hover:bg-slate-100"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
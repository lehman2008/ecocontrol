import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

const FUEL_LABELS = {
  gas_natural: "Gas Natural",
  propano: "Propano",
  butano: "Butano",
  gasoleo: "Gasóleo",
  biomasa_pellets: "Biomasa/Pellets"
};

export default function FuelList({ readings, isLoading, onEdit }) {
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
                <TableHead className="font-bold">Combustible</TableHead>
                <TableHead className="font-bold">Ubicación</TableHead>
                <TableHead className="font-bold text-right">Cantidad</TableHead>
                <TableHead className="font-bold text-right">kWh</TableHead>
                <TableHead className="font-bold text-right">CO₂</TableHead>
                <TableHead className="font-bold text-right">Coste</TableHead>
                <TableHead className="font-bold text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {readings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                    No hay lecturas registradas aún
                  </TableCell>
                </TableRow>
              ) : (
                readings.map((reading) => (
                  <TableRow key={reading.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-medium">
                      {format(new Date(reading.reading_date), "dd MMM yyyy", { locale: es })}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={`
                          ${reading.fuel_type === 'gas_natural' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                          ${reading.fuel_type === 'propano' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}
                          ${reading.fuel_type === 'butano' ? 'bg-red-100 text-red-700 border-red-200' : ''}
                          ${reading.fuel_type === 'gasoleo' ? 'bg-purple-100 text-purple-700 border-purple-200' : ''}
                          ${reading.fuel_type === 'biomasa_pellets' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                          border
                        `}
                      >
                        {FUEL_LABELS[reading.fuel_type] || reading.fuel_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                        {reading.meter_location?.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {reading.quantity?.toFixed(2)} {reading.unit}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-orange-600">
                      {reading.kwh_equivalent?.toFixed(2)} kWh
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {reading.co2_emissions_kg?.toFixed(2)} kg
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {reading.cost?.toFixed(2)} €
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
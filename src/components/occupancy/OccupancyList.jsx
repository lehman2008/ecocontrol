import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function OccupancyList({ occupancyData, isLoading, onEdit }) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Historial de Ocupación</CardTitle>
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

  const getOccupancyColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-100 text-green-700 border-green-200';
    if (percentage >= 70) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="text-2xl font-bold text-slate-800">
          Historial de Ocupación
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-bold">Fecha</TableHead>
                <TableHead className="font-bold text-center">Ocupación</TableHead>
                <TableHead className="font-bold text-center">Habitaciones</TableHead>
                <TableHead className="font-bold text-center">Huéspedes</TableHead>
                <TableHead className="font-bold text-center">Restaurante</TableHead>
                <TableHead className="font-bold text-center">Eventos</TableHead>
                <TableHead className="font-bold text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {occupancyData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    No hay registros de ocupación aún
                  </TableCell>
                </TableRow>
              ) : (
                occupancyData.map((record) => (
                  <TableRow key={record.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-medium">
                      {format(new Date(record.date), "dd MMMM yyyy", { locale: es })}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={`${getOccupancyColor(record.occupancy_percentage)} border font-bold`}
                      >
                        {record.occupancy_percentage?.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {record.occupied_rooms}/{record.total_rooms}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {record.guests_count || 0}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {record.restaurant_covers || 0}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {record.events_attendees || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(record)}
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
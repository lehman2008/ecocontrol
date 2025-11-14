
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// The following Table components are no longer used in the new card-based layout, but keeping them for now in case of partial refactor or future use.
// For a clean removal, they could be deleted. However, the instruction is to preserve all other features.
// If the intent was to completely remove the table view, these imports would be removed.
// Given the instruction "preserving all other features, elements and functionality" and the outline completely replacing the table structure,
// I will remove the unused imports related to `Table` for a cleaner file.
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pencil, Search, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

// Assuming EquipmentDocuments is a separate component and needs to be imported.
// If this component doesn't exist or is imported differently, this line might need adjustment.
import EquipmentDocuments from "./EquipmentDocuments"; 

const STATUS_CONFIG = {
  operativo: { label: "Operativo", icon: CheckCircle, className: "bg-green-100 text-green-700 border-green-200" },
  mantenimiento: { label: "Mantenimiento", icon: Clock, className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  averiado: { label: "Averiado", icon: AlertCircle, className: "bg-red-100 text-red-700 border-red-200" },
  fuera_servicio: { label: "Fuera de Servicio", icon: XCircle, className: "bg-orange-100 text-orange-700 border-orange-200" },
  retirado: { label: "Retirado", icon: XCircle, className: "bg-slate-100 text-slate-700 border-slate-200" }
};

const CRITICALITY_CONFIG = {
  baja: { label: "Baja", className: "bg-blue-50 text-blue-700 border-blue-200" },
  media: { label: "Media", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  alta: { label: "Alta", className: "bg-orange-50 text-orange-700 border-orange-200" },
  critica: { label: "Crítica", className: "bg-red-50 text-red-700 border-red-200" }
};

export default function EquipmentList({ equipment, isLoading, onEdit, showDocuments = false }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedEquipment, setExpandedEquipment] = useState(null);

  const filteredEquipment = equipment.filter(eq =>
    eq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.equipment_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.zone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Listado de Equipos</CardTitle>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-2xl font-bold text-slate-800">
            Listado de Equipos
          </CardTitle>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Buscar equipos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-200"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {filteredEquipment.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              {searchTerm ? 'No se encontraron equipos' : 'No hay equipos registrados aún'}
            </div>
          ) : (
            filteredEquipment.map((eq) => {
              const status = STATUS_CONFIG[eq.status] || STATUS_CONFIG.operativo;
              const criticality = CRITICALITY_CONFIG[eq.criticality] || CRITICALITY_CONFIG.media;
              const StatusIcon = status.icon;
              const isExpanded = expandedEquipment === eq.id;

              return (
                <Card key={eq.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg text-slate-800">{eq.name}</h3>
                          {eq.equipment_code && (
                            <span className="font-mono text-sm font-semibold text-slate-500">
                              {eq.equipment_code}
                            </span>
                          )}
                        </div>
                        
                        {eq.manufacturer && (
                          <p className="text-sm text-slate-600">{eq.manufacturer} {eq.model}</p>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-700 border border-slate-200">
                            {eq.zone?.replace(/_/g, ' ')}
                          </Badge>
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                            {eq.system_type?.replace(/_/g, ' ')}
                          </Badge>
                          <Badge variant="outline" className={`${criticality.className} border font-semibold`}>
                            {criticality.label}
                          </Badge>
                          <Badge variant="outline" className={`${status.className} border font-semibold`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>

                        {eq.next_maintenance_date && (
                          <p className="text-sm text-slate-500">
                            Próximo mantenimiento: {format(new Date(eq.next_maintenance_date), "dd MMM yyyy", { locale: es })}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {showDocuments && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedEquipment(isExpanded ? null : eq.id)}
                          >
                            Documentos
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(eq)}
                          className="hover:bg-slate-100"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {isExpanded && showDocuments && (
                      <div className="mt-4 pt-4 border-t">
                        <EquipmentDocuments equipmentId={eq.id} equipmentName={eq.name} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

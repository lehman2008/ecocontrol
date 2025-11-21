import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, CheckCircle, AlertCircle, XCircle, Search, Filter } from "lucide-react";
import { format } from "date-fns";

const STATUS_CONFIG = {
  operativo: { label: "Operativo", color: "bg-green-100 text-green-700", icon: CheckCircle },
  requiere_atencion: { label: "Requiere Atención", color: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
  defectuoso: { label: "Defectuoso", color: "bg-red-100 text-red-700", icon: XCircle },
  fuera_servicio: { label: "Fuera de Servicio", color: "bg-gray-100 text-gray-700", icon: XCircle }
};

const EQUIPMENT_TYPES_SHORT = {
  extintor: "Extintor",
  bie: "BIE",
  detector_humos: "Detector Humos",
  alarma_incendios: "Alarma",
  rociador: "Rociador",
  puerta_cortafuegos: "Puerta CF",
  señalizacion: "Señalización",
  iluminacion_emergencia: "Ilum. Emergencia",
  pulsador_alarma: "Pulsador",
  central_deteccion: "Central",
  sistema_extincion_cocina: "Ext. Cocina",
  otro: "Otro"
};

export default function FireSafetyList({ records, isLoading, onEdit }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterZone, setFilterZone] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.equipment_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesZone = filterZone === "all" || record.zone === filterZone;
    const matchesType = filterType === "all" || record.equipment_type === filterType;
    const matchesStatus = filterStatus === "all" || record.status === filterStatus;

    return matchesSearch && matchesZone && matchesType && matchesStatus;
  });

  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-white">
        <CardContent className="p-8 text-center">
          <p className="text-slate-500">Cargando inspecciones...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white">
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-xl">Registro de Inspecciones</CardTitle>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-48"
              />
            </div>
            <Select value={filterZone} onValueChange={setFilterZone}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Zona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="cocina">Cocina</SelectItem>
                <SelectItem value="habitaciones">Habitaciones</SelectItem>
                <SelectItem value="zonas_comunes">Comunes</SelectItem>
                <SelectItem value="parking">Parking</SelectItem>
                <SelectItem value="pasillos">Pasillos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="extintor">Extintor</SelectItem>
                <SelectItem value="bie">BIE</SelectItem>
                <SelectItem value="detector_humos">Detector</SelectItem>
                <SelectItem value="alarma_incendios">Alarma</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="operativo">Operativo</SelectItem>
                <SelectItem value="requiere_atencion">Requiere Atención</SelectItem>
                <SelectItem value="defectuoso">Defectuoso</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700">Fecha</th>
                <th className="text-left p-4 font-semibold text-slate-700">Tipo</th>
                <th className="text-left p-4 font-semibold text-slate-700">Código</th>
                <th className="text-left p-4 font-semibold text-slate-700">Ubicación</th>
                <th className="text-left p-4 font-semibold text-slate-700">Estado</th>
                <th className="text-left p-4 font-semibold text-slate-700">Próxima Insp.</th>
                <th className="text-left p-4 font-semibold text-slate-700">Normativa</th>
                <th className="text-left p-4 font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const statusConfig = STATUS_CONFIG[record.status] || STATUS_CONFIG.operativo;
                const StatusIcon = statusConfig.icon;
                
                // Verificar próxima inspección
                let inspectionWarning = null;
                if (record.next_inspection_date) {
                  const daysUntil = Math.floor((new Date(record.next_inspection_date) - new Date()) / (1000 * 60 * 60 * 24));
                  if (daysUntil < 0) {
                    inspectionWarning = <span className="text-red-600 font-semibold">Vencida</span>;
                  } else if (daysUntil <= 7) {
                    inspectionWarning = <span className="text-orange-600 font-semibold">{daysUntil}d</span>;
                  } else if (daysUntil <= 30) {
                    inspectionWarning = <span className="text-yellow-600">{daysUntil}d</span>;
                  } else {
                    inspectionWarning = <span className="text-slate-500">{format(new Date(record.next_inspection_date), 'dd/MM/yyyy')}</span>;
                  }
                }

                return (
                  <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4 text-sm text-slate-600">
                      {format(new Date(record.inspection_date), 'dd/MM/yyyy')}
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-xs">
                        {EQUIPMENT_TYPES_SHORT[record.equipment_type] || record.equipment_type}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium text-slate-800">
                      {record.equipment_code || '-'}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      <div>{record.location}</div>
                      <div className="text-xs text-slate-400">{record.zone}</div>
                    </td>
                    <td className="p-4">
                      <Badge className={statusConfig.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">
                      {inspectionWarning || '-'}
                    </td>
                    <td className="p-4">
                      {record.complies_regulations ? (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Cumple
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700">
                          <XCircle className="w-3 h-3 mr-1" />
                          No Cumple
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(record)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No se encontraron inspecciones
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
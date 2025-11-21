import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  X, 
  Package, 
  Wrench, 
  Calendar,
  AlertTriangle,
  ExternalLink,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import moment from "moment";

const STATUS_CONFIG = {
  operativo: { color: "bg-green-100 text-green-700", icon: Activity, label: "Operativo" },
  mantenimiento: { color: "bg-yellow-100 text-yellow-700", icon: Wrench, label: "En Mantenimiento" },
  averiado: { color: "bg-red-100 text-red-700", icon: AlertTriangle, label: "Averiado" },
  fuera_servicio: { color: "bg-gray-100 text-gray-700", icon: X, label: "Fuera de Servicio" }
};

const CRITICALITY_CONFIG = {
  baja: { color: "bg-blue-100 text-blue-700", label: "Baja" },
  media: { color: "bg-yellow-100 text-yellow-700", label: "Media" },
  alta: { color: "bg-orange-100 text-orange-700", label: "Alta" },
  critica: { color: "bg-red-100 text-red-700", label: "Crítica" }
};

export default function EquipmentInfoPanel({ equipment, tasks, onClose }) {
  if (!equipment) return null;

  const statusConfig = STATUS_CONFIG[equipment.status] || STATUS_CONFIG.operativo;
  const StatusIcon = statusConfig.icon;
  const criticalityConfig = CRITICALITY_CONFIG[equipment.criticality] || CRITICALITY_CONFIG.media;

  // Tareas relacionadas
  const relatedTasks = tasks?.filter(t => t.equipment_id === equipment.id) || [];
  const pendingTasks = relatedTasks.filter(t => t.status === 'pendiente' || t.status === 'en_proceso');
  const nextMaintenance = pendingTasks.sort((a, b) => 
    new Date(a.scheduled_date) - new Date(b.scheduled_date)
  )[0];

  return (
    <Card className="border-0 shadow-2xl bg-white absolute top-4 right-4 w-80 z-50 animate-fade-in">
      <CardHeader className="pb-3 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">{equipment.name}</CardTitle>
            </div>
            <p className="text-xs text-slate-500">{equipment.equipment_code}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        {/* Estado y Criticidad */}
        <div className="flex gap-2">
          <Badge className={`${statusConfig.color} flex items-center gap-1`}>
            <StatusIcon className="w-3 h-3" />
            {statusConfig.label}
          </Badge>
          <Badge className={criticalityConfig.color}>
            {criticalityConfig.label}
          </Badge>
        </div>

        {/* Información básica */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Zona:</span>
            <span className="font-semibold">{equipment.zone?.replace(/_/g, ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Sistema:</span>
            <span className="font-semibold">{equipment.system_type?.toUpperCase()}</span>
          </div>
          {equipment.manufacturer && (
            <div className="flex justify-between">
              <span className="text-slate-500">Fabricante:</span>
              <span className="font-semibold">{equipment.manufacturer}</span>
            </div>
          )}
          {equipment.model && (
            <div className="flex justify-between">
              <span className="text-slate-500">Modelo:</span>
              <span className="font-semibold">{equipment.model}</span>
            </div>
          )}
        </div>

        {/* Mantenimiento */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-semibold">Mantenimiento</span>
          </div>
          {equipment.last_maintenance_date && (
            <div className="text-xs text-slate-600 mb-1">
              Último: {moment(equipment.last_maintenance_date).format('DD/MM/YYYY')}
            </div>
          )}
          {nextMaintenance ? (
            <div className="text-xs">
              <span className="text-slate-500">Próximo:</span>{' '}
              <span className="font-semibold text-orange-600">
                {moment(nextMaintenance.scheduled_date).format('DD/MM/YYYY')}
              </span>
              <div className="text-slate-500 mt-1">{nextMaintenance.title}</div>
            </div>
          ) : (
            <div className="text-xs text-slate-500">No hay mantenimientos programados</div>
          )}
        </div>

        {/* Tareas pendientes */}
        {pendingTasks.length > 0 && (
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-semibold">Tareas Pendientes</span>
              <Badge variant="secondary" className="ml-auto">
                {pendingTasks.length}
              </Badge>
            </div>
            <div className="space-y-1">
              {pendingTasks.slice(0, 3).map(task => (
                <div key={task.id} className="text-xs p-2 bg-slate-50 rounded">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-slate-500">{moment(task.scheduled_date).format('DD/MM/YYYY')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <Link to={createPageUrl("Equipment")} className="block">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <ExternalLink className="w-4 h-4 mr-2" />
              Ver Ficha Completa
            </Button>
          </Link>
          <Link to={createPageUrl("Maintenance")} className="block">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Wrench className="w-4 h-4 mr-2" />
              Ver Mantenimientos
            </Button>
          </Link>
        </div>

        {/* Notas */}
        {equipment.notes && (
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-600">{equipment.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Mail,
  Clock,
  X
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ALERT_TYPE_LABELS = {
  high_energy_consumption: "Consumo Energético Alto",
  high_water_consumption: "Consumo de Agua Alto",
  high_fuel_consumption: "Consumo de Combustible Alto",
  maintenance_due: "Mantenimiento Próximo",
  equipment_failure: "Fallo de Equipo",
  certificate_expiry: "Certificado Caducado",
  pool_chemistry_alert: "Alerta Química Piscina",
  document_expiry: "Documento Caducado"
};

const SEVERITY_CONFIG = {
  info: { label: "Información", icon: Info, className: "bg-blue-100 text-blue-700", badgeClass: "bg-blue-100 text-blue-800" },
  warning: { label: "Advertencia", icon: AlertCircle, className: "bg-yellow-100 text-yellow-700", badgeClass: "bg-yellow-100 text-yellow-800" },
  critical: { label: "Crítica", icon: AlertTriangle, className: "bg-red-100 text-red-700", badgeClass: "bg-red-100 text-red-800" }
};

export default function AlertList({ alerts, onMarkAsRead, onResolve, showResolution = false }) {
  const [resolvingAlert, setResolvingAlert] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");

  const handleResolveClick = (alert) => {
    setResolvingAlert(alert);
    setResolutionNotes("");
  };

  const handleConfirmResolve = () => {
    if (resolvingAlert && onResolve) {
      onResolve(resolvingAlert.id, resolutionNotes);
      setResolvingAlert(null);
      setResolutionNotes("");
    }
  };

  if (alerts.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No hay alertas en esta categoría</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {alerts.map((alert) => {
          const severity = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
          const SeverityIcon = severity.icon;

          return (
            <Card key={alert.id} className={`border-l-4 ${severity.className} border-0 shadow-lg hover:shadow-xl transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${severity.className} flex items-center justify-center flex-shrink-0`}>
                    <SeverityIcon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-800 mb-1">
                          {alert.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className={severity.badgeClass}>
                            {severity.label}
                          </Badge>
                          <Badge variant="outline">
                            {ALERT_TYPE_LABELS[alert.alert_type] || alert.alert_type}
                          </Badge>
                          {alert.zone && (
                            <Badge variant="outline" className="bg-slate-50">
                              {alert.zone}
                            </Badge>
                          )}
                          {alert.email_sent && (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              <Mail className="w-3 h-3 mr-1" />
                              Email enviado
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!alert.is_read && onMarkAsRead && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onMarkAsRead(alert.id)}
                          >
                            Marcar leída
                          </Button>
                        )}
                        {!alert.is_resolved && onResolve && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleResolveClick(alert)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Resolver
                          </Button>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 mb-3">{alert.message}</p>

                    {alert.related_entity_name && (
                      <p className="text-sm text-slate-500 mb-2">
                        <strong>Relacionado:</strong> {alert.related_entity_name}
                      </p>
                    )}

                    {(alert.current_value !== undefined || alert.threshold_value !== undefined) && (
                      <div className="flex gap-4 text-sm mb-3">
                        {alert.current_value !== undefined && (
                          <span className="text-slate-600">
                            <strong>Valor actual:</strong> {alert.current_value}
                          </span>
                        )}
                        {alert.threshold_value !== undefined && (
                          <span className="text-slate-600">
                            <strong>Umbral:</strong> {alert.threshold_value}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {format(new Date(alert.created_date), "dd MMM yyyy HH:mm", { locale: es })}
                      </div>
                      {alert.created_by && (
                        <span>Por: {alert.created_by}</span>
                      )}
                    </div>

                    {showResolution && alert.is_resolved && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-800">Resuelta</span>
                        </div>
                        {alert.resolved_date && (
                          <p className="text-sm text-green-700 mb-1">
                            {format(new Date(alert.resolved_date), "dd MMM yyyy HH:mm", { locale: es })}
                            {alert.resolved_by && ` por ${alert.resolved_by}`}
                          </p>
                        )}
                        {alert.resolution_notes && (
                          <p className="text-sm text-green-700">{alert.resolution_notes}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!resolvingAlert} onOpenChange={() => setResolvingAlert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolver Alerta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-slate-600">
              ¿Estás seguro de que quieres marcar esta alerta como resuelta?
            </p>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Notas de resolución (opcional)
              </label>
              <Textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Describe cómo se resolvió la alerta..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolvingAlert(null)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmResolve} className="bg-green-600 hover:bg-green-700">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
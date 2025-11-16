import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ALERT_TYPES = [
  { value: "high_energy_consumption", label: "Consumo Energético Alto", hasThreshold: true },
  { value: "high_water_consumption", label: "Consumo de Agua Alto", hasThreshold: true },
  { value: "high_fuel_consumption", label: "Consumo de Combustible Alto", hasThreshold: true },
  { value: "maintenance_due", label: "Mantenimiento Próximo", hasDays: true },
  { value: "equipment_failure", label: "Fallo de Equipo", hasThreshold: false },
  { value: "certificate_expiry", label: "Certificado Caducado", hasDays: true },
  { value: "pool_chemistry_alert", label: "Alerta Química Piscina", hasThreshold: false },
  { value: "document_expiry", label: "Documento Caducado", hasDays: true }
];

export default function AlertSettings({ configs, userEmail }) {
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.AlertConfig.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertConfigs'] });
      setShowNewForm(false);
      setEditingConfig(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AlertConfig.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertConfigs'] });
      setEditingConfig(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AlertConfig.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertConfigs'] });
    },
  });

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Configuración de Alertas Personalizadas</CardTitle>
            <Button
              onClick={() => setShowNewForm(!showNewForm)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Alerta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {showNewForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <AlertConfigForm
                  userEmail={userEmail}
                  onSubmit={(data) => createMutation.mutate(data)}
                  onCancel={() => setShowNewForm(false)}
                  isLoading={createMutation.isPending}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {configs.length === 0 && !showNewForm ? (
              <div className="text-center py-8 text-slate-500">
                No tienes alertas configuradas. Crea una nueva para comenzar.
              </div>
            ) : (
              configs.map((config) => (
                <AlertConfigCard
                  key={config.id}
                  config={config}
                  isEditing={editingConfig?.id === config.id}
                  onEdit={() => setEditingConfig(config)}
                  onSave={(data) => updateMutation.mutate({ id: config.id, data })}
                  onCancel={() => setEditingConfig(null)}
                  onDelete={() => deleteMutation.mutate(config.id)}
                  isLoading={updateMutation.isPending}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AlertConfigForm({ config, userEmail, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(config || {
    user_email: userEmail,
    alert_type: "",
    enabled: true,
    threshold_value: null,
    days_before_warning: 7,
    send_email: false,
    email_recipients: [],
    frequency: "instant",
    zone_filter: ""
  });

  const selectedType = ALERT_TYPES.find(t => t.value === formData.alert_type);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Tipo de Alerta *</Label>
          <Select
            value={formData.alert_type}
            onValueChange={(value) => setFormData({ ...formData, alert_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tipo..." />
            </SelectTrigger>
            <SelectContent>
              {ALERT_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedType?.hasThreshold && (
          <div>
            <Label>Valor Umbral</Label>
            <Input
              type="number"
              value={formData.threshold_value || ""}
              onChange={(e) => setFormData({ ...formData, threshold_value: parseFloat(e.target.value) })}
              placeholder="Ej: 1000"
            />
          </div>
        )}

        {selectedType?.hasDays && (
          <div>
            <Label>Días de Antelación</Label>
            <Input
              type="number"
              value={formData.days_before_warning || ""}
              onChange={(e) => setFormData({ ...formData, days_before_warning: parseInt(e.target.value) })}
              placeholder="Ej: 7"
            />
          </div>
        )}

        <div>
          <Label>Frecuencia de Notificación</Label>
          <Select
            value={formData.frequency}
            onValueChange={(value) => setFormData({ ...formData, frequency: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instantánea</SelectItem>
              <SelectItem value="daily">Diaria</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Filtrar por Zona (opcional)</Label>
          <Input
            value={formData.zone_filter || ""}
            onChange={(e) => setFormData({ ...formData, zone_filter: e.target.value })}
            placeholder="Ej: cocina"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.enabled}
            onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
          />
          <Label>Activada</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={formData.send_email}
            onCheckedChange={(checked) => setFormData({ ...formData, send_email: checked })}
          />
          <Label>Enviar Email</Label>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isLoading || !formData.alert_type}>
          <Save className="w-4 h-4 mr-2" />
          Guardar
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function AlertConfigCard({ config, isEditing, onEdit, onSave, onCancel, onDelete, isLoading }) {
  const alertType = ALERT_TYPES.find(t => t.value === config.alert_type);

  if (isEditing) {
    return (
      <AlertConfigForm
        config={config}
        userEmail={config.user_email}
        onSubmit={onSave}
        onCancel={onCancel}
        isLoading={isLoading}
      />
    );
  }

  return (
    <Card className="border-2">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-bold text-slate-800">{alertType?.label}</h4>
              {config.enabled ? (
                <Badge className="bg-green-100 text-green-700">Activa</Badge>
              ) : (
                <Badge variant="outline" className="bg-slate-100">Inactiva</Badge>
              )}
              {config.send_email && (
                <Badge className="bg-blue-100 text-blue-700">Email</Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
              {config.threshold_value && (
                <span><strong>Umbral:</strong> {config.threshold_value}</span>
              )}
              {config.days_before_warning && (
                <span><strong>Antelación:</strong> {config.days_before_warning} días</span>
              )}
              <span><strong>Frecuencia:</strong> {config.frequency === 'instant' ? 'Instantánea' : config.frequency === 'daily' ? 'Diaria' : 'Semanal'}</span>
              {config.zone_filter && (
                <span><strong>Zona:</strong> {config.zone_filter}</span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              Editar
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
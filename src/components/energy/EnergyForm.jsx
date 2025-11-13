import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Save, X } from "lucide-react";

const METER_LOCATIONS = [
  { value: "general", label: "General" },
  { value: "cocina", label: "Cocina" },
  { value: "habitaciones", label: "Habitaciones" },
  { value: "spa", label: "Spa" },
  { value: "piscina", label: "Piscina" },
  { value: "exterior", label: "Exterior" },
  { value: "otro", label: "Otro" }
];

export default function EnergyForm({ reading, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    reading_date: '',
    meter_location: 'general',
    consumption_kwh: '',
    solar_production_kwh: '',
    cost_estimate: '',
    notes: ''
  });

  useEffect(() => {
    if (reading) {
      setFormData({
        reading_date: reading.reading_date?.split('T')[0] || '',
        meter_location: reading.meter_location || 'general',
        consumption_kwh: reading.consumption_kwh || '',
        solar_production_kwh: reading.solar_production_kwh || '',
        cost_estimate: reading.cost_estimate || '',
        notes: reading.notes || ''
      });
    } else {
      const now = new Date();
      setFormData(prev => ({
        ...prev,
        reading_date: now.toISOString().split('T')[0]
      }));
    }
  }, [reading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const consumption = parseFloat(formData.consumption_kwh) || 0;
    const production = parseFloat(formData.solar_production_kwh) || 0;
    const netConsumption = consumption - production;
    
    onSubmit({
      ...formData,
      consumption_kwh: consumption,
      solar_production_kwh: production,
      net_consumption_kwh: netConsumption,
      cost_estimate: parseFloat(formData.cost_estimate) || 0,
      reading_date: new Date(formData.reading_date).toISOString()
    });
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <Zap className="w-6 h-6 text-orange-500" />
          {reading ? 'Editar Lectura' : 'Nueva Lectura de Energía'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="reading_date" className="font-semibold">Fecha y Hora *</Label>
              <Input
                id="reading_date"
                type="date"
                value={formData.reading_date}
                onChange={(e) => setFormData({ ...formData, reading_date: e.target.value })}
                required
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meter_location" className="font-semibold">Ubicación del Contador *</Label>
              <Select
                value={formData.meter_location}
                onValueChange={(value) => setFormData({ ...formData, meter_location: value })}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METER_LOCATIONS.map(location => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="consumption_kwh" className="font-semibold">Consumo (kWh) *</Label>
              <Input
                id="consumption_kwh"
                type="number"
                step="0.01"
                value={formData.consumption_kwh}
                onChange={(e) => setFormData({ ...formData, consumption_kwh: e.target.value })}
                required
                placeholder="0.00"
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solar_production_kwh" className="font-semibold">Producción Solar (kWh)</Label>
              <Input
                id="solar_production_kwh"
                type="number"
                step="0.01"
                value={formData.solar_production_kwh}
                onChange={(e) => setFormData({ ...formData, solar_production_kwh: e.target.value })}
                placeholder="0.00"
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost_estimate" className="font-semibold">Coste Estimado (€)</Label>
              <Input
                id="cost_estimate"
                type="number"
                step="0.01"
                value={formData.cost_estimate}
                onChange={(e) => setFormData({ ...formData, cost_estimate: e.target.value })}
                placeholder="0.00"
                className="border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="font-semibold">Notas y Comentarios</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observaciones adicionales..."
              className="h-24 border-slate-200"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Guardando...' : reading ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
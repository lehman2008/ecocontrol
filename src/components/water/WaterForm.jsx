import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplets, Save, X } from "lucide-react";

const METER_LOCATIONS = [
  { value: "general", label: "General" },
  { value: "cocina", label: "Cocina" },
  { value: "habitaciones", label: "Habitaciones" },
  { value: "piscina", label: "Piscina" },
  { value: "jardines", label: "Jardines" },
  { value: "spa", label: "Spa" },
  { value: "otro", label: "Otro" }
];

export default function WaterForm({ reading, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    reading_date: '',
    meter_location: 'general',
    water_type: 'fria',
    consumption_m3: '',
    boiler_temperature: '',
    boiler_pressure: '',
    cost_estimate: '',
    notes: ''
  });

  useEffect(() => {
    if (reading) {
      setFormData({
        reading_date: reading.reading_date?.split('T')[0] || '',
        meter_location: reading.meter_location || 'general',
        water_type: reading.water_type || 'fria',
        consumption_m3: reading.consumption_m3 || '',
        boiler_temperature: reading.boiler_temperature || '',
        boiler_pressure: reading.boiler_pressure || '',
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
    onSubmit({
      ...formData,
      consumption_m3: parseFloat(formData.consumption_m3) || 0,
      boiler_temperature: formData.boiler_temperature ? parseFloat(formData.boiler_temperature) : undefined,
      boiler_pressure: formData.boiler_pressure ? parseFloat(formData.boiler_pressure) : undefined,
      cost_estimate: parseFloat(formData.cost_estimate) || 0,
      reading_date: new Date(formData.reading_date).toISOString()
    });
  };

  const isACS = formData.water_type === 'acs';

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <Droplets className="w-6 h-6 text-blue-500" />
          {reading ? 'Editar Lectura' : 'Nueva Lectura de Agua'}
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
              <Label htmlFor="water_type" className="font-semibold">Tipo de Agua *</Label>
              <Select
                value={formData.water_type}
                onValueChange={(value) => setFormData({ ...formData, water_type: value })}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fria">Agua Fría</SelectItem>
                  <SelectItem value="acs">ACS (Agua Caliente Sanitaria)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="consumption_m3" className="font-semibold">Consumo (m³) *</Label>
              <Input
                id="consumption_m3"
                type="number"
                step="0.01"
                value={formData.consumption_m3}
                onChange={(e) => setFormData({ ...formData, consumption_m3: e.target.value })}
                required
                placeholder="0.00"
                className="border-slate-200"
              />
            </div>

            {isACS && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="boiler_temperature" className="font-semibold">Temperatura Caldera (°C)</Label>
                  <Input
                    id="boiler_temperature"
                    type="number"
                    step="0.1"
                    value={formData.boiler_temperature}
                    onChange={(e) => setFormData({ ...formData, boiler_temperature: e.target.value })}
                    placeholder="0.0"
                    className="border-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="boiler_pressure" className="font-semibold">Presión Caldera (bar)</Label>
                  <Input
                    id="boiler_pressure"
                    type="number"
                    step="0.1"
                    value={formData.boiler_pressure}
                    onChange={(e) => setFormData({ ...formData, boiler_pressure: e.target.value })}
                    placeholder="0.0"
                    className="border-slate-200"
                  />
                </div>
              </>
            )}

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
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white"
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
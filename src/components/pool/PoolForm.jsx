import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Waves, Save, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const POOL_NAMES = [
  { value: "piscina_principal", label: "Piscina Principal" },
  { value: "piscina_infantil", label: "Piscina Infantil" },
  { value: "spa_jacuzzi", label: "Spa / Jacuzzi" },
  { value: "piscina_cubierta", label: "Piscina Cubierta" }
];

const TURBIDITY_LEVELS = [
  { value: "cristalina", label: "Cristalina" },
  { value: "ligeramente_turbia", label: "Ligeramente Turbia" },
  { value: "turbia", label: "Turbia" },
  { value: "muy_turbia", label: "Muy Turbia" }
];

export default function PoolForm({ measurement, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    measurement_date: '',
    pool_name: 'piscina_principal',
    ph_level: '',
    free_chlorine: '',
    combined_chlorine: '',
    total_chlorine: '',
    alkalinity: '',
    water_temperature: '',
    turbidity: 'cristalina',
    bromine: '',
    calcium_hardness: '',
    cyanuric_acid: '',
    actions_taken: '',
    notes: ''
  });

  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    if (measurement) {
      setFormData({
        measurement_date: measurement.measurement_date?.split('T')[0] || '',
        pool_name: measurement.pool_name || 'piscina_principal',
        ph_level: measurement.ph_level || '',
        free_chlorine: measurement.free_chlorine || '',
        combined_chlorine: measurement.combined_chlorine || '',
        total_chlorine: measurement.total_chlorine || '',
        alkalinity: measurement.alkalinity || '',
        water_temperature: measurement.water_temperature || '',
        turbidity: measurement.turbidity || 'cristalina',
        bromine: measurement.bromine || '',
        calcium_hardness: measurement.calcium_hardness || '',
        cyanuric_acid: measurement.cyanuric_acid || '',
        actions_taken: measurement.actions_taken || '',
        notes: measurement.notes || ''
      });
    } else {
      const now = new Date();
      setFormData(prev => ({
        ...prev,
        measurement_date: now.toISOString().split('T')[0]
      }));
    }
  }, [measurement]);

  useEffect(() => {
    // Check for warnings based on ideal ranges
    const newWarnings = [];
    const ph = parseFloat(formData.ph_level);
    const chlorine = parseFloat(formData.free_chlorine);
    const alkalinity = parseFloat(formData.alkalinity);
    const combinedChlorine = parseFloat(formData.combined_chlorine);

    if (ph && (ph < 7.2 || ph > 7.6)) {
      newWarnings.push(`pH fuera del rango ideal (7.2-7.6): ${ph}`);
    }
    if (chlorine && (chlorine < 0.5 || chlorine > 2.0)) {
      newWarnings.push(`Cloro libre fuera del rango ideal (0.5-2.0 mg/L): ${chlorine}`);
    }
    if (alkalinity && (alkalinity < 80 || alkalinity > 120)) {
      newWarnings.push(`Alcalinidad fuera del rango ideal (80-120 mg/L): ${alkalinity}`);
    }
    if (combinedChlorine && combinedChlorine > 0.6) {
      newWarnings.push(`Cloro combinado supera el máximo (0.6 mg/L): ${combinedChlorine}`);
    }

    setWarnings(newWarnings);
  }, [formData.ph_level, formData.free_chlorine, formData.alkalinity, formData.combined_chlorine]);

  const determineStatus = () => {
    if (warnings.length === 0) return 'optimo';
    if (warnings.length === 1) return 'aceptable';
    if (warnings.length === 2) return 'requiere_atencion';
    return 'critico';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanData = {
      ...formData,
      ph_level: parseFloat(formData.ph_level) || 0,
      free_chlorine: parseFloat(formData.free_chlorine) || 0,
      water_temperature: parseFloat(formData.water_temperature) || 0,
      combined_chlorine: formData.combined_chlorine ? parseFloat(formData.combined_chlorine) : undefined,
      total_chlorine: formData.total_chlorine ? parseFloat(formData.total_chlorine) : undefined,
      alkalinity: formData.alkalinity ? parseFloat(formData.alkalinity) : undefined,
      bromine: formData.bromine ? parseFloat(formData.bromine) : undefined,
      calcium_hardness: formData.calcium_hardness ? parseFloat(formData.calcium_hardness) : undefined,
      cyanuric_acid: formData.cyanuric_acid ? parseFloat(formData.cyanuric_acid) : undefined,
      status: determineStatus(),
      measurement_date: new Date(formData.measurement_date).toISOString()
    };

    onSubmit(cleanData);
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <Waves className="w-6 h-6 text-cyan-500" />
          {measurement ? 'Editar Medición' : 'Nueva Medición de Piscina'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {warnings.length > 0 && (
          <Alert className="mb-6 bg-orange-50 border-orange-200">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <p className="font-semibold mb-1">Valores fuera del rango ideal:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="measurement_date" className="font-semibold">Fecha y Hora *</Label>
              <Input
                id="measurement_date"
                type="date"
                value={formData.measurement_date}
                onChange={(e) => setFormData({ ...formData, measurement_date: e.target.value })}
                required
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pool_name" className="font-semibold">Piscina *</Label>
              <Select
                value={formData.pool_name}
                onValueChange={(value) => setFormData({ ...formData, pool_name: value })}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POOL_NAMES.map(pool => (
                    <SelectItem key={pool.value} value={pool.value}>
                      {pool.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Primary Measurements */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Parámetros Principales</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ph_level" className="font-semibold">pH * (ideal: 7.2-7.6)</Label>
                <Input
                  id="ph_level"
                  type="number"
                  step="0.1"
                  value={formData.ph_level}
                  onChange={(e) => setFormData({ ...formData, ph_level: e.target.value })}
                  required
                  placeholder="7.4"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="free_chlorine" className="font-semibold">Cloro Libre * (mg/L) (ideal: 0.5-2.0)</Label>
                <Input
                  id="free_chlorine"
                  type="number"
                  step="0.01"
                  value={formData.free_chlorine}
                  onChange={(e) => setFormData({ ...formData, free_chlorine: e.target.value })}
                  required
                  placeholder="1.0"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="water_temperature" className="font-semibold">Temperatura * (°C)</Label>
                <Input
                  id="water_temperature"
                  type="number"
                  step="0.1"
                  value={formData.water_temperature}
                  onChange={(e) => setFormData({ ...formData, water_temperature: e.target.value })}
                  required
                  placeholder="26.0"
                  className="border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Secondary Measurements */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Parámetros Secundarios</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="combined_chlorine" className="font-semibold">Cloro Combinado (mg/L) (máx: 0.6)</Label>
                <Input
                  id="combined_chlorine"
                  type="number"
                  step="0.01"
                  value={formData.combined_chlorine}
                  onChange={(e) => setFormData({ ...formData, combined_chlorine: e.target.value })}
                  placeholder="0.2"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_chlorine" className="font-semibold">Cloro Total (mg/L)</Label>
                <Input
                  id="total_chlorine"
                  type="number"
                  step="0.01"
                  value={formData.total_chlorine}
                  onChange={(e) => setFormData({ ...formData, total_chlorine: e.target.value })}
                  placeholder="1.2"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alkalinity" className="font-semibold">Alcalinidad (mg/L) (ideal: 80-120)</Label>
                <Input
                  id="alkalinity"
                  type="number"
                  step="1"
                  value={formData.alkalinity}
                  onChange={(e) => setFormData({ ...formData, alkalinity: e.target.value })}
                  placeholder="100"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="turbidity" className="font-semibold">Turbidez</Label>
                <Select
                  value={formData.turbidity}
                  onValueChange={(value) => setFormData({ ...formData, turbidity: value })}
                >
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TURBIDITY_LEVELS.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bromine" className="font-semibold">Bromo (mg/L)</Label>
                <Input
                  id="bromine"
                  type="number"
                  step="0.01"
                  value={formData.bromine}
                  onChange={(e) => setFormData({ ...formData, bromine: e.target.value })}
                  placeholder="0.0"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calcium_hardness" className="font-semibold">Dureza Cálcica (mg/L)</Label>
                <Input
                  id="calcium_hardness"
                  type="number"
                  step="1"
                  value={formData.calcium_hardness}
                  onChange={(e) => setFormData({ ...formData, calcium_hardness: e.target.value })}
                  placeholder="200"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cyanuric_acid" className="font-semibold">Ácido Cianúrico (mg/L)</Label>
                <Input
                  id="cyanuric_acid"
                  type="number"
                  step="1"
                  value={formData.cyanuric_acid}
                  onChange={(e) => setFormData({ ...formData, cyanuric_acid: e.target.value })}
                  placeholder="30"
                  className="border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Actions and Notes */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="actions_taken" className="font-semibold">Acciones Correctivas Realizadas</Label>
              <Textarea
                id="actions_taken"
                value={formData.actions_taken}
                onChange={(e) => setFormData({ ...formData, actions_taken: e.target.value })}
                placeholder="Ej: Añadido cloro líquido, ajustado pH..."
                className="h-20 border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="font-semibold">Observaciones Adicionales</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Cualquier observación relevante..."
                className="h-20 border-slate-200"
              />
            </div>
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
              className="bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-500 hover:to-teal-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Guardando...' : measurement ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
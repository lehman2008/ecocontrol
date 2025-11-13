import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flame, Save, X } from "lucide-react";

const FUEL_TYPES = [
  { value: "gas_natural", label: "Gas Natural", defaultUnit: "m3", co2Factor: 0.202 },
  { value: "propano", label: "Propano", defaultUnit: "kg", co2Factor: 2.98 },
  { value: "butano", label: "Butano", defaultUnit: "kg", co2Factor: 3.03 },
  { value: "gasoleo", label: "Gasóleo", defaultUnit: "litros", co2Factor: 2.68 },
  { value: "biomasa_pellets", label: "Biomasa/Pellets", defaultUnit: "kg", co2Factor: 0.018 }
];

const LOCATIONS = [
  { value: "cocina", label: "Cocina" },
  { value: "calderas", label: "Calderas" },
  { value: "lavanderia", label: "Lavandería" },
  { value: "general", label: "General" },
  { value: "otro", label: "Otro" }
];

// Factores de conversión aproximados a kWh
const KWH_CONVERSION = {
  gas_natural: 10.7, // kWh por m³
  propano: 12.87, // kWh por kg
  butano: 12.69, // kWh por kg
  gasoleo: 10.0, // kWh por litro
  biomasa_pellets: 4.8 // kWh por kg
};

export default function FuelForm({ reading, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    reading_date: '',
    fuel_type: 'gas_natural',
    meter_location: 'calderas',
    quantity: '',
    unit: 'm3',
    cost: '',
    notes: ''
  });

  const [calculatedValues, setCalculatedValues] = useState({
    kwh_equivalent: 0,
    co2_emissions_kg: 0
  });

  useEffect(() => {
    if (reading) {
      setFormData({
        reading_date: reading.reading_date?.split('T')[0] || '',
        fuel_type: reading.fuel_type || 'gas_natural',
        meter_location: reading.meter_location || 'calderas',
        quantity: reading.quantity || '',
        unit: reading.unit || 'm3',
        cost: reading.cost || '',
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

  // Calcular kWh y CO2 automáticamente
  useEffect(() => {
    const quantity = parseFloat(formData.quantity) || 0;
    const fuelConfig = FUEL_TYPES.find(f => f.value === formData.fuel_type);
    
    if (quantity > 0 && fuelConfig) {
      const kwh = quantity * (KWH_CONVERSION[formData.fuel_type] || 0);
      const co2 = quantity * fuelConfig.co2Factor;
      
      setCalculatedValues({
        kwh_equivalent: kwh,
        co2_emissions_kg: co2
      });
    } else {
      setCalculatedValues({
        kwh_equivalent: 0,
        co2_emissions_kg: 0
      });
    }
  }, [formData.quantity, formData.fuel_type]);

  const handleFuelTypeChange = (value) => {
    const fuelConfig = FUEL_TYPES.find(f => f.value === value);
    setFormData({
      ...formData,
      fuel_type: value,
      unit: fuelConfig?.defaultUnit || 'm3'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      quantity: parseFloat(formData.quantity) || 0,
      cost: parseFloat(formData.cost) || 0,
      kwh_equivalent: calculatedValues.kwh_equivalent,
      co2_emissions_kg: calculatedValues.co2_emissions_kg,
      reading_date: new Date(formData.reading_date).toISOString()
    });
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <Flame className="w-6 h-6 text-orange-500" />
          {reading ? 'Editar Lectura' : 'Nueva Lectura de Combustible'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="reading_date" className="font-semibold">Fecha de Lectura *</Label>
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
              <Label htmlFor="fuel_type" className="font-semibold">Tipo de Combustible *</Label>
              <Select
                value={formData.fuel_type}
                onValueChange={handleFuelTypeChange}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPES.map(fuel => (
                    <SelectItem key={fuel.value} value={fuel.value}>
                      {fuel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meter_location" className="font-semibold">Ubicación *</Label>
              <Select
                value={formData.meter_location}
                onValueChange={(value) => setFormData({ ...formData, meter_location: value })}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map(loc => (
                    <SelectItem key={loc.value} value={loc.value}>
                      {loc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="font-semibold">Cantidad * ({formData.unit})</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                placeholder="0.00"
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost" className="font-semibold">Coste (€)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="0.00"
                className="border-slate-200"
              />
            </div>
          </div>

          {/* Valores Calculados */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-3">Valores Calculados Automáticamente</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-700 font-medium">Equivalente Energético</p>
                <p className="text-2xl font-bold text-blue-900">
                  {calculatedValues.kwh_equivalent.toFixed(2)} kWh
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Emisiones CO₂</p>
                <p className="text-2xl font-bold text-blue-900">
                  {calculatedValues.co2_emissions_kg.toFixed(2)} kg
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="font-semibold">Notas y Observaciones</Label>
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
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
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
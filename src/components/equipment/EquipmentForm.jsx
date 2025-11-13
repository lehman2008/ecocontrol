import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Save, X, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";

const ZONES = [
  { value: "cocina", label: "Cocina" },
  { value: "lavanderia", label: "Lavandería" },
  { value: "habitaciones", label: "Habitaciones" },
  { value: "zonas_comunes", label: "Zonas Comunes" },
  { value: "spa_wellness", label: "Spa/Wellness" },
  { value: "cuarto_calderas", label: "Cuarto de Calderas" },
  { value: "cuarto_electrico", label: "Cuarto Eléctrico" },
  { value: "piscina", label: "Piscina" },
  { value: "parking", label: "Parking" },
  { value: "ascensores", label: "Ascensores" },
  { value: "tejado_azotea", label: "Tejado/Azotea" },
  { value: "sotano", label: "Sótano" },
  { value: "recepcion", label: "Recepción" },
  { value: "otro", label: "Otro" }
];

const SYSTEMS = [
  { value: "hvac", label: "HVAC" },
  { value: "fontaneria", label: "Fontanería" },
  { value: "electricidad", label: "Electricidad" },
  { value: "contraincendios", label: "Contraincendios" },
  { value: "gas", label: "Gas" },
  { value: "climatizacion", label: "Climatización" },
  { value: "refrigeracion", label: "Refrigeración" },
  { value: "elevacion", label: "Elevación" },
  { value: "telecomunicaciones", label: "Telecomunicaciones" },
  { value: "seguridad", label: "Seguridad" },
  { value: "otro", label: "Otro" }
];

const FREQUENCIES = [
  { value: "diaria", label: "Diaria" },
  { value: "semanal", label: "Semanal" },
  { value: "quincenal", label: "Quincenal" },
  { value: "mensual", label: "Mensual" },
  { value: "trimestral", label: "Trimestral" },
  { value: "semestral", label: "Semestral" },
  { value: "anual", label: "Anual" }
];

export default function EquipmentForm({ equipment, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    equipment_code: '',
    name: '',
    zone: 'cocina',
    system_type: 'hvac',
    manufacturer: '',
    model: '',
    serial_number: '',
    installation_date: '',
    expected_lifespan_years: '',
    power_capacity: '',
    location_details: '',
    maintenance_provider: '',
    maintenance_frequency: 'mensual',
    criticality: 'media',
    status: 'operativo',
    warranty_expiry: '',
    operating_hours: '',
    notes: ''
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (equipment) {
      setFormData({
        equipment_code: equipment.equipment_code || '',
        name: equipment.name || '',
        zone: equipment.zone || 'cocina',
        system_type: equipment.system_type || 'hvac',
        manufacturer: equipment.manufacturer || '',
        model: equipment.model || '',
        serial_number: equipment.serial_number || '',
        installation_date: equipment.installation_date || '',
        expected_lifespan_years: equipment.expected_lifespan_years || '',
        power_capacity: equipment.power_capacity || '',
        location_details: equipment.location_details || '',
        maintenance_provider: equipment.maintenance_provider || '',
        maintenance_frequency: equipment.maintenance_frequency || 'mensual',
        criticality: equipment.criticality || 'media',
        status: equipment.status || 'operativo',
        photo_url: equipment.photo_url || '',
        warranty_expiry: equipment.warranty_expiry || '',
        operating_hours: equipment.operating_hours || '',
        notes: equipment.notes || ''
      });
    }
  }, [equipment]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, photo_url: file_url }));
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
    setUploadingPhoto(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanData = {
      ...formData,
      expected_lifespan_years: formData.expected_lifespan_years ? parseInt(formData.expected_lifespan_years) : undefined,
      operating_hours: formData.operating_hours ? parseInt(formData.operating_hours) : undefined
    };
    onSubmit(cleanData);
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <Package className="w-6 h-6 text-purple-500" />
          {equipment ? 'Editar Equipo' : 'Nuevo Equipo'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Información Básica</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="equipment_code" className="font-semibold">Código del Equipo</Label>
                <Input
                  id="equipment_code"
                  value={formData.equipment_code}
                  onChange={(e) => setFormData({ ...formData, equipment_code: e.target.value })}
                  placeholder="EQ-001"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold">Nombre del Equipo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ej: Caldera Principal"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zone" className="font-semibold">Zona *</Label>
                <Select
                  value={formData.zone}
                  onValueChange={(value) => setFormData({ ...formData, zone: value })}
                >
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ZONES.map(zone => (
                      <SelectItem key={zone.value} value={zone.value}>
                        {zone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="system_type" className="font-semibold">Tipo de Sistema *</Label>
                <Select
                  value={formData.system_type}
                  onValueChange={(value) => setFormData({ ...formData, system_type: value })}
                >
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SYSTEMS.map(system => (
                      <SelectItem key={system.value} value={system.value}>
                        {system.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="criticality" className="font-semibold">Criticidad</Label>
                <Select
                  value={formData.criticality}
                  onValueChange={(value) => setFormData({ ...formData, criticality: value })}
                >
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="critica">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="font-semibold">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operativo">Operativo</SelectItem>
                    <SelectItem value="mantenimiento">En Mantenimiento</SelectItem>
                    <SelectItem value="averiado">Averiado</SelectItem>
                    <SelectItem value="fuera_servicio">Fuera de Servicio</SelectItem>
                    <SelectItem value="retirado">Retirado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Detalles Técnicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Detalles Técnicos</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="manufacturer" className="font-semibold">Fabricante</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="Ej: Junkers"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model" className="font-semibold">Modelo</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Ej: Cerapur ZWBE 25-3C"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serial_number" className="font-semibold">Número de Serie</Label>
                <Input
                  id="serial_number"
                  value={formData.serial_number}
                  onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                  placeholder="SN-123456789"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="power_capacity" className="font-semibold">Potencia/Capacidad</Label>
                <Input
                  id="power_capacity"
                  value={formData.power_capacity}
                  onChange={(e) => setFormData({ ...formData, power_capacity: e.target.value })}
                  placeholder="Ej: 25 kW"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="installation_date" className="font-semibold">Fecha de Instalación</Label>
                <Input
                  id="installation_date"
                  type="date"
                  value={formData.installation_date}
                  onChange={(e) => setFormData({ ...formData, installation_date: e.target.value })}
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_lifespan_years" className="font-semibold">Vida Útil (años)</Label>
                <Input
                  id="expected_lifespan_years"
                  type="number"
                  value={formData.expected_lifespan_years}
                  onChange={(e) => setFormData({ ...formData, expected_lifespan_years: e.target.value })}
                  placeholder="15"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warranty_expiry" className="font-semibold">Fin de Garantía</Label>
                <Input
                  id="warranty_expiry"
                  type="date"
                  value={formData.warranty_expiry}
                  onChange={(e) => setFormData({ ...formData, warranty_expiry: e.target.value })}
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operating_hours" className="font-semibold">Horas de Funcionamiento</Label>
                <Input
                  id="operating_hours"
                  type="number"
                  value={formData.operating_hours}
                  onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
                  placeholder="0"
                  className="border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Mantenimiento */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Mantenimiento</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maintenance_frequency" className="font-semibold">Frecuencia de Mantenimiento</Label>
                <Select
                  value={formData.maintenance_frequency}
                  onValueChange={(value) => setFormData({ ...formData, maintenance_frequency: value })}
                >
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map(freq => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenance_provider" className="font-semibold">Proveedor de Mantenimiento</Label>
                <Input
                  id="maintenance_provider"
                  value={formData.maintenance_provider}
                  onChange={(e) => setFormData({ ...formData, maintenance_provider: e.target.value })}
                  placeholder="Empresa o técnico"
                  className="border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Ubicación y Foto */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Ubicación y Documentación</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location_details" className="font-semibold">Ubicación Exacta</Label>
                <Textarea
                  id="location_details"
                  value={formData.location_details}
                  onChange={(e) => setFormData({ ...formData, location_details: e.target.value })}
                  placeholder="Descripción detallada de dónde se encuentra el equipo"
                  className="h-20 border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Foto del Equipo</Label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {uploadingPhoto ? 'Subiendo...' : 'Subir Foto'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploadingPhoto}
                    />
                  </label>
                  {formData.photo_url && (
                    <img 
                      src={formData.photo_url} 
                      alt="Equipo" 
                      className="h-16 w-16 object-cover rounded-lg border-2 border-slate-200"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="font-semibold">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Cualquier información relevante..."
                  className="h-24 border-slate-200"
                />
              </div>
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
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Guardando...' : equipment ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
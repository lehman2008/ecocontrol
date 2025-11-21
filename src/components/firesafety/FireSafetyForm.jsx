import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Save, X } from "lucide-react";

const EQUIPMENT_TYPES = {
  extintor: "Extintor",
  bie: "BIE (Boca de Incendio Equipada)",
  detector_humos: "Detector de Humos",
  alarma_incendios: "Alarma de Incendios",
  rociador: "Rociador Automático",
  puerta_cortafuegos: "Puerta Cortafuegos",
  señalizacion: "Señalización de Emergencia",
  iluminacion_emergencia: "Iluminación de Emergencia",
  pulsador_alarma: "Pulsador de Alarma",
  central_deteccion: "Central de Detección",
  sistema_extincion_cocina: "Sistema de Extinción en Cocina",
  otro: "Otro"
};

export default function FireSafetyForm({ record, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    inspection_date: '',
    equipment_type: 'extintor',
    equipment_code: '',
    location: '',
    zone: 'zonas_comunes',
    status: 'operativo',
    last_recharge_date: '',
    next_inspection_date: '',
    expiry_date: '',
    pressure_ok: true,
    seal_intact: true,
    signage_visible: true,
    accessibility_ok: true,
    visual_condition: 'bueno',
    functional_test_ok: true,
    defects_found: '',
    corrective_actions: '',
    inspector_name: '',
    company: '',
    certificate_url: '',
    complies_regulations: true,
    regulation_reference: 'RD 513/2017',
    notes: ''
  });

  useEffect(() => {
    if (record) {
      setFormData({ ...formData, ...record });
    }
  }, [record]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Limpiar campos vacíos
    const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    );
    
    onSubmit(cleanedData);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-0 shadow-xl bg-white">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="text-xl">
          {record ? 'Editar Inspección' : 'Nueva Inspección de Contra Incendios'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Datos Básicos</TabsTrigger>
              <TabsTrigger value="inspection">Inspección</TabsTrigger>
              <TabsTrigger value="compliance">Normativa</TabsTrigger>
            </TabsList>

            {/* Datos Básicos */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Fecha de Inspección *</Label>
                  <Input
                    type="date"
                    value={formData.inspection_date}
                    onChange={(e) => updateField('inspection_date', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label>Tipo de Equipo *</Label>
                  <Select value={formData.equipment_type} onValueChange={(v) => updateField('equipment_type', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EQUIPMENT_TYPES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Código de Equipo</Label>
                  <Input
                    value={formData.equipment_code}
                    onChange={(e) => updateField('equipment_code', e.target.value)}
                    placeholder="Ej: EXT-001"
                  />
                </div>

                <div>
                  <Label>Ubicación *</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="Ej: Pasillo Planta 2, Puerta 201"
                    required
                  />
                </div>

                <div>
                  <Label>Zona *</Label>
                  <Select value={formData.zone} onValueChange={(v) => updateField('zone', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cocina">Cocina</SelectItem>
                      <SelectItem value="habitaciones">Habitaciones</SelectItem>
                      <SelectItem value="zonas_comunes">Zonas Comunes</SelectItem>
                      <SelectItem value="parking">Parking</SelectItem>
                      <SelectItem value="cuarto_maquinas">Cuarto de Máquinas</SelectItem>
                      <SelectItem value="recepcion">Recepción</SelectItem>
                      <SelectItem value="pasillos">Pasillos</SelectItem>
                      <SelectItem value="escaleras">Escaleras</SelectItem>
                      <SelectItem value="sotano">Sótano</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Estado *</Label>
                  <Select value={formData.status} onValueChange={(v) => updateField('status', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operativo">Operativo</SelectItem>
                      <SelectItem value="requiere_atencion">Requiere Atención</SelectItem>
                      <SelectItem value="defectuoso">Defectuoso</SelectItem>
                      <SelectItem value="fuera_servicio">Fuera de Servicio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Última Recarga</Label>
                  <Input
                    type="date"
                    value={formData.last_recharge_date}
                    onChange={(e) => updateField('last_recharge_date', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Próxima Inspección</Label>
                  <Input
                    type="date"
                    value={formData.next_inspection_date}
                    onChange={(e) => updateField('next_inspection_date', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Fecha de Caducidad/Retimbrado</Label>
                  <Input
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => updateField('expiry_date', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Inspección */}
            <TabsContent value="inspection" className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pressure_ok"
                      checked={formData.pressure_ok}
                      onCheckedChange={(v) => updateField('pressure_ok', v)}
                    />
                    <Label htmlFor="pressure_ok">Presión Correcta</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="seal_intact"
                      checked={formData.seal_intact}
                      onCheckedChange={(v) => updateField('seal_intact', v)}
                    />
                    <Label htmlFor="seal_intact">Precinto Intacto</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="signage_visible"
                      checked={formData.signage_visible}
                      onCheckedChange={(v) => updateField('signage_visible', v)}
                    />
                    <Label htmlFor="signage_visible">Señalización Visible</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="accessibility_ok"
                      checked={formData.accessibility_ok}
                      onCheckedChange={(v) => updateField('accessibility_ok', v)}
                    />
                    <Label htmlFor="accessibility_ok">Accesibilidad Correcta</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="functional_test_ok"
                      checked={formData.functional_test_ok}
                      onCheckedChange={(v) => updateField('functional_test_ok', v)}
                    />
                    <Label htmlFor="functional_test_ok">Prueba Funcional Correcta</Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Estado Visual</Label>
                    <Select value={formData.visual_condition} onValueChange={(v) => updateField('visual_condition', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excelente">Excelente</SelectItem>
                        <SelectItem value="bueno">Bueno</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="deficiente">Deficiente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Inspector</Label>
                    <Input
                      value={formData.inspector_name}
                      onChange={(e) => updateField('inspector_name', e.target.value)}
                      placeholder="Nombre del inspector"
                    />
                  </div>

                  <div>
                    <Label>Empresa</Label>
                    <Input
                      value={formData.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      placeholder="Empresa inspectora"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Defectos Encontrados</Label>
                <Textarea
                  value={formData.defects_found}
                  onChange={(e) => updateField('defects_found', e.target.value)}
                  placeholder="Describir defectos o anomalías detectadas"
                  rows={3}
                />
              </div>

              <div>
                <Label>Acciones Correctivas</Label>
                <Textarea
                  value={formData.corrective_actions}
                  onChange={(e) => updateField('corrective_actions', e.target.value)}
                  placeholder="Acciones realizadas o recomendadas"
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Normativa */}
            <TabsContent value="compliance" className="space-y-4 mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="complies_regulations"
                  checked={formData.complies_regulations}
                  onCheckedChange={(v) => updateField('complies_regulations', v)}
                />
                <Label htmlFor="complies_regulations" className="font-semibold">
                  Cumple con la Normativa Vigente
                </Label>
              </div>

              <div>
                <Label>Referencia Normativa</Label>
                <Input
                  value={formData.regulation_reference}
                  onChange={(e) => updateField('regulation_reference', e.target.value)}
                  placeholder="Ej: RD 513/2017"
                />
              </div>

              <div>
                <Label>URL Certificado</Label>
                <Input
                  value={formData.certificate_url}
                  onChange={(e) => updateField('certificate_url', e.target.value)}
                  placeholder="URL del certificado de inspección"
                />
              </div>

              <div>
                <Label>Observaciones</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Notas adicionales"
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
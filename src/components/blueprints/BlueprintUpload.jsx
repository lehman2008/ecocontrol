import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Save, X, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const ZONES = [
  { value: "planta_baja", label: "Planta Baja" },
  { value: "planta_primera", label: "Planta Primera" },
  { value: "planta_segunda", label: "Planta Segunda" },
  { value: "planta_tercera", label: "Planta Tercera" },
  { value: "sotano", label: "Sótano" },
  { value: "tejado", label: "Tejado" },
  { value: "instalaciones", label: "Instalaciones" },
  { value: "general", label: "General" }
];

export default function BlueprintUpload({ onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    zone: 'planta_baja',
    version: '1.0',
    scale: '1:100',
    width_meters: '',
    height_meters: '',
    notes: '',
    is_active: true
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase();
      if (['pdf', 'dwg', 'png', 'jpg', 'jpeg'].includes(fileType)) {
        setFile(selectedFile);
      } else {
        alert('Formato no soportado. Use PDF, DWG, PNG o JPG');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Por favor seleccione un archivo');
      return;
    }

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const fileType = file.name.split('.').pop().toLowerCase();
      
      onSubmit({
        ...formData,
        file_url,
        file_type: fileType === 'jpeg' ? 'jpg' : fileType,
        width_meters: parseFloat(formData.width_meters) || 0,
        height_meters: parseFloat(formData.height_meters) || 0,
        equipment_pins: []
      });
    } catch (error) {
      alert('Error al subir el archivo');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <Upload className="w-6 h-6 text-blue-500" />
          Subir Nuevo Plano
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Plano *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="Ej: Planta Baja - Principal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zone">Zona / Planta *</Label>
              <Select value={formData.zone} onValueChange={(v) => setFormData({...formData, zone: v})}>
                <SelectTrigger>
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
              <Label htmlFor="version">Versión</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData({...formData, version: e.target.value})}
                placeholder="1.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scale">Escala</Label>
              <Input
                id="scale"
                value={formData.scale}
                onChange={(e) => setFormData({...formData, scale: e.target.value})}
                placeholder="1:100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="width">Ancho Real (metros)</Label>
              <Input
                id="width"
                type="number"
                step="0.01"
                value={formData.width_meters}
                onChange={(e) => setFormData({...formData, width_meters: e.target.value})}
                placeholder="50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Alto Real (metros)</Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                value={formData.height_meters}
                onChange={(e) => setFormData({...formData, height_meters: e.target.value})}
                placeholder="30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Archivo del Plano * (PDF, DWG, PNG, JPG)</Label>
            <div className="flex items-center gap-3">
              <Input
                id="file"
                type="file"
                accept=".pdf,.dwg,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                required
                className="cursor-pointer"
              />
              {file && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {file.name}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Descripción, modificaciones, etc."
              className="h-24"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading || uploading}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || uploading}>
              {uploading || isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Plano
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, X } from "lucide-react";

export default function DocumentUpload({ equipment, tasks, onCancel, onSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "manual_usuario",
    related_to_type: "general",
    related_to_id: "",
    expiry_date: "",
    tags: ""
  });
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Document.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      if (onSuccess) onSuccess();
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!formData.name) {
        setFormData(prev => ({ ...prev, name: selectedFile.name }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Por favor selecciona un archivo");
      return;
    }

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const fileTypeMap = {
        'pdf': 'pdf',
        'dwg': 'dwg',
        'dxf': 'dxf',
        'jpg': 'jpg',
        'jpeg': 'jpg',
        'png': 'png',
        'docx': 'docx',
        'xlsx': 'xlsx'
      };

      const user = await base44.auth.me();
      
      let relatedName = "";
      if (formData.related_to_type === "equipment" && formData.related_to_id) {
        const equip = equipment.find(e => e.id === formData.related_to_id);
        relatedName = equip?.name || "";
      } else if (formData.related_to_type === "maintenance_task" && formData.related_to_id) {
        const task = tasks.find(t => t.id === formData.related_to_id);
        relatedName = task?.title || "";
      }

      const documentData = {
        ...formData,
        file_url,
        file_type: fileTypeMap[fileExtension] || 'otro',
        file_size_mb: (file.size / (1024 * 1024)).toFixed(2),
        related_to_name: relatedName,
        uploaded_by_name: user.full_name,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
      };

      createMutation.mutate(documentData);
    } catch (error) {
      alert("Error al subir el archivo");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Subir Nuevo Documento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Archivo *</Label>
              <Input
                type="file"
                onChange={handleFileChange}
                required
                disabled={uploading}
              />
              {file && (
                <p className="text-sm text-slate-500">
                  {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Nombre del Documento *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                disabled={uploading}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Descripción</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                disabled={uploading}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value})}
                disabled={uploading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual_usuario">Manual de Usuario</SelectItem>
                  <SelectItem value="manual_tecnico">Manual Técnico</SelectItem>
                  <SelectItem value="certificado_calidad">Certificado de Calidad</SelectItem>
                  <SelectItem value="certificado_inspeccion">Certificado de Inspección</SelectItem>
                  <SelectItem value="plano_tecnico">Plano Técnico</SelectItem>
                  <SelectItem value="ficha_tecnica">Ficha Técnica</SelectItem>
                  <SelectItem value="garantia">Garantía</SelectItem>
                  <SelectItem value="contrato_mantenimiento">Contrato Mantenimiento</SelectItem>
                  <SelectItem value="factura">Factura</SelectItem>
                  <SelectItem value="foto">Foto</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Relacionado con *</Label>
              <Select
                value={formData.related_to_type}
                onValueChange={(value) => setFormData({...formData, related_to_type: value, related_to_id: ""})}
                disabled={uploading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="equipment">Equipo</SelectItem>
                  <SelectItem value="maintenance_task">Mantenimiento</SelectItem>
                  <SelectItem value="zone">Zona</SelectItem>
                  <SelectItem value="blueprint">Plano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.related_to_type === "equipment" && (
              <div className="space-y-2">
                <Label>Seleccionar Equipo</Label>
                <Select
                  value={formData.related_to_id}
                  onValueChange={(value) => setFormData({...formData, related_to_id: value})}
                  disabled={uploading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipment.map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.related_to_type === "maintenance_task" && (
              <div className="space-y-2">
                <Label>Seleccionar Mantenimiento</Label>
                <Select
                  value={formData.related_to_id}
                  onValueChange={(value) => setFormData({...formData, related_to_id: value})}
                  disabled={uploading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un mantenimiento" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Fecha de Caducidad</Label>
              <Input
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                disabled={uploading}
              />
            </div>

            <div className="space-y-2">
              <Label>Etiquetas (separadas por comas)</Label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="ej: calderas, manual, 2024"
                disabled={uploading}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel} disabled={uploading}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Subir Documento
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
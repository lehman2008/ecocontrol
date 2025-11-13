import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Camera, Save, Upload, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SignaturePad from "../shared/SignaturePad";

export default function TaskExecutionModal({ task, onClose, onComplete, isLoading }) {
  const [executionData, setExecutionData] = useState({
    status: 'en_proceso',
    actual_duration_hours: '',
    technician_notes: '',
    checklist: task.checklist || [],
    photos_before: [],
    photos_after: [],
    signature: ''
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  const handleChecklistChange = (index, completed) => {
    const newChecklist = [...executionData.checklist];
    newChecklist[index] = { ...newChecklist[index], completed };
    setExecutionData({ ...executionData, checklist: newChecklist });
  };

  const handleChecklistNotes = (index, notes) => {
    const newChecklist = [...executionData.checklist];
    newChecklist[index] = { ...newChecklist[index], notes };
    setExecutionData({ ...executionData, checklist: newChecklist });
  };

  const handlePhotoUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingPhoto(true);
    try {
      const uploadPromises = files.map(file => 
        base44.integrations.Core.UploadFile({ file })
      );
      const results = await Promise.all(uploadPromises);
      const urls = results.map(r => r.file_url);

      if (type === 'before') {
        setExecutionData(prev => ({
          ...prev,
          photos_before: [...prev.photos_before, ...urls]
        }));
      } else {
        setExecutionData(prev => ({
          ...prev,
          photos_after: [...prev.photos_after, ...urls]
        }));
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
    }
    setUploadingPhoto(false);
  };

  const handleSignatureSave = (signatureData) => {
    setExecutionData({ ...executionData, signature: signatureData });
    setShowSignaturePad(false);
  };

  const handleComplete = () => {
    const allChecklistCompleted = executionData.checklist.every(item => item.completed);
    
    if (!allChecklistCompleted) {
      if (!confirm('No todos los ítems del checklist están completados. ¿Deseas continuar?')) {
        return;
      }
    }

    if (!executionData.signature) {
      alert('Por favor, firma el documento antes de completar la tarea');
      return;
    }

    onComplete(task.id, executionData);
  };

  const completedCount = executionData.checklist.filter(item => item.completed).length;
  const totalCount = executionData.checklist.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            Ejecutar Tarea: {task.title}
            {task.legal_requirement && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Legal
              </Badge>
            )}
          </DialogTitle>
          {task.equipment_name && (
            <p className="text-sm text-slate-600">Equipo: {task.equipment_name}</p>
          )}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress */}
          {totalCount > 0 && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-blue-800">
                  Progreso del Checklist
                </span>
                <span className="text-sm font-bold text-blue-800">
                  {completedCount}/{totalCount} ({completionPercentage.toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Checklist */}
          {totalCount > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Checklist de Verificación</h3>
              {executionData.checklist.map((item, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={`checklist-${index}`}
                      checked={item.completed}
                      onCheckedChange={(checked) => handleChecklistChange(index, checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={`checklist-${index}`}
                        className={`cursor-pointer font-medium ${item.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}
                      >
                        {item.item}
                      </Label>
                      <Input
                        placeholder="Notas adicionales (opcional)"
                        value={item.notes || ''}
                        onChange={(e) => handleChecklistNotes(index, e.target.value)}
                        className="mt-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Fotos */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Documentación Fotográfica</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Fotos Antes */}
              <div className="space-y-2">
                <Label className="font-semibold">Fotos ANTES del Trabajo</Label>
                <label className="cursor-pointer block">
                  <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 transition-colors text-center bg-slate-50">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm font-medium text-slate-600">
                      {uploadingPhoto ? 'Subiendo...' : 'Subir fotos ANTES'}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handlePhotoUpload(e, 'before')}
                    className="hidden"
                    disabled={uploadingPhoto}
                  />
                </label>
                {executionData.photos_before.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {executionData.photos_before.map((url, idx) => (
                      <img 
                        key={idx} 
                        src={url} 
                        alt={`Antes ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-slate-200"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Fotos Después */}
              <div className="space-y-2">
                <Label className="font-semibold">Fotos DESPUÉS del Trabajo</Label>
                <label className="cursor-pointer block">
                  <div className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 transition-colors text-center bg-green-50">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium text-green-700">
                      {uploadingPhoto ? 'Subiendo...' : 'Subir fotos DESPUÉS'}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handlePhotoUpload(e, 'after')}
                    className="hidden"
                    disabled={uploadingPhoto}
                  />
                </label>
                {executionData.photos_after.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {executionData.photos_after.map((url, idx) => (
                      <img 
                        key={idx} 
                        src={url} 
                        alt={`Después ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-green-200"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Duración y Notas */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="font-semibold">Duración Real (horas)</Label>
              <Input
                id="duration"
                type="number"
                step="0.5"
                value={executionData.actual_duration_hours}
                onChange={(e) => setExecutionData({ ...executionData, actual_duration_hours: e.target.value })}
                placeholder="2.5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="font-semibold">Notas del Técnico</Label>
            <Textarea
              id="notes"
              value={executionData.technician_notes}
              onChange={(e) => setExecutionData({ ...executionData, technician_notes: e.target.value })}
              placeholder="Observaciones, incidencias encontradas, trabajos realizados..."
              className="h-32"
            />
          </div>

          {/* Firma Digital */}
          <div className="space-y-2">
            <Label className="font-semibold">Firma Digital del Técnico *</Label>
            {!executionData.signature ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSignaturePad(true)}
                className="w-full border-2 border-dashed border-slate-300 h-32 hover:border-slate-400"
              >
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm font-medium text-slate-600">Click para firmar</p>
                </div>
              </Button>
            ) : (
              <div className="relative">
                <img 
                  src={executionData.signature} 
                  alt="Firma" 
                  className="w-full h-32 object-contain border-2 border-green-200 rounded-lg bg-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSignaturePad(true)}
                  className="absolute top-2 right-2"
                >
                  Cambiar firma
                </Button>
              </div>
            )}
          </div>

          {/* Signature Pad Modal */}
          {showSignaturePad && (
            <SignaturePad
              onSave={handleSignatureSave}
              onCancel={() => setShowSignaturePad(false)}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleComplete}
            disabled={isLoading || !executionData.signature}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {isLoading ? 'Guardando...' : 'Completar Tarea'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
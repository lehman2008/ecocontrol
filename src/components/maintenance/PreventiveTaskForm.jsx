import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Save, X, Plus, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

export default function PreventiveTaskForm({ task, equipment, users, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    task_type: 'preventivo',
    equipment_id: '',
    equipment_name: '',
    title: '',
    description: '',
    priority: 'media',
    assigned_to: '',
    scheduled_date: '',
    estimated_duration_hours: '',
    legal_requirement: false,
    regulation_reference: '',
    checklist: []
  });

  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [recurrence, setRecurrence] = useState({
    enabled: false,
    frequency: 'mensual',
    count: 12
  });

  useEffect(() => {
    if (task) {
      setFormData({
        task_type: task.task_type || 'preventivo',
        equipment_id: task.equipment_id || '',
        equipment_name: task.equipment_name || '',
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'media',
        assigned_to: task.assigned_to || '',
        scheduled_date: task.scheduled_date?.split('T')[0] || '',
        estimated_duration_hours: task.estimated_duration_hours || '',
        legal_requirement: task.legal_requirement || false,
        regulation_reference: task.regulation_reference || '',
        checklist: task.checklist || []
      });
    }
  }, [task]);

  const handleEquipmentChange = (equipmentId) => {
    const selectedEquipment = equipment.find(e => e.id === equipmentId);
    setFormData({
      ...formData,
      equipment_id: equipmentId,
      equipment_name: selectedEquipment?.name || ''
    });
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setFormData({
        ...formData,
        checklist: [
          ...formData.checklist,
          { item: newChecklistItem, completed: false, notes: '' }
        ]
      });
      setNewChecklistItem('');
    }
  };

  const removeChecklistItem = (index) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      estimated_duration_hours: formData.estimated_duration_hours ? parseFloat(formData.estimated_duration_hours) : undefined,
      scheduled_date: new Date(formData.scheduled_date).toISOString()
    };

    // Si está habilitada la recurrencia, crear múltiples tareas
    if (recurrence.enabled && !task) {
      const tasks = [];
      const baseDate = new Date(formData.scheduled_date);
      
      for (let i = 0; i < recurrence.count; i++) {
        const scheduledDate = new Date(baseDate);
        
        switch (recurrence.frequency) {
          case 'diaria':
            scheduledDate.setDate(baseDate.getDate() + i);
            break;
          case 'semanal':
            scheduledDate.setDate(baseDate.getDate() + (i * 7));
            break;
          case 'quincenal':
            scheduledDate.setDate(baseDate.getDate() + (i * 15));
            break;
          case 'mensual':
            scheduledDate.setMonth(baseDate.getMonth() + i);
            break;
          case 'trimestral':
            scheduledDate.setMonth(baseDate.getMonth() + (i * 3));
            break;
          case 'semestral':
            scheduledDate.setMonth(baseDate.getMonth() + (i * 6));
            break;
          case 'anual':
            scheduledDate.setFullYear(baseDate.getFullYear() + i);
            break;
        }
        
        tasks.push({
          ...taskData,
          title: `${taskData.title} #${i + 1}`,
          scheduled_date: scheduledDate.toISOString()
        });
      }
      
      // Crear todas las tareas
      for (const t of tasks) {
        await onSubmit(t);
      }
    } else {
      onSubmit(taskData);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <Wrench className="w-6 h-6 text-green-500" />
          {task ? 'Editar Tarea Preventiva' : 'Nueva Tarea Preventiva'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Información Básica</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="equipment_id" className="font-semibold">Equipo Asociado *</Label>
                <Select
                  value={formData.equipment_id}
                  onValueChange={handleEquipmentChange}
                  required
                >
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder="Seleccionar equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipment.map(eq => (
                      <SelectItem key={eq.id} value={eq.id}>
                        {eq.name} {eq.equipment_code && `(${eq.equipment_code})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="font-semibold">Título de la Tarea *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Ej: Revisión mensual de caldera"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="font-semibold">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción detallada de las tareas a realizar..."
                  className="h-24 border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Programación */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Programación</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="scheduled_date" className="font-semibold">Fecha Programada *</Label>
                <Input
                  id="scheduled_date"
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  required
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated_duration_hours" className="font-semibold">Duración Estimada (horas)</Label>
                <Input
                  id="estimated_duration_hours"
                  type="number"
                  step="0.5"
                  value={formData.estimated_duration_hours}
                  onChange={(e) => setFormData({ ...formData, estimated_duration_hours: e.target.value })}
                  placeholder="2.5"
                  className="border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assigned_to" className="font-semibold">Asignar a Técnico</Label>
                <Select
                  value={formData.assigned_to}
                  onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
                >
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder="Sin asignar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Sin asignar</SelectItem>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.email}>
                        {user.full_name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="font-semibold">Prioridad</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Recurrencia - solo para tareas nuevas */}
            {!task && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="recurrence"
                    checked={recurrence.enabled}
                    onCheckedChange={(checked) => setRecurrence({ ...recurrence, enabled: checked })}
                  />
                  <Label htmlFor="recurrence" className="font-semibold cursor-pointer">
                    Crear múltiples tareas recurrentes
                  </Label>
                </div>
                
                {recurrence.enabled && (
                  <div className="grid md:grid-cols-2 gap-4 mt-3">
                    <div className="space-y-2">
                      <Label className="font-semibold">Frecuencia</Label>
                      <Select
                        value={recurrence.frequency}
                        onValueChange={(value) => setRecurrence({ ...recurrence, frequency: value })}
                      >
                        <SelectTrigger className="border-slate-200 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diaria">Diaria</SelectItem>
                          <SelectItem value="semanal">Semanal</SelectItem>
                          <SelectItem value="quincenal">Quincenal</SelectItem>
                          <SelectItem value="mensual">Mensual</SelectItem>
                          <SelectItem value="trimestral">Trimestral</SelectItem>
                          <SelectItem value="semestral">Semestral</SelectItem>
                          <SelectItem value="anual">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Cantidad de Tareas</Label>
                      <Input
                        type="number"
                        min="1"
                        max="52"
                        value={recurrence.count}
                        onChange={(e) => setRecurrence({ ...recurrence, count: parseInt(e.target.value) })}
                        className="border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mantenimiento Legal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="legal_requirement"
                checked={formData.legal_requirement}
                onCheckedChange={(checked) => setFormData({ ...formData, legal_requirement: checked })}
              />
              <Label htmlFor="legal_requirement" className="font-semibold cursor-pointer">
                Es un mantenimiento legal obligatorio
              </Label>
            </div>
            
            {formData.legal_requirement && (
              <Alert className="bg-orange-50 border-orange-200">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription>
                  <div className="space-y-2">
                    <Label htmlFor="regulation_reference" className="font-semibold">Referencia Normativa</Label>
                    <Input
                      id="regulation_reference"
                      value={formData.regulation_reference}
                      onChange={(e) => setFormData({ ...formData, regulation_reference: e.target.value })}
                      placeholder="Ej: RD 487/2022 - Legionela"
                      className="border-slate-200 bg-white"
                    />
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Checklist */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Checklist Digital</h3>
            
            <div className="flex gap-2">
              <Input
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                placeholder="Añadir ítem al checklist..."
                className="border-slate-200"
              />
              <Button
                type="button"
                onClick={addChecklistItem}
                variant="outline"
                className="flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {formData.checklist.length > 0 && (
              <div className="space-y-2">
                {formData.checklist.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <span className="text-sm font-medium text-slate-700">{item.item}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeChecklistItem(index)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Guardando...' : task ? 'Actualizar' : recurrence.enabled ? `Crear ${recurrence.count} Tareas` : 'Guardar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Users, Save, X } from "lucide-react";

export default function OccupancyForm({ record, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    date: '',
    total_rooms: '',
    occupied_rooms: '',
    guests_count: '',
    restaurant_covers: '',
    events_attendees: '',
    notes: ''
  });

  const [occupancyPercentage, setOccupancyPercentage] = useState(0);

  useEffect(() => {
    if (record) {
      setFormData({
        date: record.date || '',
        total_rooms: record.total_rooms || '',
        occupied_rooms: record.occupied_rooms || '',
        guests_count: record.guests_count || '',
        restaurant_covers: record.restaurant_covers || '',
        events_attendees: record.events_attendees || '',
        notes: record.notes || ''
      });
    } else {
      const today = new Date();
      setFormData(prev => ({
        ...prev,
        date: today.toISOString().split('T')[0]
      }));
    }
  }, [record]);

  useEffect(() => {
    const total = parseInt(formData.total_rooms) || 0;
    const occupied = parseInt(formData.occupied_rooms) || 0;
    
    if (total > 0) {
      setOccupancyPercentage((occupied / total) * 100);
    } else {
      setOccupancyPercentage(0);
    }
  }, [formData.total_rooms, formData.occupied_rooms]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      total_rooms: parseInt(formData.total_rooms) || 0,
      occupied_rooms: parseInt(formData.occupied_rooms) || 0,
      guests_count: parseInt(formData.guests_count) || 0,
      restaurant_covers: parseInt(formData.restaurant_covers) || 0,
      events_attendees: parseInt(formData.events_attendees) || 0,
      occupancy_percentage: occupancyPercentage
    });
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-800">
          <Users className="w-6 h-6 text-purple-500" />
          {record ? 'Editar Registro' : 'Nuevo Registro de Ocupación'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date" className="font-semibold">Fecha *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_rooms" className="font-semibold">Total Habitaciones *</Label>
              <Input
                id="total_rooms"
                type="number"
                min="0"
                value={formData.total_rooms}
                onChange={(e) => setFormData({ ...formData, total_rooms: e.target.value })}
                required
                placeholder="100"
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupied_rooms" className="font-semibold">Habitaciones Ocupadas *</Label>
              <Input
                id="occupied_rooms"
                type="number"
                min="0"
                value={formData.occupied_rooms}
                onChange={(e) => setFormData({ ...formData, occupied_rooms: e.target.value })}
                required
                placeholder="75"
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests_count" className="font-semibold">Número de Huéspedes</Label>
              <Input
                id="guests_count"
                type="number"
                min="0"
                value={formData.guests_count}
                onChange={(e) => setFormData({ ...formData, guests_count: e.target.value })}
                placeholder="150"
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurant_covers" className="font-semibold">Comensales Restaurante</Label>
              <Input
                id="restaurant_covers"
                type="number"
                min="0"
                value={formData.restaurant_covers}
                onChange={(e) => setFormData({ ...formData, restaurant_covers: e.target.value })}
                placeholder="200"
                className="border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="events_attendees" className="font-semibold">Asistentes a Eventos</Label>
              <Input
                id="events_attendees"
                type="number"
                min="0"
                value={formData.events_attendees}
                onChange={(e) => setFormData({ ...formData, events_attendees: e.target.value })}
                placeholder="50"
                className="border-slate-200"
              />
            </div>
          </div>

          {/* Ocupación Calculada */}
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
            <h3 className="font-bold text-purple-800 mb-2">Ocupación Calculada</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full h-3 bg-purple-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-500"
                    style={{ width: `${occupancyPercentage}%` }}
                  />
                </div>
              </div>
              <span className="text-3xl font-bold text-purple-900">
                {occupancyPercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="font-semibold">Notas del Día</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Eventos especiales, observaciones..."
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
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Guardando...' : record ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
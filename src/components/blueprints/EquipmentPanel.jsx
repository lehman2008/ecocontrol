import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search } from "lucide-react";

export default function EquipmentPanel({ equipment, selectedEquipment, onSelectEquipment }) {
  const [search, setSearch] = useState('');

  const filteredEquipment = equipment.filter(eq =>
    eq.name?.toLowerCase().includes(search.toLowerCase()) ||
    eq.equipment_code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-500" />
          Seleccionar Equipo
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar equipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredEquipment.map(eq => (
            <div
              key={eq.id}
              onClick={() => onSelectEquipment(eq.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                selectedEquipment === eq.id
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
              }`}
            >
              <div className="font-semibold text-sm text-slate-800 mb-1">
                {eq.name}
              </div>
              <div className="flex flex-wrap gap-1">
                {eq.equipment_code && (
                  <Badge variant="outline" className="text-xs">
                    {eq.equipment_code}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {eq.zone?.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>
          ))}

          {filteredEquipment.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">
              No se encontraron equipos
            </p>
          )}
        </div>

        {selectedEquipment && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-800">
              Click en el plano para ubicar el equipo
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
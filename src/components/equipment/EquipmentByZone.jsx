import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, AlertCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ZONE_LABELS = {
  cocina: "Cocina",
  lavanderia: "Lavandería",
  habitaciones: "Habitaciones",
  zonas_comunes: "Zonas Comunes",
  spa_wellness: "Spa/Wellness",
  cuarto_calderas: "Cuarto de Calderas",
  cuarto_electrico: "Cuarto Eléctrico",
  piscina: "Piscina",
  parking: "Parking",
  ascensores: "Ascensores",
  tejado_azotea: "Tejado/Azotea",
  sotano: "Sótano",
  recepcion: "Recepción",
  otro: "Otro"
};

export default function EquipmentByZone({ equipment, isLoading, onEdit }) {
  const equipmentByZone = equipment.reduce((acc, eq) => {
    const zone = eq.zone || 'otro';
    if (!acc[zone]) acc[zone] = [];
    acc[zone].push(eq);
    return acc;
  }, {});

  const sortedZones = Object.keys(equipmentByZone).sort();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="text-2xl font-bold text-slate-800">
          Equipos por Zona
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {sortedZones.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No hay equipos registrados aún
          </div>
        ) : (
          <Accordion type="single" collapsible className="space-y-2">
            {sortedZones.map((zone) => {
              const zoneEquipment = equipmentByZone[zone];
              const criticalCount = zoneEquipment.filter(e => e.status === 'averiado').length;

              return (
                <AccordionItem 
                  key={zone} 
                  value={zone}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-slate-50">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-800">
                          {ZONE_LABELS[zone] || zone}
                        </h3>
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-indigo-200">
                          {zoneEquipment.length} equipos
                        </Badge>
                        {criticalCount > 0 && (
                          <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {criticalCount} averiados
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-3 pt-3">
                      {zoneEquipment.map((eq) => (
                        <div 
                          key={eq.id}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            {eq.photo_url && (
                              <img 
                                src={eq.photo_url} 
                                alt={eq.name}
                                className="w-16 h-16 rounded-lg object-cover border-2 border-slate-200"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-slate-800">{eq.name}</h4>
                                {eq.equipment_code && (
                                  <span className="text-xs font-mono text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                                    {eq.equipment_code}
                                  </span>
                                )}
                              </div>
                              {eq.manufacturer && (
                                <p className="text-sm text-slate-600">
                                  {eq.manufacturer} {eq.model && `• ${eq.model}`}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    eq.status === 'operativo' ? 'bg-green-50 text-green-700 border-green-200' :
                                    eq.status === 'averiado' ? 'bg-red-50 text-red-700 border-red-200' :
                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                  }`}
                                >
                                  {eq.status?.replace(/_/g, ' ')}
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                                  {eq.system_type?.replace(/_/g, ' ')}
                                </Badge>
                                {eq.criticality === 'critica' && (
                                  <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-300">
                                    Crítico
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(eq)}
                            className="hover:bg-slate-200"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
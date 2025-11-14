import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ZONE_LABELS = {
  planta_baja: "Planta Baja",
  planta_primera: "Planta Primera",
  planta_segunda: "Planta Segunda",
  planta_tercera: "Planta Tercera",
  sotano: "Sótano",
  tejado: "Tejado",
  instalaciones: "Instalaciones",
  general: "General"
};

export default function BlueprintList({ blueprints, isLoading, onView }) {
  const groupedByZone = blueprints.reduce((acc, bp) => {
    const zone = bp.zone || 'general';
    if (!acc[zone]) acc[zone] = [];
    acc[zone].push(bp);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map(i => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedByZone).map(([zone, zoneBps]) => (
        <div key={zone}>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            {ZONE_LABELS[zone]}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {zoneBps.map(blueprint => (
              <Card key={blueprint.id} className="border-0 shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-slate-800 mb-1">{blueprint.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          v{blueprint.version}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-100 text-slate-700">
                          {blueprint.scale}
                        </Badge>
                        {blueprint.is_active && (
                          <Badge className="bg-green-100 text-green-700">
                            Activo
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {blueprint.file_url && (
                    <div className="mb-4 rounded-lg overflow-hidden bg-slate-100 h-32 flex items-center justify-center">
                      {blueprint.file_type === 'pdf' ? (
                        <FileText className="w-16 h-16 text-slate-400" />
                      ) : (
                        <img 
                          src={blueprint.file_url} 
                          alt={blueprint.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  {blueprint.width_meters && blueprint.height_meters && (
                    <p className="text-sm text-slate-600 mb-3">
                      Dimensiones: {blueprint.width_meters} × {blueprint.height_meters} m
                    </p>
                  )}

                  {blueprint.equipment_pins && blueprint.equipment_pins.length > 0 && (
                    <p className="text-sm text-slate-500 mb-3">
                      📍 {blueprint.equipment_pins.length} equipo(s) ubicado(s)
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => onView(blueprint)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Plano
                    </Button>
                    {blueprint.previous_version_id && (
                      <Button variant="outline" size="icon">
                        <History className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {blueprints.length === 0 && (
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-semibold text-slate-700">No hay planos registrados</p>
            <p className="text-sm text-slate-500 mt-2">Sube tu primer plano para comenzar</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
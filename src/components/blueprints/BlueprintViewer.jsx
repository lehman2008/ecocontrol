import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  MapPin,
  Ruler,
  MessageSquare,
  Layers,
  Save
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BlueprintCanvas from "./BlueprintCanvas";
import EquipmentPanel from "./EquipmentPanel";

export default function BlueprintViewer({ blueprint, equipment, annotations, onBack }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState('pan');
  const [activeLayers, setActiveLayers] = useState(['equipment', 'annotations']);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [pins, setPins] = useState(blueprint.equipment_pins || []);
  const [tempAnnotations, setTempAnnotations] = useState([]);
  const [measuring, setMeasuring] = useState(null);
  
  const queryClient = useQueryClient();

  const updateBlueprintMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Blueprint.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blueprints'] });
    },
  });

  const createAnnotationMutation = useMutation({
    mutationFn: (data) => base44.entities.BlueprintAnnotation.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annotations'] });
      setTempAnnotations([]);
    },
  });

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleCanvasClick = (x, y) => {
    if (tool === 'pin' && selectedEquipment) {
      const newPins = [...pins, {
        equipment_id: selectedEquipment,
        x: x / zoom - pan.x,
        y: y / zoom - pan.y
      }];
      setPins(newPins);
      setSelectedEquipment(null);
      setTool('pan');
    } else if (tool === 'note') {
      const text = prompt('Ingrese el texto de la nota:');
      if (text) {
        setTempAnnotations([...tempAnnotations, {
          type: 'note',
          x: x / zoom - pan.x,
          y: y / zoom - pan.y,
          text,
          color: '#3b82f6'
        }]);
      }
      setTool('pan');
    } else if (tool === 'measure') {
      if (!measuring) {
        setMeasuring({ x1: x / zoom - pan.x, y1: y / zoom - pan.y });
      } else {
        const distance = prompt('Ingrese la distancia en metros:');
        if (distance) {
          setTempAnnotations([...tempAnnotations, {
            type: 'measurement',
            x: measuring.x1,
            y: measuring.y1,
            x2: x / zoom - pan.x,
            y2: y / zoom - pan.y,
            distance_meters: parseFloat(distance),
            text: `${distance} m`,
            color: '#ef4444'
          }]);
        }
        setMeasuring(null);
        setTool('pan');
      }
    }
  };

  const handleSavePins = () => {
    updateBlueprintMutation.mutate({
      id: blueprint.id,
      data: { equipment_pins: pins }
    });
  };

  const handleSaveAnnotations = () => {
    tempAnnotations.forEach(annotation => {
      createAnnotationMutation.mutate({
        blueprint_id: blueprint.id,
        ...annotation,
        layer: 'general'
      });
    });
  };

  const toggleLayer = (layer) => {
    setActiveLayers(prev => 
      prev.includes(layer) 
        ? prev.filter(l => l !== layer)
        : [...prev, layer]
    );
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-4">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <CardTitle className="text-xl">{blueprint.name}</CardTitle>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">v{blueprint.version}</Badge>
                    <Badge variant="outline">{blueprint.scale}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center gap-2 p-4 bg-slate-50 border-b border-slate-200">
              <Button 
                variant={tool === 'pan' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTool('pan')}
              >
                Mover
              </Button>
              <Button 
                variant={tool === 'pin' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTool('pin')}
              >
                <MapPin className="w-4 h-4 mr-1" />
                Pin Equipo
              </Button>
              <Button 
                variant={tool === 'measure' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTool('measure')}
              >
                <Ruler className="w-4 h-4 mr-1" />
                Medir
              </Button>
              <Button 
                variant={tool === 'note' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTool('note')}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Nota
              </Button>
              
              <div className="flex-1" />

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-semibold w-16 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleResetView}>
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <BlueprintCanvas
              blueprint={blueprint}
              zoom={zoom}
              pan={pan}
              onPanChange={setPan}
              pins={pins}
              equipment={equipment}
              annotations={[...annotations, ...tempAnnotations]}
              activeLayers={activeLayers}
              onClick={handleCanvasClick}
              measuring={measuring}
            />
          </CardContent>
        </Card>

        {(pins.length > 0 || tempAnnotations.length > 0) && (
          <div className="flex gap-3">
            {pins.length > 0 && (
              <Button 
                onClick={handleSavePins}
                className="bg-green-600 hover:bg-green-700"
                disabled={updateBlueprintMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Pins ({pins.length})
              </Button>
            )}
            {tempAnnotations.length > 0 && (
              <Button 
                onClick={handleSaveAnnotations}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={createAnnotationMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Anotaciones ({tempAnnotations.length})
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-500" />
              Capas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50">
              <span className="text-sm font-medium">Equipos</span>
              <input
                type="checkbox"
                checked={activeLayers.includes('equipment')}
                onChange={() => toggleLayer('equipment')}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50">
              <span className="text-sm font-medium">Anotaciones</span>
              <input
                type="checkbox"
                checked={activeLayers.includes('annotations')}
                onChange={() => toggleLayer('annotations')}
                className="w-4 h-4"
              />
            </div>
          </CardContent>
        </Card>

        {tool === 'pin' && (
          <EquipmentPanel
            equipment={equipment}
            selectedEquipment={selectedEquipment}
            onSelectEquipment={setSelectedEquipment}
          />
        )}

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-lg">Información</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-sm space-y-2">
            <p className="text-slate-600">
              <strong>Escala:</strong> {blueprint.scale}
            </p>
            {blueprint.width_meters && blueprint.height_meters && (
              <p className="text-slate-600">
                <strong>Dimensiones:</strong> {blueprint.width_meters} × {blueprint.height_meters} m
              </p>
            )}
            <p className="text-slate-600">
              <strong>Equipos:</strong> {pins.length} ubicados
            </p>
            <p className="text-slate-600">
              <strong>Anotaciones:</strong> {annotations.length + tempAnnotations.length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
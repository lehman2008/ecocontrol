import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Pencil, 
  Square, 
  Circle, 
  Type, 
  Ruler, 
  MapPin, 
  Trash2,
  Download,
  Save,
  Undo,
  Redo,
  ArrowLeft,
  Home,
  DoorOpen,
  Droplets,
  Zap,
  Wind,
  Flame
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const TOOLS = {
  pen: { icon: Pencil, label: "Dibujar" },
  line: { icon: Ruler, label: "Línea" },
  rectangle: { icon: Square, label: "Rectángulo" },
  circle: { icon: Circle, label: "Círculo" },
  text: { icon: Type, label: "Texto" },
  measure: { icon: Ruler, label: "Medir" },
  eraser: { icon: Trash2, label: "Borrar" }
};

const ICONS = [
  { icon: Home, label: "Habitación", color: "#3b82f6", layer: "general" },
  { icon: DoorOpen, label: "Puerta", color: "#10b981", layer: "general" },
  { icon: Droplets, label: "Agua", color: "#06b6d4", layer: "fontaneria" },
  { icon: Zap, label: "Eléctrico", color: "#f59e0b", layer: "electricidad" },
  { icon: Wind, label: "HVAC", color: "#8b5cf6", layer: "hvac" },
  { icon: Flame, label: "Gas", color: "#ef4444", layer: "gas" }
];

export default function BlueprintEditor({ onSave, onCancel, equipment = [] }) {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [blueprintName, setBlueprintName] = useState("Plano sin título");
  const [blueprintZone, setBlueprintZone] = useState("general");
  const [scale, setScale] = useState("1:100");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showEquipmentList, setShowEquipmentList] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    redrawCanvas(ctx);
  }, [elements, color, lineWidth]);

  const redrawCanvas = (ctx) => {
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fondo blanco con grid
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    const gridSize = 50;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Dibujar elementos
    elements.forEach(element => {
      ctx.strokeStyle = element.color;
      ctx.fillStyle = element.color;
      ctx.lineWidth = element.lineWidth || 2;

      switch (element.type) {
        case 'pen':
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          element.points.forEach(point => ctx.lineTo(point.x, point.y));
          ctx.stroke();
          break;

        case 'line':
          ctx.beginPath();
          ctx.moveTo(element.x1, element.y1);
          ctx.lineTo(element.x2, element.y2);
          ctx.stroke();
          break;

        case 'rectangle':
          if (element.filled) {
            ctx.fillRect(element.x, element.y, element.width, element.height);
          } else {
            ctx.strokeRect(element.x, element.y, element.width, element.height);
          }
          break;

        case 'circle':
          ctx.beginPath();
          const radius = Math.sqrt(Math.pow(element.x2 - element.x1, 2) + Math.pow(element.y2 - element.y1, 2));
          ctx.arc(element.x1, element.y1, radius, 0, Math.PI * 2);
          if (element.filled) {
            ctx.fill();
          } else {
            ctx.stroke();
          }
          break;

        case 'text':
          ctx.font = `${element.fontSize || 16}px Arial`;
          ctx.fillText(element.text, element.x, element.y);
          break;

        case 'measure':
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(element.x1, element.y1);
          ctx.lineTo(element.x2, element.y2);
          ctx.stroke();
          
          const midX = (element.x1 + element.x2) / 2;
          const midY = (element.y1 + element.y2) / 2;
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(midX - 30, midY - 12, 60, 24);
          ctx.fillStyle = 'white';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(element.distance + ' m', midX, midY + 5);
          break;

        case 'icon':
          ctx.fillStyle = element.color;
          ctx.beginPath();
          ctx.arc(element.x, element.y, 15, 0, Math.PI * 2);
          ctx.fill();
          
          // Borde si tiene equipo vinculado
          if (element.equipment_id) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();
          }
          
          ctx.fillStyle = 'white';
          ctx.font = 'bold 10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(element.iconLabel[0], element.x, element.y + 4);
          break;
      }
    });
  };

  const saveToHistory = (newElements) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (selectedIcon) {
      const newIcon = {
        type: 'icon',
        x,
        y,
        color: selectedIcon.color,
        iconLabel: selectedIcon.label,
        layer: selectedIcon.layer || 'general',
        equipment_id: selectedEquipment || null
      };
      const newElements = [...elements, newIcon];
      setElements(newElements);
      saveToHistory(newElements);
      setSelectedIcon(null);
      setSelectedEquipment(null);
      setShowEquipmentList(false);
      return;
    }

    setIsDrawing(true);
    setStartPoint({ x, y });

    if (tool === 'pen') {
      const newElement = {
        type: 'pen',
        points: [{ x, y }],
        color,
        lineWidth
      };
      setElements([...elements, newElement]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (tool === 'pen') {
      const newElements = [...elements];
      const currentElement = newElements[newElements.length - 1];
      currentElement.points.push({ x, y });
      setElements(newElements);
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing || !startPoint) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    let newElement = null;

    switch (tool) {
      case 'line':
        newElement = { type: 'line', x1: startPoint.x, y1: startPoint.y, x2: x, y2: y, color, lineWidth };
        break;

      case 'rectangle':
        newElement = {
          type: 'rectangle',
          x: Math.min(startPoint.x, x),
          y: Math.min(startPoint.y, y),
          width: Math.abs(x - startPoint.x),
          height: Math.abs(y - startPoint.y),
          color,
          lineWidth,
          filled: false
        };
        break;

      case 'circle':
        newElement = { type: 'circle', x1: startPoint.x, y1: startPoint.y, x2: x, y2: y, color, lineWidth };
        break;

      case 'text':
        const text = prompt('Ingrese el texto:');
        if (text) {
          newElement = { type: 'text', x: startPoint.x, y: startPoint.y, text, color, fontSize: 16 };
        }
        break;

      case 'measure':
        const distance = prompt('Ingrese la distancia en metros:');
        if (distance) {
          newElement = {
            type: 'measure',
            x1: startPoint.x,
            y1: startPoint.y,
            x2: x,
            y2: y,
            distance: parseFloat(distance)
          };
        }
        break;
    }

    if (newElement || tool === 'pen') {
      const newElements = newElement ? [...elements, newElement] : elements;
      setElements(newElements);
      saveToHistory(newElements);
    }

    setIsDrawing(false);
    setStartPoint(null);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setElements(history[historyStep - 1]);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setElements(history[historyStep + 1]);
    }
  };

  const handleClear = () => {
    if (confirm('¿Borrar todo el plano?')) {
      const newElements = [];
      setElements(newElements);
      saveToHistory(newElements);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `${blueprintName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleSave = async () => {
    if (!blueprintName.trim()) {
      alert('Por favor ingrese un nombre para el plano');
      return;
    }

    setIsUploading(true);

    try {
      // Convertir canvas a blob
      const canvas = canvasRef.current;
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      
      // Subir archivo
      const file = new File([blob], `${blueprintName}.png`, { type: 'image/png' });
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Crear blueprint
      await base44.entities.Blueprint.create({
        name: blueprintName,
        zone: blueprintZone,
        file_url,
        file_type: 'png',
        scale,
        version: '1.0',
        is_active: true,
        notes: 'Creado con el editor de planos'
      });

      onSave();
    } catch (error) {
      alert('Error al guardar el plano: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Canvas */}
      <div className="lg:col-span-3">
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={onCancel}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="text-xl">Editor de Planos</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleUndo} disabled={historyStep <= 0}>
                  <Undo className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleRedo} disabled={historyStep >= history.length - 1}>
                  <Redo className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleClear}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <canvas
              ref={canvasRef}
              width={1200}
              height={800}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="cursor-crosshair w-full border-t border-slate-200"
              style={{ maxHeight: '800px' }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Herramientas */}
      <div className="space-y-4">
        {/* Información del plano */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-lg">Información</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div>
              <Label>Nombre del plano</Label>
              <Input
                value={blueprintName}
                onChange={(e) => setBlueprintName(e.target.value)}
                placeholder="Ej: Planta Baja"
              />
            </div>
            <div>
              <Label>Zona</Label>
              <Select value={blueprintZone} onValueChange={setBlueprintZone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planta_baja">Planta Baja</SelectItem>
                  <SelectItem value="planta_primera">Planta Primera</SelectItem>
                  <SelectItem value="planta_segunda">Planta Segunda</SelectItem>
                  <SelectItem value="sotano">Sótano</SelectItem>
                  <SelectItem value="instalaciones">Instalaciones</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Escala</Label>
              <Input
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                placeholder="Ej: 1:100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Herramientas de dibujo */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-lg">Herramientas</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(TOOLS).map(([key, { icon: Icon, label }]) => (
                <Button
                  key={key}
                  variant={tool === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTool(key)}
                  className="justify-start"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>

            <div>
              <Label>Color</Label>
              <div className="flex gap-2 mt-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10 rounded border cursor-pointer"
                />
              </div>
            </div>

            <div>
              <Label>Grosor: {lineWidth}px</Label>
              <input
                type="range"
                min="1"
                max="10"
                value={lineWidth}
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Iconos */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-lg">Iconos</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            {ICONS.map((iconItem, index) => {
              const IconComponent = iconItem.icon;
              return (
                <Button
                  key={index}
                  variant={selectedIcon?.label === iconItem.label ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedIcon(iconItem);
                    setShowEquipmentList(true);
                  }}
                  className="w-full justify-start"
                  style={selectedIcon?.label === iconItem.label ? { backgroundColor: iconItem.color } : {}}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {iconItem.label}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Vincular equipo */}
        {showEquipmentList && selectedIcon && (
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-3 border-b border-blue-100">
              <CardTitle className="text-sm">Vincular Equipo (Opcional)</CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-2 max-h-48 overflow-y-auto">
              <Button
                variant={!selectedEquipment ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedEquipment(null)}
                className="w-full justify-start text-xs"
              >
                Sin vincular
              </Button>
              {equipment.map(eq => (
                <Button
                  key={eq.id}
                  variant={selectedEquipment === eq.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedEquipment(eq.id)}
                  className="w-full justify-start text-xs"
                >
                  {eq.name} - {eq.zone}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Guardar */}
        <Button
          onClick={handleSave}
          disabled={isUploading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {isUploading ? 'Guardando...' : 'Guardar Plano'}
        </Button>
      </div>
    </div>
  );
}
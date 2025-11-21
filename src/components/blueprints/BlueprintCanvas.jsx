import React, { useRef, useEffect, useState } from "react";

export default function BlueprintCanvas({ 
  blueprint, 
  zoom, 
  pan, 
  onPanChange, 
  pins, 
  equipment,
  annotations = [],
  activeLayers = [],
  onClick,
  measuring
}) {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredPin, setHoveredPin] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (blueprint.file_url && blueprint.file_type !== 'pdf') {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => setImage(img);
      img.src = blueprint.file_url;
    }
  }, [blueprint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Dibujar imagen
    if (image) {
      ctx.drawImage(image, 0, 0, canvas.width / zoom, canvas.height / zoom);
    } else if (blueprint.file_type === 'pdf') {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 0, canvas.width / zoom, canvas.height / zoom);
      ctx.fillStyle = '#64748b';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Vista previa de PDF no disponible', canvas.width / (2 * zoom), canvas.height / (2 * zoom));
    }

    // Dibujar grid
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 0.5;
    const gridSize = 50;
    for (let x = 0; x < canvas.width / zoom; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height / zoom);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height / zoom; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width / zoom, y);
      ctx.stroke();
    }

    // Dibujar anotaciones (filtradas por capa activa)
    if (activeLayers.includes('annotations')) {
      annotations.filter(annotation => {
        if (!annotation.layer) return true;
        return activeLayers.includes(annotation.layer);
      }).forEach(annotation => {
        if (annotation.type === 'note') {
          ctx.fillStyle = annotation.color || '#3b82f6';
          ctx.beginPath();
          ctx.arc(annotation.x, annotation.y, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#1e293b';
          ctx.font = '14px Arial';
          ctx.fillText(annotation.text, annotation.x + 15, annotation.y + 5);
        } else if (annotation.type === 'measurement') {
          ctx.strokeStyle = annotation.color || '#ef4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(annotation.x, annotation.y);
          ctx.lineTo(annotation.x2, annotation.y2);
          ctx.stroke();
          
          const midX = (annotation.x + annotation.x2) / 2;
          const midY = (annotation.y + annotation.y2) / 2;
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(midX - 30, midY - 12, 60, 24);
          ctx.fillStyle = 'white';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(annotation.text, midX, midY + 5);
        }
      });
    }

    // Dibujar pins de equipos
    if (activeLayers.includes('equipment')) {
      pins.forEach((pin, index) => {
        const eq = equipment.find(e => e.id === pin.equipment_id);
        
        ctx.fillStyle = hoveredPin === index ? '#f97316' : '#3b82f6';
        ctx.beginPath();
        ctx.moveTo(pin.x, pin.y);
        ctx.lineTo(pin.x - 10, pin.y - 20);
        ctx.lineTo(pin.x + 10, pin.y - 20);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(pin.x, pin.y - 15, 4, 0, Math.PI * 2);
        ctx.fill();

        if (eq && hoveredPin === index) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(pin.x - 60, pin.y - 60, 120, 40);
          ctx.fillStyle = 'white';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(eq.name, pin.x, pin.y - 45);
          ctx.font = '10px Arial';
          ctx.fillText(eq.zone?.replace(/_/g, ' '), pin.x, pin.y - 30);
        }
      });
    }

    // Dibujar línea de medición temporal
    if (measuring) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(measuring.x1, measuring.y1);
      ctx.lineTo(measuring.x1 + 100, measuring.y1 + 100);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }, [blueprint, zoom, pan, pins, equipment, annotations, activeLayers, hoveredPin, image, measuring]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - rect.left - pan.x,
      y: e.clientY - rect.top - pan.y
    });
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check hover sobre pins
    const pinIndex = pins.findIndex(pin => {
      const pinX = pin.x * zoom + pan.x;
      const pinY = pin.y * zoom + pan.y;
      const dist = Math.sqrt(Math.pow(x - pinX, 2) + Math.pow(y - pinY, 2));
      return dist < 20;
    });
    setHoveredPin(pinIndex >= 0 ? pinIndex : null);

    if (isDragging) {
      onPanChange({
        x: x - dragStart.x,
        y: y - dragStart.y
      });
    }
  };

  const handleMouseUp = (e) => {
    if (!isDragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Detectar clic en pin de equipo
      let clickedEquipmentId = null;
      for (const pin of pins) {
        const pinX = pin.x * zoom + pan.x;
        const pinY = pin.y * zoom + pan.y;
        const dist = Math.sqrt(Math.pow(x - pinX, 2) + Math.pow(y - pinY, 2));
        if (dist < 20 && pin.equipment_id) {
          clickedEquipmentId = pin.equipment_id;
          break;
        }
      }
      
      onClick(x, y, clickedEquipmentId);
    }
    setIsDragging(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={800}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDragging(false)}
      className="cursor-crosshair w-full border-t border-slate-200"
      style={{ maxHeight: '800px' }}
    />
  );
}
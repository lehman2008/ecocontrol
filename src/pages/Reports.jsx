import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Download, Calendar, Loader2 } from "lucide-react";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("comprehensive");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [includeSections, setIncludeSections] = useState({
    summary: true,
    equipment: true,
    maintenance: true,
    energy: true,
    water: true,
    fuel: true,
    pool: true,
    occupancy: true,
    kpis: true,
    charts: true
  });

  const { data: energyReadings = [] } = useQuery({
    queryKey: ['energyReadings'],
    queryFn: () => base44.entities.EnergyReading.list('-reading_date', 365),
  });

  const { data: waterReadings = [] } = useQuery({
    queryKey: ['waterReadings'],
    queryFn: () => base44.entities.WaterReading.list('-reading_date', 365),
  });

  const { data: fuelReadings = [] } = useQuery({
    queryKey: ['gasConsumption'],
    queryFn: () => base44.entities.GasConsumption.list('-reading_date', 365),
  });

  const { data: equipment = [] } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => base44.entities.Equipment.list(),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['maintenanceTasks'],
    queryFn: () => base44.entities.MaintenanceTask.list('-scheduled_date'),
  });

  const { data: occupancyData = [] } = useQuery({
    queryKey: ['occupancyData'],
    queryFn: () => base44.entities.OccupancyData.list('-date', 365),
  });

  const generatePDF = async () => {
    setIsGenerating(true);
    
    const reportData = {
      title: "Reporte EcoControl",
      type: reportType,
      period: { from: dateFrom, to: dateTo },
      generated: new Date().toISOString(),
      sections: includeSections
    };

    if (includeSections.summary) {
      reportData.summary = {
        totalEquipment: equipment.length,
        operationalEquipment: equipment.filter(e => e.status === 'operativo').length,
        pendingTasks: tasks.filter(t => t.status === 'pendiente').length,
        completedTasks: tasks.filter(t => t.status === 'completada').length
      };
    }

    if (includeSections.energy) {
      reportData.energy = {
        totalConsumption: energyReadings.reduce((s, r) => s + (r.consumption_kwh || 0), 0),
        solarProduction: energyReadings.reduce((s, r) => s + (r.solar_production_kwh || 0), 0),
        totalCost: energyReadings.reduce((s, r) => s + (r.cost_estimate || 0), 0)
      };
    }

    if (includeSections.water) {
      reportData.water = {
        totalConsumption: waterReadings.reduce((s, r) => s + (r.consumption_m3 || 0), 0),
        totalCost: waterReadings.reduce((s, r) => s + (r.cost_estimate || 0), 0)
      };
    }

    if (includeSections.fuel) {
      reportData.fuel = {
        totalKwh: fuelReadings.reduce((s, r) => s + (r.kwh_equivalent || 0), 0),
        totalCO2: fuelReadings.reduce((s, r) => s + (r.co2_emissions_kg || 0), 0),
        totalCost: fuelReadings.reduce((s, r) => s + (r.cost || 0), 0)
      };
    }

    if (includeSections.occupancy) {
      reportData.occupancy = {
        avgOccupancy: occupancyData.reduce((s, o) => s + (o.occupancy_percentage || 0), 0) / (occupancyData.length || 1),
        totalGuests: occupancyData.reduce((s, o) => s + (o.guests_count || 0), 0)
      };
    }

    if (includeSections.kpis) {
      const totalOccupiedRooms = occupancyData.reduce((sum, o) => sum + (o.occupied_rooms || 0), 0);
      const totalEnergy = energyReadings.reduce((s, r) => s + (r.consumption_kwh || 0), 0);
      const totalWater = waterReadings.reduce((s, r) => s + (r.consumption_m3 || 0), 0);
      
      reportData.kpis = {
        energyPerRoom: totalOccupiedRooms > 0 ? totalEnergy / totalOccupiedRooms : 0,
        waterPerRoom: totalOccupiedRooms > 0 ? totalWater / totalOccupiedRooms : 0
      };
    }

    // Generar HTML para PDF
    const htmlContent = generateHTMLReport(reportData);
    
    // Crear Blob y descargar
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ecocontrol-report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsGenerating(false);
  };

  const generateHTMLReport = (data) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${data.title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
    .container { max-width: 1000px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #1e40af; margin: 0 0 10px 0; }
    .header p { color: #64748b; margin: 5px 0; }
    .section { margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 8px; }
    .section h2 { color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
    .metric { display: inline-block; margin: 15px 20px; text-align: center; }
    .metric-value { font-size: 32px; font-weight: bold; color: #0ea5e9; }
    .metric-label { font-size: 14px; color: #64748b; margin-top: 5px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card h3 { margin-top: 0; color: #475569; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏨 ${data.title}</h1>
      <p><strong>Fecha de generación:</strong> ${new Date(data.generated).toLocaleDateString('es-ES', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      })}</p>
      ${data.period.from ? `<p><strong>Período:</strong> ${data.period.from} - ${data.period.to}</p>` : ''}
    </div>

    ${data.summary ? `
    <div class="section">
      <h2>📊 Resumen Ejecutivo</h2>
      <div style="text-align: center;">
        <div class="metric">
          <div class="metric-value">${data.summary.totalEquipment}</div>
          <div class="metric-label">Equipos Totales</div>
        </div>
        <div class="metric">
          <div class="metric-value">${data.summary.operationalEquipment}</div>
          <div class="metric-label">Equipos Operativos</div>
        </div>
        <div class="metric">
          <div class="metric-value">${data.summary.pendingTasks}</div>
          <div class="metric-label">Tareas Pendientes</div>
        </div>
        <div class="metric">
          <div class="metric-value">${data.summary.completedTasks}</div>
          <div class="metric-label">Tareas Completadas</div>
        </div>
      </div>
    </div>
    ` : ''}

    ${data.kpis ? `
    <div class="section">
      <h2>📈 KPIs Principales</h2>
      <div class="grid">
        <div class="card">
          <h3>Energía por Habitación</h3>
          <p style="font-size: 24px; font-weight: bold; color: #f97316;">${data.kpis.energyPerRoom.toFixed(2)} kWh/hab</p>
        </div>
        <div class="card">
          <h3>Agua por Habitación</h3>
          <p style="font-size: 24px; font-weight: bold; color: #3b82f6;">${data.kpis.waterPerRoom.toFixed(2)} m³/hab</p>
        </div>
      </div>
    </div>
    ` : ''}

    ${data.energy ? `
    <div class="section">
      <h2>⚡ Consumo Energético</h2>
      <div class="grid">
        <div class="card">
          <h3>Consumo Total</h3>
          <p style="font-size: 20px; font-weight: bold;">${data.energy.totalConsumption.toFixed(2)} kWh</p>
        </div>
        <div class="card">
          <h3>Producción Solar</h3>
          <p style="font-size: 20px; font-weight: bold; color: #10b981;">${data.energy.solarProduction.toFixed(2)} kWh</p>
        </div>
        <div class="card">
          <h3>Coste Total</h3>
          <p style="font-size: 20px; font-weight: bold; color: #ef4444;">${data.energy.totalCost.toFixed(2)} €</p>
        </div>
      </div>
    </div>
    ` : ''}

    ${data.water ? `
    <div class="section">
      <h2>💧 Consumo de Agua</h2>
      <div class="grid">
        <div class="card">
          <h3>Consumo Total</h3>
          <p style="font-size: 20px; font-weight: bold;">${data.water.totalConsumption.toFixed(2)} m³</p>
        </div>
        <div class="card">
          <h3>Coste Total</h3>
          <p style="font-size: 20px; font-weight: bold; color: #ef4444;">${data.water.totalCost.toFixed(2)} €</p>
        </div>
      </div>
    </div>
    ` : ''}

    ${data.fuel ? `
    <div class="section">
      <h2>🔥 Gases y Combustibles</h2>
      <div class="grid">
        <div class="card">
          <h3>Consumo Total</h3>
          <p style="font-size: 20px; font-weight: bold;">${data.fuel.totalKwh.toFixed(2)} kWh</p>
        </div>
        <div class="card">
          <h3>Emisiones CO₂</h3>
          <p style="font-size: 20px; font-weight: bold; color: #10b981;">${data.fuel.totalCO2.toFixed(2)} kg</p>
        </div>
        <div class="card">
          <h3>Coste Total</h3>
          <p style="font-size: 20px; font-weight: bold; color: #ef4444;">${data.fuel.totalCost.toFixed(2)} €</p>
        </div>
      </div>
    </div>
    ` : ''}

    ${data.occupancy ? `
    <div class="section">
      <h2>👥 Ocupación</h2>
      <div class="grid">
        <div class="card">
          <h3>Ocupación Media</h3>
          <p style="font-size: 20px; font-weight: bold; color: #8b5cf6;">${data.occupancy.avgOccupancy.toFixed(1)}%</p>
        </div>
        <div class="card">
          <h3>Huéspedes Totales</h3>
          <p style="font-size: 20px; font-weight: bold;">${data.occupancy.totalGuests}</p>
        </div>
      </div>
    </div>
    ` : ''}

    <div class="footer">
      <p>Generado por <strong>EcoControl</strong> - Sistema Integral de Mantenimiento Hotelero</p>
      <p>Este reporte es confidencial y para uso interno únicamente</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Generación de Reportes
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Crea reportes PDF profesionales personalizados
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-800">
              <FileText className="w-6 h-6 text-blue-500" />
              Configuración del Reporte
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Tipo de Reporte</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprehensive">Completo (todas las secciones)</SelectItem>
                    <SelectItem value="energy">Solo Energía</SelectItem>
                    <SelectItem value="maintenance">Solo Mantenimiento</SelectItem>
                    <SelectItem value="consumption">Solo Consumos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Período del Reporte (Opcional)
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    placeholder="Desde"
                  />
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    placeholder="Hasta"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-3 block font-semibold">Secciones a Incluir</Label>
              <div className="grid md:grid-cols-2 gap-3">
                {Object.entries({
                  summary: "Resumen Ejecutivo",
                  equipment: "Inventario de Equipos",
                  maintenance: "Mantenimientos",
                  energy: "Consumo Energético",
                  water: "Consumo de Agua",
                  fuel: "Gases y Combustibles",
                  pool: "Control de Piscina",
                  occupancy: "Datos de Ocupación",
                  kpis: "KPIs y Métricas",
                  charts: "Gráficos y Tendencias"
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                    <Checkbox
                      id={key}
                      checked={includeSections[key]}
                      onCheckedChange={(checked) => 
                        setIncludeSections({...includeSections, [key]: checked})
                      }
                    />
                    <label htmlFor={key} className="text-sm font-medium cursor-pointer">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={generatePDF}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-6"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generando Reporte...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Generar Reporte PDF
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
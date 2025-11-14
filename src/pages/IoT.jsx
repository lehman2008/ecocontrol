import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Zap, 
  Wind,
  AlertTriangle,
  CheckCircle,
  Radio,
  RefreshCw
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function IoTPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [sensors, setSensors] = useState({
    temperature: { value: 22.5, status: 'normal', history: [] },
    humidity: { value: 55, status: 'normal', history: [] },
    energy: { value: 245, status: 'normal', history: [] },
    water_pressure: { value: 3.2, status: 'normal', history: [] },
    air_quality: { value: 450, status: 'normal', history: [] },
    occupancy: { value: 15, status: 'normal', history: [] }
  });

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        setSensors(prev => {
          const newSensors = { ...prev };
          const newAlerts = [];

          // Temperatura (20-28°C)
          const tempChange = (Math.random() - 0.5) * 0.5;
          newSensors.temperature.value = Math.max(18, Math.min(30, prev.temperature.value + tempChange));
          newSensors.temperature.history = [...prev.temperature.history.slice(-19), { 
            time: new Date().toLocaleTimeString(), 
            value: newSensors.temperature.value 
          }];
          if (newSensors.temperature.value > 26) {
            newSensors.temperature.status = 'warning';
            newAlerts.push({ sensor: 'Temperatura', message: 'Temperatura elevada detectada', severity: 'warning' });
          } else if (newSensors.temperature.value < 19) {
            newSensors.temperature.status = 'alert';
            newAlerts.push({ sensor: 'Temperatura', message: 'Temperatura baja detectada', severity: 'alert' });
          } else {
            newSensors.temperature.status = 'normal';
          }

          // Humedad (40-70%)
          const humChange = (Math.random() - 0.5) * 2;
          newSensors.humidity.value = Math.max(30, Math.min(80, prev.humidity.value + humChange));
          newSensors.humidity.history = [...prev.humidity.history.slice(-19), { 
            time: new Date().toLocaleTimeString(), 
            value: newSensors.humidity.value 
          }];
          if (newSensors.humidity.value > 70) {
            newSensors.humidity.status = 'warning';
            newAlerts.push({ sensor: 'Humedad', message: 'Humedad alta, riesgo de condensación', severity: 'warning' });
          } else {
            newSensors.humidity.status = 'normal';
          }

          // Energía (100-400 kW)
          const energyChange = (Math.random() - 0.5) * 15;
          newSensors.energy.value = Math.max(100, Math.min(500, prev.energy.value + energyChange));
          newSensors.energy.history = [...prev.energy.history.slice(-19), { 
            time: new Date().toLocaleTimeString(), 
            value: newSensors.energy.value 
          }];
          if (newSensors.energy.value > 400) {
            newSensors.energy.status = 'alert';
            newAlerts.push({ sensor: 'Energía', message: 'Consumo energético anormalmente alto', severity: 'alert' });
          } else {
            newSensors.energy.status = 'normal';
          }

          // Presión de agua (2.5-4.0 bar)
          const pressureChange = (Math.random() - 0.5) * 0.1;
          newSensors.water_pressure.value = Math.max(1.5, Math.min(5, prev.water_pressure.value + pressureChange));
          newSensors.water_pressure.history = [...prev.water_pressure.history.slice(-19), { 
            time: new Date().toLocaleTimeString(), 
            value: newSensors.water_pressure.value 
          }];
          if (newSensors.water_pressure.value < 2.2) {
            newSensors.water_pressure.status = 'alert';
            newAlerts.push({ sensor: 'Presión Agua', message: 'Presión de agua baja', severity: 'alert' });
          } else {
            newSensors.water_pressure.status = 'normal';
          }

          // Calidad de aire CO2 (300-1000 ppm)
          const airChange = (Math.random() - 0.5) * 30;
          newSensors.air_quality.value = Math.max(300, Math.min(1500, prev.air_quality.value + airChange));
          newSensors.air_quality.history = [...prev.air_quality.history.slice(-19), { 
            time: new Date().toLocaleTimeString(), 
            value: newSensors.air_quality.value 
          }];
          if (newSensors.air_quality.value > 1000) {
            newSensors.air_quality.status = 'warning';
            newAlerts.push({ sensor: 'Calidad Aire', message: 'Nivel de CO₂ elevado', severity: 'warning' });
          } else {
            newSensors.air_quality.status = 'normal';
          }

          // Ocupación de zonas (0-50 personas)
          const occChange = Math.floor((Math.random() - 0.5) * 5);
          newSensors.occupancy.value = Math.max(0, Math.min(50, prev.occupancy.value + occChange));
          newSensors.occupancy.history = [...prev.occupancy.history.slice(-19), { 
            time: new Date().toLocaleTimeString(), 
            value: newSensors.occupancy.value 
          }];
          newSensors.occupancy.status = 'normal';

          if (newAlerts.length > 0) {
            setAlerts(prev => [...newAlerts, ...prev].slice(0, 10));
          }

          return newSensors;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isSimulating]);

  const sensorConfigs = {
    temperature: {
      icon: Thermometer,
      title: "Temperatura Ambiente",
      unit: "°C",
      color: "from-orange-500 to-red-500",
      description: "Zonas Comunes"
    },
    humidity: {
      icon: Droplets,
      title: "Humedad Relativa",
      unit: "%",
      color: "from-blue-500 to-cyan-500",
      description: "Zonas Comunes"
    },
    energy: {
      icon: Zap,
      title: "Consumo Energético",
      unit: "kW",
      color: "from-amber-500 to-orange-500",
      description: "Instalación General"
    },
    water_pressure: {
      icon: Droplets,
      title: "Presión de Agua",
      unit: "bar",
      color: "from-blue-400 to-blue-600",
      description: "Red Principal"
    },
    air_quality: {
      icon: Wind,
      title: "Calidad del Aire",
      unit: "ppm CO₂",
      color: "from-green-500 to-emerald-500",
      description: "Zonas Comunes"
    },
    occupancy: {
      icon: Activity,
      title: "Ocupación de Zonas",
      unit: "personas",
      color: "from-purple-500 to-pink-500",
      description: "Recepción"
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Monitorización IoT en Tiempo Real
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Sensores inteligentes conectados para control automático
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-md">
              <Switch
                id="simulation"
                checked={isSimulating}
                onCheckedChange={setIsSimulating}
              />
              <Label htmlFor="simulation" className="font-semibold cursor-pointer">
                {isSimulating ? (
                  <span className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-green-600 animate-pulse" />
                    Simulación Activa
                  </span>
                ) : (
                  'Iniciar Simulación'
                )}
              </Label>
            </div>
          </div>
        </div>

        {/* Sensores en Tiempo Real */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(sensors).map(([key, sensor]) => {
            const config = sensorConfigs[key];
            return (
              <Card key={key} className="border-0 shadow-xl bg-white/80 backdrop-blur overflow-hidden">
                <div className={`h-1.5 bg-gradient-to-r ${config.color}`} />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <config.icon className="w-5 h-5 text-slate-600" />
                        <h3 className="font-bold text-slate-800">{config.title}</h3>
                      </div>
                      <p className="text-xs text-slate-500">{config.description}</p>
                    </div>
                    <Badge 
                      className={`${
                        sensor.status === 'normal' ? 'bg-green-100 text-green-700' :
                        sensor.status === 'warning' ? 'bg-yellow-100 text-yellow-700 animate-pulse' :
                        'bg-red-100 text-red-700 animate-pulse'
                      }`}
                    >
                      {sensor.status === 'normal' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      )}
                      {sensor.status === 'normal' ? 'Normal' : sensor.status === 'warning' ? 'Aviso' : 'Alerta'}
                    </Badge>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      {sensor.value.toFixed(1)} <span className="text-lg">{config.unit}</span>
                    </p>
                  </div>

                  {sensor.history.length > 0 && (
                    <ResponsiveContainer width="100%" height={80}>
                      <LineChart data={sensor.history}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke={config.color.split(' ')[1].replace('to-', '#')}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alertas en Tiempo Real */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              Alertas Automáticas en Tiempo Real
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {alerts.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <p className="text-lg font-semibold text-slate-700">Sistema Estable</p>
                <p className="text-sm text-slate-500 mt-1">No hay alertas activas</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {alerts.map((alert, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'alert' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
                    } animate-fade-in`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        alert.severity === 'alert' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">{alert.sensor}</h4>
                        <p className="text-sm text-slate-600">{alert.message}</p>
                        <p className="text-xs text-slate-500 mt-1">Hace {index === 0 ? 'unos segundos' : `${index * 2} segundos`}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información del Sistema IoT */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-3 text-slate-800">💡 Características del Sistema IoT</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Sensores Activos:</h4>
                <ul className="space-y-1 text-slate-600">
                  <li>• 🌡️ Temperatura y humedad ambiental</li>
                  <li>• ⚡ Medidores de consumo energético</li>
                  <li>• 💧 Sensores de presión hidráulica</li>
                  <li>• 🌬️ Monitores de calidad del aire (CO₂)</li>
                  <li>• 👥 Detectores de ocupación por zonas</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Automatizaciones:</h4>
                <ul className="space-y-1 text-slate-600">
                  <li>• 🔔 Alertas automáticas por umbrales</li>
                  <li>• 📊 Histórico de datos en tiempo real</li>
                  <li>• 🤖 Detección de anomalías con IA (próximamente)</li>
                  <li>• 📧 Notificaciones por email/SMS (próximamente)</li>
                  <li>• 🔧 Generación automática de órdenes de trabajo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
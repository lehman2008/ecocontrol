import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";

export default function ConsumptionWidget({ energyReadings, waterReadings, fuelReadings }) {
  const [activeView, setActiveView] = React.useState("energy");

  const prepareDailyData = (readings, key) => {
    const last14Days = [];
    for (let i = 13; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const dayReadings = readings.filter(r => 
        format(new Date(r.reading_date), 'yyyy-MM-dd') === dateStr
      );
      
      const total = dayReadings.reduce((sum, r) => sum + (r[key] || 0), 0);
      
      last14Days.push({
        date: format(date, 'dd MMM', { locale: es }),
        value: total
      });
    }
    return last14Days;
  };

  const getData = () => {
    switch (activeView) {
      case 'energy':
        return prepareDailyData(energyReadings, 'consumption_kwh');
      case 'water':
        return prepareDailyData(waterReadings, 'consumption_m3');
      case 'fuel':
        return prepareDailyData(fuelReadings, 'kwh_equivalent');
      default:
        return [];
    }
  };

  const data = getData();

  const getColor = () => {
    switch (activeView) {
      case 'energy': return '#f97316';
      case 'water': return '#3b82f6';
      case 'fuel': return '#ef4444';
      default: return '#8b5cf6';
    }
  };

  const getUnit = () => {
    switch (activeView) {
      case 'energy': return 'kWh';
      case 'water': return 'm³';
      case 'fuel': return 'kWh';
      default: return '';
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-2xl font-bold text-slate-800">
            Consumos Diarios
          </CardTitle>
          <Tabs value={activeView} onValueChange={setActiveView}>
            <TabsList className="bg-slate-100">
              <TabsTrigger value="energy">Energía</TabsTrigger>
              <TabsTrigger value="water">Agua</TabsTrigger>
              <TabsTrigger value="fuel">Combustibles</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              style={{ fontSize: '11px', fontWeight: 600 }}
            />
            <YAxis 
              stroke="#64748b"
              style={{ fontSize: '11px', fontWeight: 600 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontWeight: 600
              }}
              formatter={(value) => [`${value.toFixed(2)} ${getUnit()}`, 'Consumo']}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={getColor()} 
              strokeWidth={3}
              dot={{ fill: getColor(), r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 font-semibold mb-1">Total 14 días</p>
            <p className="text-lg font-bold text-slate-800">
              {data.reduce((sum, d) => sum + d.value, 0).toFixed(1)} {getUnit()}
            </p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 font-semibold mb-1">Promedio diario</p>
            <p className="text-lg font-bold text-slate-800">
              {(data.reduce((sum, d) => sum + d.value, 0) / 14).toFixed(1)} {getUnit()}
            </p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 font-semibold mb-1">Máximo</p>
            <p className="text-lg font-bold text-slate-800">
              {Math.max(...data.map(d => d.value)).toFixed(1)} {getUnit()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
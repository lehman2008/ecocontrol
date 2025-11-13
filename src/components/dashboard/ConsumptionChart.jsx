import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ConsumptionChart({ energyReadings, waterReadings }) {
  const [activeView, setActiveView] = React.useState("energy");

  const prepareEnergyData = () => {
    return energyReadings
      .slice(0, 14)
      .reverse()
      .map(reading => ({
        date: format(new Date(reading.reading_date), "dd MMM", { locale: es }),
        consumo: reading.consumption_kwh || 0,
        produccion: reading.solar_production_kwh || 0,
      }));
  };

  const prepareWaterData = () => {
    return waterReadings
      .slice(0, 14)
      .reverse()
      .map(reading => ({
        date: format(new Date(reading.reading_date), "dd MMM", { locale: es }),
        consumo: reading.consumption_m3 || 0,
      }));
  };

  const data = activeView === "energy" ? prepareEnergyData() : prepareWaterData();

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              Tendencias de Consumo
            </CardTitle>
            <p className="text-sm text-slate-500 mt-1">Últimos 14 días de registros</p>
          </div>
          <Tabs value={activeView} onValueChange={setActiveView}>
            <TabsList className="bg-slate-100">
              <TabsTrigger value="energy" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
                Energía
              </TabsTrigger>
              <TabsTrigger value="water" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                Agua
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              style={{ fontSize: '12px', fontWeight: 600 }}
            />
            <YAxis 
              stroke="#64748b"
              style={{ fontSize: '12px', fontWeight: 600 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontWeight: 600
              }}
            />
            <Legend 
              wrapperStyle={{
                fontSize: '14px',
                fontWeight: 600
              }}
            />
            {activeView === "energy" ? (
              <>
                <Line 
                  type="monotone" 
                  dataKey="consumo" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ fill: '#f97316', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Consumo (kWh)"
                />
                <Line 
                  type="monotone" 
                  dataKey="produccion" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Producción Solar (kWh)"
                />
              </>
            ) : (
              <Line 
                type="monotone" 
                dataKey="consumo" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
                name="Consumo (m³)"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
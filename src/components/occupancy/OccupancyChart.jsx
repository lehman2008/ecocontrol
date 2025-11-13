import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function OccupancyChart({ occupancyData }) {
  const chartData = occupancyData
    .slice(0, 30)
    .reverse()
    .map(d => ({
      date: format(new Date(d.date), "dd MMM", { locale: es }),
      ocupacion: d.occupancy_percentage || 0,
      habitaciones: d.occupied_rooms || 0
    }));

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="text-2xl font-bold text-slate-800">
          Evolución de Ocupación
        </CardTitle>
        <p className="text-sm text-slate-500 mt-1">Últimos 30 días</p>
      </CardHeader>
      <CardContent className="pt-6">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorOcupacion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area 
                type="monotone" 
                dataKey="ocupacion" 
                stroke="#a855f7" 
                fillOpacity={1} 
                fill="url(#colorOcupacion)"
                name="Ocupación (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-slate-500">
            No hay datos suficientes para mostrar el gráfico
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ['#f97316', '#dc2626', '#ec4899', '#8b5cf6', '#10b981'];

export default function FuelCharts({ readings }) {
  // Preparar datos por tipo de combustible
  const byFuelType = readings.reduce((acc, r) => {
    const type = r.fuel_type || 'unknown';
    if (!acc[type]) {
      acc[type] = { name: type.replace(/_/g, ' '), kwh: 0, cost: 0, co2: 0 };
    }
    acc[type].kwh += r.kwh_equivalent || 0;
    acc[type].cost += r.cost || 0;
    acc[type].co2 += r.co2_emissions_kg || 0;
    return acc;
  }, {});

  const fuelTypeData = Object.values(byFuelType);

  // Preparar datos mensuales (últimos 6 meses)
  const monthlyData = readings
    .slice(0, 180) // Últimos 6 meses aproximadamente
    .reduce((acc, r) => {
      const date = new Date(r.reading_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, kwh: 0, cost: 0 };
      }
      acc[monthKey].kwh += r.kwh_equivalent || 0;
      acc[monthKey].cost += r.cost || 0;
      return acc;
    }, {});

  const monthlyChartData = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Distribución por Tipo */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="text-xl font-bold text-slate-800">
            Distribución por Tipo de Combustible
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {fuelTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fuelTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.kwh.toFixed(0)} kWh`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="kwh"
                >
                  {fuelTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              No hay datos suficientes para mostrar el gráfico
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evolución Mensual */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="text-xl font-bold text-slate-800">
            Evolución Mensual de Consumo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {monthlyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
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
                <Bar dataKey="kwh" fill="#f97316" name="Consumo (kWh)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              No hay datos suficientes para mostrar el gráfico
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
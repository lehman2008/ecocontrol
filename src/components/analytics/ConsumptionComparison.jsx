import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, subMonths, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";

export default function ConsumptionComparison({ energyReadings, waterReadings, fuelReadings }) {
  const [timeRange, setTimeRange] = React.useState("6months");
  
  const getMonthlyData = (months) => {
    const now = new Date();
    const monthsData = [];

    for (let i = months - 1; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthKey = format(monthStart, "yyyy-MM");
      const monthLabel = format(monthStart, "MMM yyyy", { locale: es });

      const monthEnergy = energyReadings
        .filter(r => format(new Date(r.reading_date), "yyyy-MM") === monthKey)
        .reduce((sum, r) => sum + (r.consumption_kwh || 0), 0);

      const monthWater = waterReadings
        .filter(r => format(new Date(r.reading_date), "yyyy-MM") === monthKey)
        .reduce((sum, r) => sum + (r.consumption_m3 || 0), 0);

      const monthFuel = fuelReadings
        .filter(r => format(new Date(r.reading_date), "yyyy-MM") === monthKey)
        .reduce((sum, r) => sum + (r.kwh_equivalent || 0), 0);

      monthsData.push({
        month: monthLabel,
        energia: monthEnergy,
        agua: monthWater,
        combustible: monthFuel
      });
    }

    return monthsData;
  };

  const data = getMonthlyData(timeRange === "6months" ? 6 : 12);

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-2xl font-bold text-slate-800">
            Comparativa de Consumos
          </CardTitle>
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList className="bg-slate-100">
              <TabsTrigger value="6months">6 Meses</TabsTrigger>
              <TabsTrigger value="12months">12 Meses</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
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
            <Line 
              type="monotone" 
              dataKey="energia" 
              stroke="#f97316" 
              strokeWidth={3}
              dot={{ fill: '#f97316', r: 5 }}
              name="Energía (kWh)"
            />
            <Line 
              type="monotone" 
              dataKey="agua" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              name="Agua (m³)"
            />
            <Line 
              type="monotone" 
              dataKey="combustible" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ fill: '#ef4444', r: 5 }}
              name="Combustible (kWh)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format, subMonths, subYears, startOfMonth, startOfYear } from "date-fns";
import { es } from "date-fns/locale";

export default function ConsumptionComparison({ energyReadings, waterReadings, fuelReadings }) {
  const [timeRange, setTimeRange] = React.useState("6months");
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear().toString());
  const [visibleLines, setVisibleLines] = React.useState({
    energia: true,
    agua: true,
    combustible: true
  });

  const availableYears = React.useMemo(() => {
    const years = new Set();
    [...energyReadings, ...waterReadings, ...fuelReadings].forEach(r => {
      const date = new Date(r.reading_date || r.date);
      years.add(date.getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [energyReadings, waterReadings, fuelReadings]);

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

  const getYearlyData = () => {
    const year = parseInt(selectedYear);
    const monthsData = [];

    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1);
      const monthKey = format(monthDate, "yyyy-MM");
      const monthLabel = format(monthDate, "MMM", { locale: es });

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

  const data = timeRange === "year" ? getYearlyData() : getMonthlyData(timeRange === "6months" ? 6 : 12);

  const toggleLine = (line) => {
    setVisibleLines(prev => ({...prev, [line]: !prev[line]}));
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex flex-col gap-4">
          <CardTitle className="text-2xl font-bold text-slate-800">
            Comparativa de Consumos
          </CardTitle>
          
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">Período</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px] bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6months">Últimos 6 Meses</SelectItem>
                  <SelectItem value="12months">Últimos 12 Meses</SelectItem>
                  <SelectItem value="year">Por Año</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {timeRange === "year" && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-600">Año</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[120px] bg-slate-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex-1">
              <Label className="text-xs font-semibold text-slate-600 mb-2 block">Métricas Visibles</Label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="energia"
                    checked={visibleLines.energia}
                    onCheckedChange={() => toggleLine('energia')}
                  />
                  <label htmlFor="energia" className="text-sm font-medium cursor-pointer flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    Energía (kWh)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agua"
                    checked={visibleLines.agua}
                    onCheckedChange={() => toggleLine('agua')}
                  />
                  <label htmlFor="agua" className="text-sm font-medium cursor-pointer flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    Agua (m³)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="combustible"
                    checked={visibleLines.combustible}
                    onCheckedChange={() => toggleLine('combustible')}
                  />
                  <label htmlFor="combustible" className="text-sm font-medium cursor-pointer flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    Combustible (kWh)
                  </label>
                </div>
              </div>
            </div>
          </div>
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
            {visibleLines.energia && (
              <Line 
                type="monotone" 
                dataKey="energia" 
                stroke="#f97316" 
                strokeWidth={3}
                dot={{ fill: '#f97316', r: 5 }}
                name="Energía (kWh)"
              />
            )}
            {visibleLines.agua && (
              <Line 
                type="monotone" 
                dataKey="agua" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                name="Agua (m³)"
              />
            )}
            {visibleLines.combustible && (
              <Line 
                type="monotone" 
                dataKey="combustible" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', r: 5 }}
                name="Combustible (kWh)"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
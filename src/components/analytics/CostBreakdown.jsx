import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Euro } from "lucide-react";

const COLORS = ['#f97316', '#3b82f6', '#ef4444', '#8b5cf6'];

export default function CostBreakdown({ energyReadings, waterReadings, fuelReadings }) {
  const last30Days = {
    energy: energyReadings.slice(0, 30),
    water: waterReadings.slice(0, 30),
    fuel: fuelReadings.slice(0, 30)
  };

  const costData = [
    {
      name: 'Energía',
      value: last30Days.energy.reduce((sum, e) => sum + (e.cost_estimate || 0), 0),
      color: '#f97316'
    },
    {
      name: 'Agua',
      value: last30Days.water.reduce((sum, w) => sum + (w.cost_estimate || 0), 0),
      color: '#3b82f6'
    },
    {
      name: 'Combustibles',
      value: last30Days.fuel.reduce((sum, f) => sum + (f.cost || 0), 0),
      color: '#ef4444'
    }
  ].filter(item => item.value > 0);

  const totalCost = costData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Euro className="w-6 h-6 text-green-500" />
          Desglose de Costes
        </CardTitle>
        <p className="text-sm text-slate-500 mt-1">Últimos 30 días</p>
      </CardHeader>
      <CardContent className="pt-6">
        {costData.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No hay datos de costes disponibles
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={costData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${((entry.value / totalCost) * 100).toFixed(1)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${value.toFixed(2)} €`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontWeight: 600
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-6 space-y-3">
              {costData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-slate-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{item.value.toFixed(2)} €</p>
                    <p className="text-xs text-slate-500">
                      {((item.value / totalCost) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 mt-4">
                <span className="font-bold text-lg text-green-800">Total</span>
                <span className="font-bold text-2xl text-green-900">{totalCost.toFixed(2)} €</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
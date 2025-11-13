import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Home, TrendingUp, Calendar } from "lucide-react";

export default function OccupancyStats({ occupancyData }) {
  const last30Days = occupancyData.slice(0, 30);
  
  const avgOccupancy = last30Days.length > 0
    ? last30Days.reduce((sum, d) => sum + (d.occupancy_percentage || 0), 0) / last30Days.length
    : 0;

  const totalGuests = last30Days.reduce((sum, d) => sum + (d.guests_count || 0), 0);
  const avgGuestsPerDay = last30Days.length > 0 ? totalGuests / last30Days.length : 0;

  const totalRoomsOccupied = last30Days.reduce((sum, d) => sum + (d.occupied_rooms || 0), 0);
  const totalRestaurantCovers = last30Days.reduce((sum, d) => sum + (d.restaurant_covers || 0), 0);

  const stats = [
    {
      title: "Ocupación Media",
      value: `${avgOccupancy.toFixed(1)}%`,
      subtitle: "Últimos 30 días",
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Huéspedes Totales",
      value: totalGuests.toString(),
      subtitle: `${avgGuestsPerDay.toFixed(0)} promedio/día`,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Habitaciones Ocupadas",
      value: totalRoomsOccupied.toString(),
      subtitle: "Últimos 30 días",
      icon: Home,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Comensales",
      value: totalRestaurantCovers.toString(),
      subtitle: "Restaurante 30 días",
      icon: Calendar,
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur overflow-hidden">
          <div className={`h-1 bg-gradient-to-r ${stat.gradient}`} />
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-slate-800">
                  {stat.value}
                </h3>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
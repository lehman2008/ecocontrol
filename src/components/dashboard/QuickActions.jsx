import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Zap, Droplets, Wrench, Plus, Flame, Waves } from "lucide-react";

const actions = [
  {
    title: "Nueva Lectura de Energía",
    description: "Registrar consumo eléctrico",
    icon: Zap,
    url: createPageUrl("Energy"),
    gradient: "from-amber-500 to-orange-500"
  },
  {
    title: "Nueva Lectura de Agua",
    description: "Registrar consumo de agua/ACS",
    icon: Droplets,
    url: createPageUrl("Water"),
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Registrar Combustible",
    description: "Gas natural, propano, gasóleo",
    icon: Flame,
    url: createPageUrl("Fuel"),
    gradient: "from-orange-500 to-red-600"
  },
  {
    title: "Medición de Piscina",
    description: "Control de calidad del agua",
    icon: Waves,
    url: createPageUrl("Pool"),
    gradient: "from-cyan-500 to-teal-500"
  },
  {
    title: "Nueva Tarea de Mantenimiento",
    description: "Crear mantenimiento preventivo",
    icon: Wrench,
    url: createPageUrl("Maintenance"),
    gradient: "from-green-500 to-emerald-500"
  },
  {
    title: "Registrar Equipo",
    description: "Añadir al inventario",
    icon: Plus,
    url: createPageUrl("Equipment"),
    gradient: "from-purple-500 to-pink-500"
  }
];

export default function QuickActions() {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map((action, index) => (
            <Link key={index} to={action.url}>
              <div className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-800 mb-1 line-clamp-2">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
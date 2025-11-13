import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Calendar, Clock, AlertTriangle } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Gestión de Mantenimientos
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Planificación y seguimiento de tareas preventivas y correctivas
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardContent className="pt-12 pb-12">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-xl">
                <Wrench className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Módulo de Mantenimientos
              </h2>
              <p className="text-slate-600 mb-8">
                Esta sección incluirá la gestión completa de:
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <h3 className="font-bold text-green-800">Mantenimiento Preventivo</h3>
                  </div>
                  <p className="text-sm text-green-700">Calendario automático, checklist digitales y planificación</p>
                </div>
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="font-bold text-red-800">Mantenimiento Correctivo</h3>
                  </div>
                  <p className="text-sm text-red-700">Incidencias, tickets y seguimiento de reparaciones</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-blue-800">Mantenimientos Legales</h3>
                  </div>
                  <p className="text-sm text-blue-700">Legionela, contraincendios, ascensores y certificaciones</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Wrench className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-purple-800">Historial de Equipos</h3>
                  </div>
                  <p className="text-sm text-purple-700">Registro completo de intervenciones y costes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

export default function UpcomingMaintenance({ tasks }) {
  const upcomingTasks = tasks
    .filter(t => t.status === 'pendiente')
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
    .slice(0, 5);

  const getDaysUntil = (date) => {
    return differenceInDays(new Date(date), new Date());
  };

  const getUrgencyColor = (days) => {
    if (days < 0) return 'bg-red-100 text-red-700 border-red-200';
    if (days === 0) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (days <= 3) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            Próximos Mantenimientos
          </CardTitle>
          <Link to={createPageUrl("Maintenance")}>
            <ArrowRight className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {upcomingTasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Sin tareas programadas</p>
            <p className="text-xs text-slate-500 mt-1">No hay mantenimientos pendientes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingTasks.map((task) => {
              const daysUntil = getDaysUntil(task.scheduled_date);
              return (
                <div 
                  key={task.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-sm text-slate-800 line-clamp-2">{task.title}</h4>
                    {task.legal_requirement && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs flex-shrink-0">
                        Legal
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(task.scheduled_date), "dd MMM yyyy", { locale: es })}
                    </span>
                    <Badge 
                      variant="outline"
                      className={`${getUrgencyColor(daysUntil)} border text-xs font-bold`}
                    >
                      {daysUntil < 0 ? 'Vencido' : 
                       daysUntil === 0 ? 'Hoy' : 
                       daysUntil === 1 ? 'Mañana' : 
                       `${daysUntil} días`}
                    </Badge>
                  </div>
                  {task.equipment_name && (
                    <p className="text-xs text-slate-500 mt-2 truncate">
                      Equipo: {task.equipment_name}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
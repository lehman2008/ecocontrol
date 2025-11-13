import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";

export default function TaskCalendar({ tasks, onTaskClick }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Obtener el día de inicio de la semana (0 = domingo, 1 = lunes, etc.)
  const startDayOfWeek = monthStart.getDay();
  const emptyDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Ajustar para que lunes sea el primer día

  const getTasksForDay = (day) => {
    return tasks.filter(task => 
      isSameDay(new Date(task.scheduled_date), day)
    );
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-green-500" />
            Calendario de Mantenimientos
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-[200px] text-center">
              <p className="text-lg font-bold text-slate-800">
                {format(currentMonth, "MMMM yyyy", { locale: es })}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
            <div key={day} className="text-center font-bold text-sm text-slate-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-2">
          {/* Días vacíos al inicio */}
          {Array.from({ length: emptyDays }).map((_, idx) => (
            <div key={`empty-${idx}`} className="aspect-square" />
          ))}

          {/* Días del mes */}
          {daysInMonth.map(day => {
            const dayTasks = getTasksForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`
                  aspect-square p-2 rounded-lg border transition-all
                  ${isTodayDay ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-white'}
                  ${!isCurrentMonth ? 'opacity-40' : ''}
                  hover:shadow-md hover:border-slate-300
                `}
              >
                <div className="h-full flex flex-col">
                  <div className={`text-sm font-semibold mb-1 ${isTodayDay ? 'text-green-700' : 'text-slate-700'}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="flex-1 space-y-1 overflow-y-auto">
                    {dayTasks.slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className={`
                          text-xs p-1 rounded cursor-pointer transition-colors
                          ${task.priority === 'urgente' ? 'bg-red-100 hover:bg-red-200 text-red-800' :
                            task.priority === 'alta' ? 'bg-orange-100 hover:bg-orange-200 text-orange-800' :
                            'bg-blue-100 hover:bg-blue-200 text-blue-800'}
                        `}
                      >
                        <p className="line-clamp-1 font-medium">{task.title}</p>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <p className="text-xs text-slate-500 font-medium text-center">
                        +{dayTasks.length - 3} más
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leyenda */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded" />
              <span className="text-sm text-slate-600">Urgente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded" />
              <span className="text-sm text-slate-600">Alta prioridad</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded" />
              <span className="text-sm text-slate-600">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 border-2 border-green-500 rounded" />
              <span className="text-sm text-slate-600">Hoy</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
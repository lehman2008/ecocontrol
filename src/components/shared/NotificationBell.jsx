import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function NotificationBell() {
  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => base44.entities.Alert.list('-created_date', 100),
    refetchInterval: 30000, // Refetch cada 30 segundos
  });

  const unreadAlerts = alerts.filter(a => !a.is_read && !a.is_resolved);
  const criticalUnread = unreadAlerts.filter(a => a.severity === 'critical');
  const recentAlerts = unreadAlerts.slice(0, 5);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadAlerts.length > 0 && (
            <Badge 
              className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs ${
                criticalUnread.length > 0 
                  ? 'bg-red-600' 
                  : 'bg-orange-600'
              }`}
            >
              {unreadAlerts.length > 9 ? '9+' : unreadAlerts.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Notificaciones</h3>
            {unreadAlerts.length > 0 && (
              <Badge variant="secondary">{unreadAlerts.length} nuevas</Badge>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {recentAlerts.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No hay notificaciones nuevas</p>
            </div>
          ) : (
            <div className="divide-y">
              {recentAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 hover:bg-slate-50 transition-colors ${
                    alert.severity === 'critical' ? 'bg-red-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {alert.severity === 'critical' && (
                      <Badge className="bg-red-600 text-xs">Crítica</Badge>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800 mb-1">
                        {alert.title}
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-1">
                        {alert.message}
                      </p>
                      <p className="text-xs text-slate-400">
                        {format(new Date(alert.created_date), "dd MMM HH:mm", { locale: es })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t bg-slate-50">
          <Link to={createPageUrl("Alerts")}>
            <Button variant="ghost" className="w-full text-sm">
              Ver todas las alertas
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
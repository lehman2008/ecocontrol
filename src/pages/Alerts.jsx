import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bell, Settings as SettingsIcon } from "lucide-react";
import AlertList from "../components/alerts/AlertList";
import AlertStats from "../components/alerts/AlertStats";
import AlertSettings from "../components/alerts/AlertSettings";

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState("unread");
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => base44.entities.Alert.list('-created_date'),
  });

  const { data: alertConfigs = [] } = useQuery({
    queryKey: ['alertConfigs', user?.email],
    queryFn: () => base44.entities.AlertConfig.filter({ user_email: user?.email }),
    enabled: !!user?.email,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (alertId) => base44.entities.Alert.update(alertId, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  const resolveAlertMutation = useMutation({
    mutationFn: ({ alertId, notes }) => 
      base44.entities.Alert.update(alertId, {
        is_resolved: true,
        resolved_date: new Date().toISOString(),
        resolved_by: user?.email,
        resolution_notes: notes
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  const unreadAlerts = alerts.filter(a => !a.is_read && !a.is_resolved);
  const unresolvedAlerts = alerts.filter(a => !a.is_resolved);
  const resolvedAlerts = alerts.filter(a => a.is_resolved);
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.is_resolved);

  const handleMarkAsRead = (alertId) => {
    markAsReadMutation.mutate(alertId);
  };

  const handleResolve = (alertId, notes) => {
    resolveAlertMutation.mutate({ alertId, notes });
  };

  const handleMarkAllAsRead = async () => {
    for (const alert of unreadAlerts) {
      await markAsReadMutation.mutateAsync(alert.id);
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Alertas y Notificaciones
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Sistema de alertas inteligente y configuración de notificaciones
            </p>
          </div>
          {unreadAlerts.length > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              className="gap-2"
            >
              Marcar todas como leídas
            </Button>
          )}
        </div>

        <AlertStats 
          total={alerts.length}
          unread={unreadAlerts.length}
          unresolved={unresolvedAlerts.length}
          critical={criticalAlerts.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100">
            <TabsTrigger value="unread" className="gap-2">
              <Bell className="w-4 h-4" />
              Sin Leer ({unreadAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="unresolved">
              Activas ({unresolvedAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resueltas ({resolvedAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <SettingsIcon className="w-4 h-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="mt-6">
            <AlertList 
              alerts={unreadAlerts}
              onMarkAsRead={handleMarkAsRead}
              onResolve={handleResolve}
            />
          </TabsContent>

          <TabsContent value="unresolved" className="mt-6">
            <AlertList 
              alerts={unresolvedAlerts}
              onMarkAsRead={handleMarkAsRead}
              onResolve={handleResolve}
            />
          </TabsContent>

          <TabsContent value="resolved" className="mt-6">
            <AlertList 
              alerts={resolvedAlerts}
              showResolution={true}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <AlertSettings 
              configs={alertConfigs}
              userEmail={user?.email}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
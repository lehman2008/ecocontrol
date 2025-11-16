import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { 
  BarChart3,
  Settings,
  GripVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import DashboardMetrics from "../components/dashboard/DashboardMetrics";
import QuickActions from "../components/dashboard/QuickActions";
import SystemOverview from "../components/dashboard/SystemOverview";
import UpcomingMaintenance from "../components/dashboard/UpcomingMaintenance";
import RecentAlerts from "../components/dashboard/RecentAlerts";
import ConsumptionWidget from "../components/dashboard/ConsumptionWidget";
import EquipmentStatus from "../components/dashboard/EquipmentStatus";
import DashboardCustomizer from "../components/dashboard/DashboardCustomizer";

const DEFAULT_WIDGETS = [
  { id: "metrics", title: "Métricas Principales", description: "KPIs y estadísticas clave", enabled: true },
  { id: "quickActions", title: "Acciones Rápidas", description: "Accesos directos a funciones comunes", enabled: true },
  { id: "systemOverview", title: "Resumen del Sistema", description: "Estado de equipos y tareas", enabled: true },
  { id: "consumption", title: "Consumos", description: "Gráfico de consumos energéticos", enabled: true },
  { id: "equipmentStatus", title: "Equipos Críticos", description: "Estado de equipos prioritarios", enabled: true },
  { id: "upcomingMaintenance", title: "Próximos Mantenimientos", description: "Tareas de mantenimiento programadas", enabled: true },
  { id: "recentAlerts", title: "Alertas Recientes", description: "Notificaciones y alertas del sistema", enabled: true },
];

export default function Dashboard() {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [widgets, setWidgets] = useState(DEFAULT_WIDGETS);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const { data: energyReadings = [] } = useQuery({
    queryKey: ['energyReadings'],
    queryFn: () => base44.entities.EnergyReading.list('-reading_date', 50),
    retry: 1,
  });

  const { data: waterReadings = [] } = useQuery({
    queryKey: ['waterReadings'],
    queryFn: () => base44.entities.WaterReading.list('-reading_date', 50),
    retry: 1,
  });

  const { data: fuelReadings = [] } = useQuery({
    queryKey: ['gasConsumption'],
    queryFn: () => base44.entities.GasConsumption.list('-reading_date', 50),
    retry: 1,
  });

  const { data: poolMeasurements = [] } = useQuery({
    queryKey: ['poolMeasurements'],
    queryFn: () => base44.entities.PoolMeasurement.list('-measurement_date', 20),
    retry: 1,
  });

  const { data: equipment = [] } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => base44.entities.Equipment.list(),
    retry: 1,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['maintenanceTasks'],
    queryFn: () => base44.entities.MaintenanceTask.list('-scheduled_date'),
    retry: 1,
  });

  const { data: occupancyData = [] } = useQuery({
    queryKey: ['occupancyData'],
    queryFn: () => base44.entities.OccupancyData.list('-date', 30),
    retry: 1,
  });

  const updateLayoutMutation = useMutation({
    mutationFn: (layout) => base44.auth.updateMe({ dashboard_layout: layout }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    retry: 1,
  });

  useEffect(() => {
    if (user?.dashboard_layout && user.dashboard_layout.length > 0) {
      const savedLayout = user.dashboard_layout;
      const updatedWidgets = DEFAULT_WIDGETS.map(widget => {
        const saved = savedLayout.find(s => s.id === widget.id);
        return saved ? { ...widget, enabled: saved.enabled } : widget;
      });
      
      const orderedWidgets = savedLayout
        .map(s => updatedWidgets.find(w => w.id === s.id))
        .filter(Boolean)
        .concat(updatedWidgets.filter(w => !savedLayout.find(s => s.id === w.id)));
      
      setWidgets(orderedWidgets);
    }
  }, [user]);

  const handleToggleWidget = (widgetId) => {
    const updatedWidgets = widgets.map(w =>
      w.id === widgetId ? { ...w, enabled: !w.enabled } : w
    );
    setWidgets(updatedWidgets);
    updateLayoutMutation.mutate(updatedWidgets.map(w => ({ id: w.id, enabled: w.enabled })));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
    updateLayoutMutation.mutate(items.map(w => ({ id: w.id, enabled: w.enabled })));
  };

  const renderWidget = (widget, index) => {
    if (!widget.enabled) return null;

    const widgetComponents = {
      metrics: (
        <DashboardMetrics 
          energyReadings={energyReadings}
          waterReadings={waterReadings}
          fuelReadings={fuelReadings}
          equipment={equipment}
          tasks={tasks}
          occupancyData={occupancyData}
        />
      ),
      quickActions: <QuickActions />,
      systemOverview: (
        <SystemOverview 
          equipment={equipment}
          tasks={tasks}
          poolMeasurements={poolMeasurements}
        />
      ),
      consumption: (
        <ConsumptionWidget
          energyReadings={energyReadings}
          waterReadings={waterReadings}
          fuelReadings={fuelReadings}
        />
      ),
      equipmentStatus: <EquipmentStatus equipment={equipment} />,
      upcomingMaintenance: <UpcomingMaintenance tasks={tasks} />,
      recentAlerts: (
        <RecentAlerts 
          equipment={equipment}
          tasks={tasks}
          poolMeasurements={poolMeasurements}
        />
      ),
    };

    return (
      <Draggable key={widget.id} draggableId={widget.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`${snapshot.isDragging ? 'opacity-50' : ''}`}
          >
            <div className="relative group">
              <div 
                {...provided.dragHandleProps}
                className="absolute -left-8 top-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-move z-10"
              >
                <GripVertical className="w-5 h-5 text-slate-400" />
              </div>
              {widgetComponents[widget.id]}
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
              Panel de Control
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Vista general del sistema de mantenimiento
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCustomizer(!showCustomizer)}
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              Personalizar
            </Button>
            <Link to={createPageUrl("Analytics")}>
              <Button variant="outline" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Ver Analíticas
              </Button>
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {showCustomizer && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DashboardCustomizer
                widgets={widgets}
                onToggleWidget={handleToggleWidget}
                onClose={() => setShowCustomizer(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="dashboard">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-6 pl-8"
              >
                {widgets.map((widget, index) => renderWidget(widget, index))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
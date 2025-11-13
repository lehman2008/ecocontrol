import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import MaintenanceStats from "../components/maintenance/MaintenanceStats";
import PreventiveTaskForm from "../components/maintenance/PreventiveTaskForm";
import TaskList from "../components/maintenance/TaskList";
import TaskCalendar from "../components/maintenance/TaskCalendar";
import TaskExecutionModal from "../components/maintenance/TaskExecutionModal";

export default function MaintenancePage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [executingTask, setExecutingTask] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['maintenanceTasks'],
    queryFn: () => base44.entities.MaintenanceTask.list('-scheduled_date'),
  });

  const { data: equipment = [] } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => base44.entities.Equipment.list('name'),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list('full_name'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.MaintenanceTask.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceTasks'] });
      setShowForm(false);
      setEditingTask(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MaintenanceTask.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceTasks'] });
      setShowForm(false);
      setEditingTask(null);
      setExecutingTask(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleExecute = (task) => {
    setExecutingTask(task);
  };

  const handleCompleteTask = (taskId, executionData) => {
    updateMutation.mutate({ 
      id: taskId, 
      data: {
        ...executionData,
        status: 'completada',
        completed_date: new Date().toISOString()
      }
    });
  };

  const pendingTasks = tasks.filter(t => t.status === 'pendiente');
  const inProgressTasks = tasks.filter(t => t.status === 'en_proceso');
  const completedTasks = tasks.filter(t => t.status === 'completada');

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Gestión de Mantenimientos
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Planificación y seguimiento de tareas preventivas y correctivas
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingTask(null);
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Tarea Preventiva
          </Button>
        </div>

        {/* Stats */}
        <MaintenanceStats 
          tasks={tasks}
          pendingCount={pendingTasks.length}
          inProgressCount={inProgressTasks.length}
          completedCount={completedTasks.length}
        />

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PreventiveTaskForm
                task={editingTask}
                equipment={equipment}
                users={users}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
                isLoading={createMutation.isPending || updateMutation.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100">
            <TabsTrigger value="pending">
              Pendientes ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="inProgress">
              En Proceso ({inProgressTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completadas ({completedTasks.length})
            </TabsTrigger>
            <TabsTrigger value="calendar">
              Calendario
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <TaskList 
              tasks={pendingTasks}
              isLoading={isLoading}
              onEdit={handleEdit}
              onExecute={handleExecute}
            />
          </TabsContent>

          <TabsContent value="inProgress" className="mt-6">
            <TaskList 
              tasks={inProgressTasks}
              isLoading={isLoading}
              onEdit={handleEdit}
              onExecute={handleExecute}
            />
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <TaskList 
              tasks={completedTasks}
              isLoading={isLoading}
              onEdit={handleEdit}
              showCompletionDetails={true}
            />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <TaskCalendar 
              tasks={tasks}
              onTaskClick={handleExecute}
            />
          </TabsContent>
        </Tabs>

        {/* Task Execution Modal */}
        {executingTask && (
          <TaskExecutionModal
            task={executingTask}
            onClose={() => setExecutingTask(null)}
            onComplete={handleCompleteTask}
            isLoading={updateMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}
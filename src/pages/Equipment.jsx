import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EquipmentForm from "../components/equipment/EquipmentForm";
import EquipmentList from "../components/equipment/EquipmentList";
import EquipmentStats from "../components/equipment/EquipmentStats";
import EquipmentByZone from "../components/equipment/EquipmentByZone";

export default function EquipmentPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const queryClient = useQueryClient();

  const { data: equipment = [], isLoading } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => base44.entities.Equipment.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Equipment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      setShowForm(false);
      setEditingEquipment(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Equipment.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      setShowForm(false);
      setEditingEquipment(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingEquipment) {
      updateMutation.mutate({ id: editingEquipment.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (equip) => {
    setEditingEquipment(equip);
    setShowForm(true);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Inventario de Equipos
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Gestión completa de maquinaria e instalaciones del hotel
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingEquipment(null);
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Equipo
          </Button>
        </div>

        {/* Stats */}
        <EquipmentStats equipment={equipment} />

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <EquipmentForm
                equipment={editingEquipment}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingEquipment(null);
                }}
                isLoading={createMutation.isPending || updateMutation.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100">
            <TabsTrigger value="all">Todos los Equipos</TabsTrigger>
            <TabsTrigger value="byZone">Por Zona</TabsTrigger>
            <TabsTrigger value="maintenance">Mantenimientos</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <EquipmentList 
              equipment={equipment}
              isLoading={isLoading}
              onEdit={handleEdit}
            />
          </TabsContent>

          <TabsContent value="byZone" className="mt-6">
            <EquipmentByZone equipment={equipment} isLoading={isLoading} onEdit={handleEdit} />
          </TabsContent>

          <TabsContent value="maintenance" className="mt-6">
            <div className="text-center py-12 text-slate-500">
              Vista de planificación de mantenimientos próximamente
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
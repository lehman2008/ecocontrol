import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EnergyForm from "../components/energy/EnergyForm";
import EnergyList from "../components/energy/EnergyList";
import EnergyStats from "../components/energy/EnergyStats";

export default function EnergyPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingReading, setEditingReading] = useState(null);
  const queryClient = useQueryClient();

  const { data: readings = [], isLoading } = useQuery({
    queryKey: ['energyReadings'],
    queryFn: () => base44.entities.EnergyReading.list('-reading_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.EnergyReading.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['energyReadings'] });
      setShowForm(false);
      setEditingReading(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.EnergyReading.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['energyReadings'] });
      setShowForm(false);
      setEditingReading(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingReading) {
      updateMutation.mutate({ id: editingReading.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (reading) => {
    setEditingReading(reading);
    setShowForm(true);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Gestión de Energía
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Control de consumo eléctrico y producción fotovoltaica
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingReading(null);
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Lectura
          </Button>
        </div>

        {/* Stats */}
        <EnergyStats readings={readings} />

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <EnergyForm
                reading={editingReading}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingReading(null);
                }}
                isLoading={createMutation.isPending || updateMutation.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* List */}
        <EnergyList 
          readings={readings}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
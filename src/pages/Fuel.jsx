import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FuelForm from "../components/fuel/FuelForm";
import FuelList from "../components/fuel/FuelList";
import FuelStats from "../components/fuel/FuelStats";
import FuelCharts from "../components/fuel/FuelCharts";

export default function FuelPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingReading, setEditingReading] = useState(null);
  const queryClient = useQueryClient();

  const { data: readings = [], isLoading } = useQuery({
    queryKey: ['gasConsumption'],
    queryFn: () => base44.entities.GasConsumption.list('-reading_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.GasConsumption.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gasConsumption'] });
      setShowForm(false);
      setEditingReading(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.GasConsumption.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gasConsumption'] });
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Gases y Combustibles
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Control de gas natural, propano, butano, gasóleo y biomasa
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingReading(null);
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Lectura
          </Button>
        </div>

        {/* Stats */}
        <FuelStats readings={readings} />

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FuelForm
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

        {/* Charts */}
        <FuelCharts readings={readings} />

        {/* List */}
        <FuelList 
          readings={readings}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
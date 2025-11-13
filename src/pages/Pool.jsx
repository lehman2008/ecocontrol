import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Waves } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PoolForm from "../components/pool/PoolForm";
import PoolList from "../components/pool/PoolList";
import PoolStats from "../components/pool/PoolStats";

export default function PoolPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const queryClient = useQueryClient();

  const { data: measurements = [], isLoading } = useQuery({
    queryKey: ['poolMeasurements'],
    queryFn: () => base44.entities.PoolMeasurement.list('-measurement_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PoolMeasurement.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['poolMeasurements'] });
      setShowForm(false);
      setEditingMeasurement(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PoolMeasurement.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['poolMeasurements'] });
      setShowForm(false);
      setEditingMeasurement(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingMeasurement) {
      updateMutation.mutate({ id: editingMeasurement.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (measurement) => {
    setEditingMeasurement(measurement);
    setShowForm(true);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-teal-500 to-blue-500 bg-clip-text text-transparent">
              Control de Piscinas
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Mediciones de calidad del agua según el sistema SILOÉ
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingMeasurement(null);
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-500 hover:to-teal-600 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Medición
          </Button>
        </div>

        {/* Stats */}
        <PoolStats measurements={measurements} />

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PoolForm
                measurement={editingMeasurement}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingMeasurement(null);
                }}
                isLoading={createMutation.isPending || updateMutation.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* List */}
        <PoolList 
          measurements={measurements}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
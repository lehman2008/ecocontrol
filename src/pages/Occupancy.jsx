import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OccupancyForm from "../components/occupancy/OccupancyForm";
import OccupancyList from "../components/occupancy/OccupancyList";
import OccupancyStats from "../components/occupancy/OccupancyStats";
import OccupancyChart from "../components/occupancy/OccupancyChart";

export default function OccupancyPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const queryClient = useQueryClient();

  const { data: occupancyData = [], isLoading } = useQuery({
    queryKey: ['occupancyData'],
    queryFn: () => base44.entities.OccupancyData.list('-date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.OccupancyData.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['occupancyData'] });
      setShowForm(false);
      setEditingRecord(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.OccupancyData.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['occupancyData'] });
      setShowForm(false);
      setEditingRecord(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingRecord) {
      updateMutation.mutate({ id: editingRecord.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Control de Ocupación
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Registro diario de ocupación para cálculo de KPIs
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingRecord(null);
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Registrar Ocupación
          </Button>
        </div>

        {/* Stats */}
        <OccupancyStats occupancyData={occupancyData} />

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <OccupancyForm
                record={editingRecord}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingRecord(null);
                }}
                isLoading={createMutation.isPending || updateMutation.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chart */}
        <OccupancyChart occupancyData={occupancyData} />

        {/* List */}
        <OccupancyList 
          occupancyData={occupancyData}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Droplets, Book } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WaterForm from "../components/water/WaterForm";
import WaterList from "../components/water/WaterList";
import WaterStats from "../components/water/WaterStats";
import WaterRegulationFAQ from "../components/water/WaterRegulationFAQ";

export default function WaterPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingReading, setEditingReading] = useState(null);
  const [activeTab, setActiveTab] = useState("readings");
  const queryClient = useQueryClient();

  const { data: readings = [], isLoading } = useQuery({
    queryKey: ['waterReadings'],
    queryFn: () => base44.entities.WaterReading.list('-reading_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.WaterReading.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waterReadings'] });
      setShowForm(false);
      setEditingReading(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.WaterReading.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waterReadings'] });
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
              Gestión de Agua y ACS
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Control de consumo de agua fría, caliente y calderas
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingReading(null);
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Lectura
          </Button>
        </div>

        {/* Stats */}
        <WaterStats readings={readings} />

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <WaterForm
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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100">
            <TabsTrigger value="readings">Lecturas</TabsTrigger>
            <TabsTrigger value="regulation" className="gap-2">
              <Book className="w-4 h-4" />
              Normativa y FAQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="readings" className="mt-6">
            <WaterList 
              readings={readings}
              isLoading={isLoading}
              onEdit={handleEdit}
            />
          </TabsContent>

          <TabsContent value="regulation" className="mt-6">
            <WaterRegulationFAQ />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PoolForm from "../components/pool/PoolForm";
import PoolStats from "../components/pool/PoolStats";
import PoolList from "../components/pool/PoolList";
import PoolComplianceReport from "../components/pool/PoolComplianceReport";

export default function PoolPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [activeTab, setActiveTab] = useState("measurements");
  const queryClient = useQueryClient();

  const { data: measurements = [], isLoading } = useQuery({
    queryKey: ['poolMeasurements'],
    queryFn: () => base44.entities.PoolMeasurement.list('-measurement_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PoolMeasurement.create(data),
    onSuccess: async (newMeasurement) => {
      queryClient.invalidateQueries({ queryKey: ['poolMeasurement'] });
      setShowForm(false);
      setEditingMeasurement(null);

      // Crear alerta si no cumple normativa
      if (!newMeasurement.complies_with_rd742) {
        await base44.entities.Alert.create({
          alert_type: 'pool_chemistry_alert',
          severity: newMeasurement.status === 'no_apto' ? 'critical' : 'warning',
          title: `Piscina ${newMeasurement.pool_name}: No cumple RD 742/2013`,
          message: `La medición realizada presenta incumplimientos normativos: ${newMeasurement.non_compliant_parameters?.join(', ')}`,
          related_entity_type: 'pool_measurement',
          related_entity_id: newMeasurement.id,
          related_entity_name: newMeasurement.pool_name,
          zone: newMeasurement.pool_name
        });
      }
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-teal-500 to-blue-500 bg-clip-text text-transparent">
              Control de Piscinas (Siolé)
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Gestión según RD 742/2013 - Criterios técnico-sanitarios
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

        <PoolStats measurements={measurements} />

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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100">
            <TabsTrigger value="measurements">Historial</TabsTrigger>
            <TabsTrigger value="compliance" className="gap-2">
              <FileText className="w-4 h-4" />
              Informe Cumplimiento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="measurements" className="mt-6">
            <PoolList 
              measurements={measurements}
              isLoading={isLoading}
              onEdit={handleEdit}
            />
          </TabsContent>

          <TabsContent value="compliance" className="mt-6">
            <PoolComplianceReport measurements={measurements} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
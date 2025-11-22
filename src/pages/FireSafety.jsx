import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Flame, Book } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FireSafetyForm from "../components/firesafety/FireSafetyForm";
import FireSafetyStats from "../components/firesafety/FireSafetyStats";
import FireSafetyList from "../components/firesafety/FireSafetyList";
import FireSafetyRegulationFAQ from "../components/firesafety/FireSafetyRegulationFAQ";

export default function FireSafetyPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [activeTab, setActiveTab] = useState("inspections");
  const queryClient = useQueryClient();

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['fireSafety'],
    queryFn: () => base44.entities.FireSafety.list('-inspection_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.FireSafety.create(data),
    onSuccess: async (newRecord) => {
      queryClient.invalidateQueries({ queryKey: ['fireSafety'] });
      setShowForm(false);
      setEditingRecord(null);

      // Crear alerta si no cumple normativa o tiene problemas
      if (!newRecord.complies_regulations || newRecord.status === 'defectuoso') {
        await base44.entities.Alert.create({
          alert_type: 'equipment_failure',
          severity: newRecord.status === 'defectuoso' ? 'critical' : 'warning',
          title: `Sistema Contra Incendios: ${newRecord.equipment_type}`,
          message: `Incumplimiento detectado en ${newRecord.location}: ${newRecord.defects_found || 'Estado defectuoso'}`,
          related_entity_type: 'fire_safety',
          related_entity_id: newRecord.id,
          related_entity_name: newRecord.equipment_code || newRecord.equipment_type,
          zone: newRecord.zone
        });
      }

      // Alerta si próxima inspección cercana (30 días)
      if (newRecord.next_inspection_date) {
        const daysUntil = Math.floor((new Date(newRecord.next_inspection_date) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysUntil <= 30 && daysUntil >= 0) {
          await base44.entities.Alert.create({
            alert_type: 'maintenance_due',
            severity: daysUntil <= 7 ? 'warning' : 'info',
            title: `Inspección Contra Incendios Próxima`,
            message: `El equipo ${newRecord.equipment_code || newRecord.equipment_type} en ${newRecord.location} requiere inspección en ${daysUntil} días`,
            related_entity_type: 'fire_safety',
            related_entity_id: newRecord.id,
            related_entity_name: newRecord.equipment_code || newRecord.equipment_type,
            zone: newRecord.zone
          });
        }
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.FireSafety.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fireSafety'] });
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Sistema Contra Incendios
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Inspecciones y mantenimiento según normativa vigente
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingRecord(null);
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Inspección
          </Button>
        </div>

        <FireSafetyStats records={records} />

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FireSafetyForm
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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100">
            <TabsTrigger value="inspections">Inspecciones</TabsTrigger>
            <TabsTrigger value="regulation" className="gap-2">
              <Book className="w-4 h-4" />
              Normativa y FAQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inspections" className="mt-6">
            <FireSafetyList 
              records={records}
              isLoading={isLoading}
              onEdit={handleEdit}
            />
          </TabsContent>

          <TabsContent value="regulation" className="mt-6">
            <FireSafetyRegulationFAQ />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
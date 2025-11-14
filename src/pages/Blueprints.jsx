import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BlueprintUpload from "../components/blueprints/BlueprintUpload";
import BlueprintList from "../components/blueprints/BlueprintList";
import BlueprintViewer from "../components/blueprints/BlueprintViewer";

export default function BlueprintsPage() {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);
  const [activeTab, setActiveTab] = useState("list");
  const queryClient = useQueryClient();

  const { data: blueprints = [], isLoading } = useQuery({
    queryKey: ['blueprints'],
    queryFn: () => base44.entities.Blueprint.list('-created_date'),
  });

  const { data: equipment = [] } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => base44.entities.Equipment.list(),
  });

  const { data: annotations = [] } = useQuery({
    queryKey: ['annotations', selectedBlueprint?.id],
    queryFn: () => selectedBlueprint ? base44.entities.BlueprintAnnotation.filter({ blueprint_id: selectedBlueprint.id }) : [],
    enabled: !!selectedBlueprint,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Blueprint.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blueprints'] });
      setShowUpload(false);
    },
  });

  const handleViewBlueprint = (blueprint) => {
    setSelectedBlueprint(blueprint);
    setActiveTab("viewer");
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-[1800px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Gestión de Planos
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Planos interactivos con ubicación de equipos y anotaciones
            </p>
          </div>
          <Button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Subir Plano
          </Button>
        </div>

        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <BlueprintUpload
                onSubmit={(data) => createMutation.mutate(data)}
                onCancel={() => setShowUpload(false)}
                isLoading={createMutation.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100">
            <TabsTrigger value="list">Todos los Planos</TabsTrigger>
            <TabsTrigger value="viewer" disabled={!selectedBlueprint}>
              Visor Interactivo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <BlueprintList
              blueprints={blueprints}
              isLoading={isLoading}
              onView={handleViewBlueprint}
            />
          </TabsContent>

          <TabsContent value="viewer" className="mt-6">
            {selectedBlueprint && (
              <BlueprintViewer
                blueprint={selectedBlueprint}
                equipment={equipment}
                annotations={annotations}
                onBack={() => setActiveTab("list")}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
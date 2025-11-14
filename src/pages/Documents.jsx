import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import DocumentUpload from "../components/documents/DocumentUpload";
import DocumentList from "../components/documents/DocumentList";
import DocumentStats from "../components/documents/DocumentStats";

export default function DocumentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => base44.entities.Document.list('-created_date'),
  });

  const { data: equipment = [] } = useQuery({
    queryKey: ['equipment'],
    queryFn: () => base44.entities.Equipment.list('name'),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['maintenanceTasks'],
    queryFn: () => base44.entities.MaintenanceTask.list('title'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Document.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este documento?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.related_to_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
                       (activeTab === "equipment" && doc.related_to_type === "equipment") ||
                       (activeTab === "maintenance" && doc.related_to_type === "maintenance_task") ||
                       (activeTab === "zone" && doc.related_to_type === "zone") ||
                       (activeTab === "general" && doc.related_to_type === "general");
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Gestión Documental
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Manuales, certificados, planos y documentación técnica
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Subir Documento
          </Button>
        </div>

        {/* Stats */}
        <DocumentStats documents={documents} />

        {/* Upload Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DocumentUpload
                equipment={equipment}
                tasks={tasks}
                onCancel={() => setShowForm(false)}
                onSuccess={() => setShowForm(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100">
            <TabsTrigger value="all">Todos ({documents.length})</TabsTrigger>
            <TabsTrigger value="equipment">
              Equipos ({documents.filter(d => d.related_to_type === 'equipment').length})
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              Mantenimientos ({documents.filter(d => d.related_to_type === 'maintenance_task').length})
            </TabsTrigger>
            <TabsTrigger value="zone">
              Zonas ({documents.filter(d => d.related_to_type === 'zone').length})
            </TabsTrigger>
            <TabsTrigger value="general">
              Generales ({documents.filter(d => d.related_to_type === 'general').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <DocumentList 
              documents={filteredDocs}
              isLoading={isLoading}
              onDelete={handleDelete}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
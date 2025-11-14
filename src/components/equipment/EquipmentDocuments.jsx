import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Plus, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function EquipmentDocuments({ equipmentId, equipmentName }) {
  const { data: documents = [] } = useQuery({
    queryKey: ['documents', 'equipment', equipmentId],
    queryFn: async () => {
      const allDocs = await base44.entities.Document.list('-created_date');
      return allDocs.filter(d => d.related_to_type === 'equipment' && d.related_to_id === equipmentId);
    },
  });

  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Documentos Asociados
            </span>
            <Link to={createPageUrl("Documents")}>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Añadir Documento
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 text-center py-4">
            No hay documentos asociados a este equipo
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documentos ({documents.length})
          </span>
          <Link to={createPageUrl("Documents")}>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Añadir
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-800 truncate">{doc.name}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {doc.category?.replace('_', ' ')}
                  </Badge>
                  {doc.file_type && (
                    <Badge variant="outline" className="text-xs">
                      {doc.file_type.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(doc.file_url, '_blank')}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
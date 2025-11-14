import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  Trash2, 
  Calendar, 
  User, 
  Link as LinkIcon,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

export default function DocumentList({ documents, isLoading, onDelete }) {
  const getCategoryLabel = (category) => {
    const labels = {
      manual_usuario: "Manual Usuario",
      manual_tecnico: "Manual Técnico",
      certificado_calidad: "Certificado Calidad",
      certificado_inspeccion: "Certificado Inspección",
      plano_tecnico: "Plano Técnico",
      ficha_tecnica: "Ficha Técnica",
      garantia: "Garantía",
      contrato_mantenimiento: "Contrato",
      factura: "Factura",
      foto: "Foto",
      otro: "Otro"
    };
    return labels[category] || category;
  };

  const getTypeLabel = (type) => {
    const labels = {
      equipment: "Equipo",
      maintenance_task: "Mantenimiento",
      zone: "Zona",
      blueprint: "Plano",
      general: "General"
    };
    return labels[type] || type;
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const daysUntil = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntil > 0 && daysUntil <= 30;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (isLoading) {
    return <div className="text-center py-12 text-slate-500">Cargando documentos...</div>;
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-slate-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="font-medium">No hay documentos disponibles</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-lg text-slate-800">{doc.name}</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(doc.file_url, '_blank')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(doc.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {doc.description && (
                    <p className="text-slate-600 mt-1">{doc.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{getCategoryLabel(doc.category)}</Badge>
                  <Badge variant="outline">{getTypeLabel(doc.related_to_type)}</Badge>
                  {doc.file_type && (
                    <Badge className="bg-blue-100 text-blue-800">{doc.file_type.toUpperCase()}</Badge>
                  )}
                  {doc.file_size_mb && (
                    <Badge variant="outline">{doc.file_size_mb} MB</Badge>
                  )}
                  {doc.expiry_date && isExpired(doc.expiry_date) && (
                    <Badge className="bg-red-100 text-red-800">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Caducado
                    </Badge>
                  )}
                  {doc.expiry_date && isExpiringSoon(doc.expiry_date) && !isExpired(doc.expiry_date) && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Por Caducar
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  {doc.related_to_name && (
                    <div className="flex items-center gap-1">
                      <LinkIcon className="w-4 h-4" />
                      <span>{doc.related_to_name}</span>
                    </div>
                  )}
                  {doc.uploaded_by_name && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{doc.uploaded_by_name}</span>
                    </div>
                  )}
                  {doc.created_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(doc.created_date), 'dd/MM/yyyy')}</span>
                    </div>
                  )}
                  {doc.expiry_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Caduca: {format(new Date(doc.expiry_date), 'dd/MM/yyyy')}</span>
                    </div>
                  )}
                </div>

                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
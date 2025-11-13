import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pencil, Play, Search, Clock, AlertCircle, CheckCircle2, Image } from "lucide-react";
import { format, isPast } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PRIORITY_CONFIG = {
  baja: { label: "Baja", className: "bg-blue-50 text-blue-700 border-blue-200" },
  media: { label: "Media", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  alta: { label: "Alta", className: "bg-orange-50 text-orange-700 border-orange-200" },
  urgente: { label: "Urgente", className: "bg-red-50 text-red-700 border-red-200" }
};

export default function TaskList({ tasks, isLoading, onEdit, onExecute, showCompletionDetails }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingPhotos, setViewingPhotos] = useState(null);

  const filteredTasks = tasks.filter(t =>
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.equipment_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Listado de Tareas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-2xl font-bold text-slate-800">
              Listado de Tareas
            </CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-200"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-bold">Tarea</TableHead>
                  <TableHead className="font-bold">Equipo</TableHead>
                  <TableHead className="font-bold">Fecha</TableHead>
                  <TableHead className="font-bold">Asignado a</TableHead>
                  <TableHead className="font-bold text-center">Prioridad</TableHead>
                  <TableHead className="font-bold text-center">Legal</TableHead>
                  {showCompletionDetails && (
                    <>
                      <TableHead className="font-bold text-center">Duración</TableHead>
                      <TableHead className="font-bold text-center">Fotos</TableHead>
                    </>
                  )}
                  <TableHead className="font-bold text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={showCompletionDetails ? 9 : 7} className="text-center py-8 text-slate-500">
                      {searchTerm ? 'No se encontraron tareas' : 'No hay tareas en esta sección'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => {
                    const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.media;
                    const isOverdue = task.status === 'pendiente' && isPast(new Date(task.scheduled_date));

                    return (
                      <TableRow key={task.id} className={`hover:bg-slate-50 transition-colors ${isOverdue ? 'bg-red-50' : ''}`}>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-slate-800">{task.title}</p>
                            {task.description && (
                              <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-indigo-200">
                            {task.equipment_name || 'Sin equipo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {isOverdue && <AlertCircle className="w-4 h-4 text-red-600" />}
                            <span className={`text-sm font-medium ${isOverdue ? 'text-red-600 font-bold' : ''}`}>
                              {format(new Date(task.scheduled_date), "dd MMM yyyy", { locale: es })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {task.assigned_to ? (
                            <span className="text-sm">{task.assigned_to.split('@')[0]}</span>
                          ) : (
                            <span className="text-sm text-slate-400">Sin asignar</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={`${priority.className} border font-semibold`}>
                            {priority.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {task.legal_requirement && (
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 font-semibold">
                              Legal
                            </Badge>
                          )}
                        </TableCell>
                        {showCompletionDetails && (
                          <>
                            <TableCell className="text-center">
                              {task.actual_duration_hours ? (
                                <span className="text-sm font-semibold">{task.actual_duration_hours}h</span>
                              ) : (
                                <span className="text-sm text-slate-400">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {(task.photos_after?.length > 0 || task.photos_before?.length > 0) && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setViewingPhotos(task)}
                                >
                                  <Image className="w-4 h-4 text-blue-600" />
                                </Button>
                              )}
                            </TableCell>
                          </>
                        )}
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(task)}
                              className="hover:bg-slate-100"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            {onExecute && task.status !== 'completada' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onExecute(task)}
                                className="hover:bg-green-50 hover:text-green-600"
                              >
                                <Play className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Photos Dialog */}
      {viewingPhotos && (
        <Dialog open={!!viewingPhotos} onOpenChange={() => setViewingPhotos(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Fotos de la Tarea: {viewingPhotos.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {viewingPhotos.photos_before?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Fotos Antes</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {viewingPhotos.photos_before.map((url, idx) => (
                      <img key={idx} src={url} alt={`Antes ${idx + 1}`} className="w-full h-40 object-cover rounded-lg border" />
                    ))}
                  </div>
                </div>
              )}
              {viewingPhotos.photos_after?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Fotos Después</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {viewingPhotos.photos_after.map((url, idx) => (
                      <img key={idx} src={url} alt={`Después ${idx + 1}`} className="w-full h-40 object-cover rounded-lg border" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
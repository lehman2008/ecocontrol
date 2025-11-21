import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  Settings, 
  UserCheck,
  AlertCircle,
  Save,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ROLES = {
  admin: {
    label: "Administrador",
    color: "bg-purple-100 text-purple-700",
    description: "Acceso completo al sistema",
    permissions: ["all"]
  },
  manager: {
    label: "Gerente",
    color: "bg-blue-100 text-blue-700",
    description: "Gestión de equipos, mantenimientos y reportes",
    permissions: ["equipment", "maintenance", "reports", "analytics", "occupancy", "alerts"]
  },
  technician: {
    label: "Técnico",
    color: "bg-green-100 text-green-700",
    description: "Mantenimientos y equipos",
    permissions: ["equipment", "maintenance", "documents"]
  },
  operator: {
    label: "Operador",
    color: "bg-orange-100 text-orange-700",
    description: "Lecturas de consumos y piscina",
    permissions: ["energy", "water", "fuel", "pool"]
  },
  viewer: {
    label: "Consultor",
    color: "bg-gray-100 text-gray-700",
    description: "Solo lectura",
    permissions: ["dashboard", "analytics", "reports"]
  }
};

const PERMISSIONS_LABELS = {
  all: "Acceso Total",
  dashboard: "Panel Principal",
  analytics: "Analíticas",
  reports: "Reportes",
  equipment: "Equipos",
  maintenance: "Mantenimientos",
  occupancy: "Ocupación",
  blueprints: "Planos",
  documents: "Documentos",
  iot: "IoT",
  energy: "Energía",
  water: "Agua",
  fuel: "Combustibles",
  pool: "Piscina",
  alerts: "Alertas"
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.User.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingUser(null);
    },
  });

  const handleUpdateRole = (userId, newRole) => {
    updateUserMutation.mutate({
      id: userId,
      data: { role: newRole }
    });
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Verificar si el usuario actual es admin
  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <Card className="max-w-md border-0 shadow-xl">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Acceso Denegado</h2>
            <p className="text-slate-600">
              Solo los administradores pueden acceder a esta sección.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Administración
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Gestión de usuarios y permisos del sistema
            </p>
          </div>
          <Badge className="bg-purple-100 text-purple-700">
            <Shield className="w-3 h-3 mr-1" />
            Administrador
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Usuarios</p>
                  <p className="text-3xl font-bold text-purple-600">{users.length}</p>
                </div>
                <Users className="w-12 h-12 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Administradores</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <Shield className="w-12 h-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Técnicos</p>
                  <p className="text-3xl font-bold text-green-600">
                    {users.filter(u => u.role === 'technician').length}
                  </p>
                </div>
                <UserCheck className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Otros</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {users.filter(u => !['admin', 'technician'].includes(u.role)).length}
                  </p>
                </div>
                <Settings className="w-12 h-12 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100">
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="roles">Roles y Permisos</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6 space-y-4">
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <Input
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left p-4 font-semibold text-slate-700">Usuario</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Email</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Rol Actual</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-4">
                            <div className="font-medium text-slate-800">
                              {user.full_name || 'Sin nombre'}
                            </div>
                          </td>
                          <td className="p-4 text-slate-600">{user.email}</td>
                          <td className="p-4">
                            {editingUser?.id === user.id ? (
                              <Select
                                value={editingUser.role}
                                onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Administrador</SelectItem>
                                  <SelectItem value="manager">Gerente</SelectItem>
                                  <SelectItem value="technician">Técnico</SelectItem>
                                  <SelectItem value="operator">Operador</SelectItem>
                                  <SelectItem value="viewer">Consultor</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge className={ROLES[user.role]?.color || "bg-gray-100 text-gray-700"}>
                                {ROLES[user.role]?.label || user.role}
                              </Badge>
                            )}
                          </td>
                          <td className="p-4">
                            {editingUser?.id === user.id ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateRole(user.id, editingUser.role)}
                                  disabled={updateUserMutation.isPending}
                                >
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingUser(null)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingUser(user)}
                                disabled={user.id === currentUser?.id}
                              >
                                Cambiar Rol
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(ROLES).map(([key, role]) => (
                <Card key={key} className="border-0 shadow-xl bg-white">
                  <CardHeader className="border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{role.label}</CardTitle>
                      <Badge className={role.color}>
                        {users.filter(u => u.role === key).length}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">{role.description}</p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Permisos:</h4>
                    <div className="space-y-2">
                      {role.permissions.map(perm => (
                        <div key={perm} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-slate-600">
                            {PERMISSIONS_LABELS[perm] || perm}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
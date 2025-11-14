import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, File, CheckCircle, AlertTriangle } from "lucide-react";

export default function DocumentStats({ documents }) {
  const total = documents.length;
  const byCategory = documents.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1;
    return acc;
  }, {});

  const expiringDocs = documents.filter(doc => {
    if (!doc.expiry_date) return false;
    const expiryDate = new Date(doc.expiry_date);
    const daysUntilExpiry = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  }).length;

  const expiredDocs = documents.filter(doc => {
    if (!doc.expiry_date) return false;
    return new Date(doc.expiry_date) < new Date();
  }).length;

  const totalSize = documents.reduce((sum, doc) => sum + (doc.file_size_mb || 0), 0).toFixed(2);

  const stats = [
    {
      label: "Total Documentos",
      value: total,
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      label: "Espacio Usado",
      value: `${totalSize} MB`,
      icon: File,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      label: "Por Caducar",
      value: expiringDocs,
      icon: AlertTriangle,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      label: "Caducados",
      value: expiredDocs,
      icon: AlertTriangle,
      gradient: "from-red-500 to-rose-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
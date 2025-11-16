import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, CheckCircle, AlertTriangle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function PoolComplianceReport({ measurements }) {
  const generateReport = () => {
    const reportData = {
      fecha_generacion: new Date().toISOString(),
      periodo: {
        inicio: measurements.length > 0 ? measurements[measurements.length - 1].measurement_date : '',
        fin: measurements.length > 0 ? measurements[0].measurement_date : ''
      },
      resumen: {
        total_mediciones: measurements.length,
        cumple_normativa: measurements.filter(m => m.complies_with_rd742).length,
        no_cumple_normativa: measurements.filter(m => !m.complies_with_rd742).length,
        tasa_cumplimiento: measurements.length > 0 
          ? ((measurements.filter(m => m.complies_with_rd742).length / measurements.length) * 100).toFixed(2) + '%'
          : '0%'
      },
      incumplimientos_frecuentes: getFrequentIssues(measurements),
      recomendaciones: generateRecommendations(measurements)
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `informe-cumplimiento-piscinas-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFrequentIssues = (measurements) => {
    const issuesCount = {};
    measurements.forEach(m => {
      if (m.non_compliant_parameters) {
        m.non_compliant_parameters.forEach(issue => {
          issuesCount[issue] = (issuesCount[issue] || 0) + 1;
        });
      }
    });
    return Object.entries(issuesCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([issue, count]) => ({ parametro: issue, frecuencia: count }));
  };

  const generateRecommendations = (measurements) => {
    const recommendations = [];
    const nonCompliant = measurements.filter(m => !m.complies_with_rd742);
    
    if (nonCompliant.length > measurements.length * 0.3) {
      recommendations.push("Revisar sistema de dosificación química automática");
      recommendations.push("Verificar funcionamiento de sistema de filtración");
    }
    
    const phIssues = measurements.filter(m => 
      m.non_compliant_parameters?.some(p => p.includes('pH'))
    );
    if (phIssues.length > 3) {
      recommendations.push("Ajustar sistema de control de pH");
    }

    const chlorineIssues = measurements.filter(m => 
      m.non_compliant_parameters?.some(p => p.includes('Cloro'))
    );
    if (chlorineIssues.length > 3) {
      recommendations.push("Revisar sistema de cloración y dosificación");
    }

    return recommendations.length > 0 ? recommendations : ["Continuar con el programa de mantenimiento actual"];
  };

  const recentNonCompliant = measurements.filter(m => !m.complies_with_rd742).slice(0, 5);

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <FileText className="w-6 h-6 text-cyan-500" />
            Informe de Cumplimiento RD 742/2013
          </CardTitle>
          <Button onClick={generateReport} className="gap-2">
            <Download className="w-4 h-4" />
            Descargar Informe
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-cyan-600" />
              <span className="text-sm font-semibold text-cyan-800">Periodo</span>
            </div>
            <p className="text-xs text-cyan-700">
              Últimas {measurements.length} mediciones
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-800">Cumplimiento</span>
            </div>
            <p className="text-2xl font-bold text-green-700">
              {measurements.length > 0 
                ? ((measurements.filter(m => m.complies_with_rd742).length / measurements.length) * 100).toFixed(1)
                : 0}%
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-800">Incumplimientos</span>
            </div>
            <p className="text-2xl font-bold text-orange-700">
              {measurements.filter(m => !m.complies_with_rd742).length}
            </p>
          </div>
        </div>

        {recentNonCompliant.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">Últimos Incumplimientos</h3>
            <div className="space-y-3">
              {recentNonCompliant.map((m) => (
                <div key={m.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge variant="outline" className="bg-white">
                        {m.pool_name?.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-sm text-slate-600 ml-2">
                        {format(new Date(m.measurement_date), "dd MMM yyyy, HH:mm", { locale: es })}
                      </span>
                    </div>
                    <Badge className="bg-red-600 text-white">No Cumple</Badge>
                  </div>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {m.non_compliant_parameters?.slice(0, 3).map((param, idx) => (
                      <li key={idx}>{param}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3">Recomendaciones</h3>
          <ul className="space-y-2">
            {generateRecommendations(measurements).map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Waves, Save, X, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const POOL_NAMES = [
  { value: "piscina_principal", label: "Piscina Principal" },
  { value: "piscina_infantil", label: "Piscina Infantil" },
  { value: "spa_jacuzzi", label: "Spa / Jacuzzi / Hidromasaje" },
  { value: "piscina_cubierta", label: "Piscina Cubierta" }
];

const TRANSPARENCY_LEVELS = [
  { value: "excelente", label: "Excelente" },
  { value: "buena", label: "Buena" },
  { value: "aceptable", label: "Aceptable" },
  { value: "deficiente", label: "Deficiente" }
];

// RD 742/2013 - Límites normativos
const RD742_LIMITS = {
  ph_min: 7.2,
  ph_max: 8.0,
  free_chlorine_min: 0.5,
  free_chlorine_max: 2.0,
  free_chlorine_hydro_min: 2.0,
  free_chlorine_hydro_max: 5.0,
  combined_chlorine_max: 0.6,
  oxidability_max: 5,
  turbidity_max: 1,
  bacteria_22_max: 200,
  bacteria_36_max: 100,
  escherichia_coli_max: 0,
  pseudomonas_max: 0,
  legionella_max: 0,
  trichloramine_air_max: 0.5
};

export default function PoolForm({ measurement, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    measurement_date: '',
    pool_name: 'piscina_principal',
    ph_level: '',
    free_chlorine: '',
    combined_chlorine: '',
    total_chlorine: '',
    oxidability: '',
    turbidity_ntu: '',
    alkalinity: '',
    water_temperature: '',
    air_temperature: '',
    relative_humidity: '',
    trichloramine_air: '',
    urea: '',
    total_dissolved_solids: '',
    calcium_hardness: '',
    cyanuric_acid: '',
    bromine: '',
    transparency: 'excelente',
    bacteria_count: '',
    bacteria_36_count: '',
    escherichia_coli: '',
    pseudomonas: '',
    legionella: '',
    actions_taken: '',
    corrective_measures: '',
    responsible_person: '',
    notes: ''
  });

  const [compliance, setCompliance] = useState({ complies: true, issues: [] });

  useEffect(() => {
    if (measurement) {
      setFormData({
        measurement_date: measurement.measurement_date?.split('T')[0] || '',
        pool_name: measurement.pool_name || 'piscina_principal',
        ph_level: measurement.ph_level || '',
        free_chlorine: measurement.free_chlorine || '',
        combined_chlorine: measurement.combined_chlorine || '',
        total_chlorine: measurement.total_chlorine || '',
        oxidability: measurement.oxidability || '',
        turbidity_ntu: measurement.turbidity_ntu || '',
        alkalinity: measurement.alkalinity || '',
        water_temperature: measurement.water_temperature || '',
        air_temperature: measurement.air_temperature || '',
        relative_humidity: measurement.relative_humidity || '',
        trichloramine_air: measurement.trichloramine_air || '',
        urea: measurement.urea || '',
        total_dissolved_solids: measurement.total_dissolved_solids || '',
        calcium_hardness: measurement.calcium_hardness || '',
        cyanuric_acid: measurement.cyanuric_acid || '',
        bromine: measurement.bromine || '',
        transparency: measurement.transparency || 'excelente',
        bacteria_count: measurement.bacteria_count || '',
        bacteria_36_count: measurement.bacteria_36_count || '',
        escherichia_coli: measurement.escherichia_coli || '',
        pseudomonas: measurement.pseudomonas || '',
        legionella: measurement.legionella || '',
        actions_taken: measurement.actions_taken || '',
        corrective_measures: measurement.corrective_measures || '',
        responsible_person: measurement.responsible_person || '',
        notes: measurement.notes || ''
      });
    } else {
      const now = new Date();
      setFormData(prev => ({
        ...prev,
        measurement_date: now.toISOString().split('T')[0]
      }));
    }
  }, [measurement]);

  useEffect(() => {
    checkCompliance();
  }, [formData]);

  const checkCompliance = () => {
    const issues = [];
    const isHydro = formData.pool_name === 'spa_jacuzzi';

    // pH
    const ph = parseFloat(formData.ph_level);
    if (ph && (ph < RD742_LIMITS.ph_min || ph > RD742_LIMITS.ph_max)) {
      issues.push(`pH fuera de rango RD 742/2013 (${RD742_LIMITS.ph_min}-${RD742_LIMITS.ph_max}): ${ph}`);
    }

    // Cloro libre
    const chlorine = parseFloat(formData.free_chlorine);
    if (chlorine) {
      const minCl = isHydro ? RD742_LIMITS.free_chlorine_hydro_min : RD742_LIMITS.free_chlorine_min;
      const maxCl = isHydro ? RD742_LIMITS.free_chlorine_hydro_max : RD742_LIMITS.free_chlorine_max;
      if (chlorine < minCl || chlorine > maxCl) {
        issues.push(`Cloro libre fuera de rango (${minCl}-${maxCl} mg/L): ${chlorine}`);
      }
    }

    // Cloro combinado
    const combinedCl = parseFloat(formData.combined_chlorine);
    if (combinedCl && combinedCl > RD742_LIMITS.combined_chlorine_max) {
      issues.push(`Cloro combinado supera límite (máx ${RD742_LIMITS.combined_chlorine_max} mg/L): ${combinedCl}`);
    }

    // Oxidabilidad
    const ox = parseFloat(formData.oxidability);
    if (ox && ox > RD742_LIMITS.oxidability_max) {
      issues.push(`Oxidabilidad supera límite (máx ${RD742_LIMITS.oxidability_max} mg/L): ${ox}`);
    }

    // Turbidez
    const turb = parseFloat(formData.turbidity_ntu);
    if (turb && turb > RD742_LIMITS.turbidity_max) {
      issues.push(`Turbidez supera límite (máx ${RD742_LIMITS.turbidity_max} NTU): ${turb}`);
    }

    // Bacterias
    const bact22 = parseFloat(formData.bacteria_count);
    if (bact22 && bact22 > RD742_LIMITS.bacteria_22_max) {
      issues.push(`Bacterias 22°C superan límite (máx ${RD742_LIMITS.bacteria_22_max} UFC/ml): ${bact22}`);
    }

    const bact36 = parseFloat(formData.bacteria_36_count);
    if (bact36 && bact36 > RD742_LIMITS.bacteria_36_max) {
      issues.push(`Bacterias 36°C superan límite (máx ${RD742_LIMITS.bacteria_36_max} UFC/ml): ${bact36}`);
    }

    // E. coli
    const ecoli = parseFloat(formData.escherichia_coli);
    if (ecoli && ecoli > RD742_LIMITS.escherichia_coli_max) {
      issues.push(`E. coli detectado (debe ser ${RD742_LIMITS.escherichia_coli_max}): ${ecoli}`);
    }

    // Pseudomonas
    const pseudo = parseFloat(formData.pseudomonas);
    if (pseudo && pseudo > RD742_LIMITS.pseudomonas_max) {
      issues.push(`Pseudomonas detectado (debe ser ${RD742_LIMITS.pseudomonas_max}): ${pseudo}`);
    }

    // Legionella
    const legio = parseFloat(formData.legionella);
    if (legio && legio > RD742_LIMITS.legionella_max) {
      issues.push(`Legionella detectado (debe ser ${RD742_LIMITS.legionella_max}): ${legio}`);
    }

    // Tricloramina en aire
    const trich = parseFloat(formData.trichloramine_air);
    if (trich && trich > RD742_LIMITS.trichloramine_air_max) {
      issues.push(`Tricloramina en aire supera límite (máx ${RD742_LIMITS.trichloramine_air_max} mg/m³): ${trich}`);
    }

    setCompliance({ complies: issues.length === 0, issues });
  };

  const determineStatus = () => {
    if (!compliance.complies) {
      const criticalIssues = compliance.issues.filter(i => 
        i.includes('E. coli') || i.includes('Pseudomonas') || i.includes('Legionella')
      );
      if (criticalIssues.length > 0) return 'no_apto';
      if (compliance.issues.length >= 3) return 'critico';
      if (compliance.issues.length === 2) return 'requiere_atencion';
      return 'aceptable';
    }
    return 'optimo';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanData = {
      ...formData,
      measurement_date: new Date(formData.measurement_date).toISOString(),
      ph_level: parseFloat(formData.ph_level) || 0,
      free_chlorine: parseFloat(formData.free_chlorine) || 0,
      water_temperature: parseFloat(formData.water_temperature) || 0,
      combined_chlorine: formData.combined_chlorine ? parseFloat(formData.combined_chlorine) : undefined,
      total_chlorine: formData.total_chlorine ? parseFloat(formData.total_chlorine) : undefined,
      oxidability: formData.oxidability ? parseFloat(formData.oxidability) : undefined,
      turbidity_ntu: formData.turbidity_ntu ? parseFloat(formData.turbidity_ntu) : undefined,
      alkalinity: formData.alkalinity ? parseFloat(formData.alkalinity) : undefined,
      air_temperature: formData.air_temperature ? parseFloat(formData.air_temperature) : undefined,
      relative_humidity: formData.relative_humidity ? parseFloat(formData.relative_humidity) : undefined,
      trichloramine_air: formData.trichloramine_air ? parseFloat(formData.trichloramine_air) : undefined,
      urea: formData.urea ? parseFloat(formData.urea) : undefined,
      total_dissolved_solids: formData.total_dissolved_solids ? parseFloat(formData.total_dissolved_solids) : undefined,
      calcium_hardness: formData.calcium_hardness ? parseFloat(formData.calcium_hardness) : undefined,
      cyanuric_acid: formData.cyanuric_acid ? parseFloat(formData.cyanuric_acid) : undefined,
      bromine: formData.bromine ? parseFloat(formData.bromine) : undefined,
      bacteria_count: formData.bacteria_count ? parseFloat(formData.bacteria_count) : undefined,
      bacteria_36_count: formData.bacteria_36_count ? parseFloat(formData.bacteria_36_count) : undefined,
      escherichia_coli: formData.escherichia_coli ? parseFloat(formData.escherichia_coli) : undefined,
      pseudomonas: formData.pseudomonas ? parseFloat(formData.pseudomonas) : undefined,
      legionella: formData.legionella ? parseFloat(formData.legionella) : undefined,
      complies_with_rd742: compliance.complies,
      non_compliant_parameters: compliance.issues,
      status: determineStatus()
    };

    onSubmit(cleanData);
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <Waves className="w-6 h-6 text-cyan-500" />
            {measurement ? 'Editar Medición' : 'Nueva Medición de Piscina'}
          </CardTitle>
          <Badge className={`${compliance.complies ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} text-sm px-3 py-1`}>
            {compliance.complies ? '✓ Cumple RD 742/2013' : '✗ No Cumple RD 742/2013'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {!compliance.complies && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-800 font-bold">Incumplimiento RD 742/2013</AlertTitle>
            <AlertDescription className="text-red-700 mt-2">
              <ul className="list-disc list-inside space-y-1 text-sm">
                {compliance.issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Básicos</TabsTrigger>
              <TabsTrigger value="chemical">Químicos</TabsTrigger>
              <TabsTrigger value="micro">Microbiológicos</TabsTrigger>
              <TabsTrigger value="env">Ambientales</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Fecha y Hora *</Label>
                  <Input
                    type="date"
                    value={formData.measurement_date}
                    onChange={(e) => setFormData({ ...formData, measurement_date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Piscina *</Label>
                  <Select
                    value={formData.pool_name}
                    onValueChange={(value) => setFormData({ ...formData, pool_name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {POOL_NAMES.map(pool => (
                        <SelectItem key={pool.value} value={pool.value}>{pool.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Responsable</Label>
                  <Input
                    value={formData.responsible_person}
                    onChange={(e) => setFormData({ ...formData, responsible_person: e.target.value })}
                    placeholder="Nombre del responsable"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>pH * (RD: 7.2-8.0)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.ph_level}
                    onChange={(e) => setFormData({ ...formData, ph_level: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cloro Libre * (mg/L)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.free_chlorine}
                    onChange={(e) => setFormData({ ...formData, free_chlorine: e.target.value })}
                    required
                  />
                  <p className="text-xs text-slate-500">
                    RD: {formData.pool_name === 'spa_jacuzzi' ? '2.0-5.0' : '0.5-2.0'} mg/L
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Temperatura Agua * (°C)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.water_temperature}
                    onChange={(e) => setFormData({ ...formData, water_temperature: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Transparencia Visual</Label>
                <Select
                  value={formData.transparency}
                  onValueChange={(value) => setFormData({ ...formData, transparency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSPARENCY_LEVELS.map(level => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="chemical" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Cloro Combinado (mg/L)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.combined_chlorine}
                    onChange={(e) => setFormData({ ...formData, combined_chlorine: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">RD: máx 0.6 mg/L</p>
                </div>

                <div className="space-y-2">
                  <Label>Cloro Total (mg/L)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.total_chlorine}
                    onChange={(e) => setFormData({ ...formData, total_chlorine: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Oxidabilidad (mg O₂/L)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.oxidability}
                    onChange={(e) => setFormData({ ...formData, oxidability: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">RD: máx 5 mg/L</p>
                </div>

                <div className="space-y-2">
                  <Label>Turbidez (NTU)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.turbidity_ntu}
                    onChange={(e) => setFormData({ ...formData, turbidity_ntu: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">RD: máx 1 NTU</p>
                </div>

                <div className="space-y-2">
                  <Label>Alcalinidad (mg/L CaCO₃)</Label>
                  <Input
                    type="number"
                    step="1"
                    value={formData.alkalinity}
                    onChange={(e) => setFormData({ ...formData, alkalinity: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">Recomendado: 80-150</p>
                </div>

                <div className="space-y-2">
                  <Label>Dureza Cálcica (mg/L)</Label>
                  <Input
                    type="number"
                    step="1"
                    value={formData.calcium_hardness}
                    onChange={(e) => setFormData({ ...formData, calcium_hardness: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ácido Cianúrico (mg/L)</Label>
                  <Input
                    type="number"
                    step="1"
                    value={formData.cyanuric_acid}
                    onChange={(e) => setFormData({ ...formData, cyanuric_acid: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Bromo (mg/L)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.bromine}
                    onChange={(e) => setFormData({ ...formData, bromine: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Urea (mg/L)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.urea}
                    onChange={(e) => setFormData({ ...formData, urea: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="micro" className="space-y-6 mt-6">
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Análisis Microbiológicos RD 742/2013</AlertTitle>
                <AlertDescription className="text-blue-700 text-sm">
                  Estos análisis deben realizarse en laboratorio acreditado según frecuencias establecidas.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bacterias 22°C (UFC/ml)</Label>
                  <Input
                    type="number"
                    value={formData.bacteria_count}
                    onChange={(e) => setFormData({ ...formData, bacteria_count: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">RD: máx 200 UFC/ml</p>
                </div>

                <div className="space-y-2">
                  <Label>Bacterias 36°C (UFC/ml)</Label>
                  <Input
                    type="number"
                    value={formData.bacteria_36_count}
                    onChange={(e) => setFormData({ ...formData, bacteria_36_count: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">RD: máx 100 UFC/ml</p>
                </div>

                <div className="space-y-2">
                  <Label>E. coli (UFC/100ml)</Label>
                  <Input
                    type="number"
                    value={formData.escherichia_coli}
                    onChange={(e) => setFormData({ ...formData, escherichia_coli: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">RD: 0 UFC/100ml</p>
                </div>

                <div className="space-y-2">
                  <Label>Pseudomonas aeruginosa (UFC/100ml)</Label>
                  <Input
                    type="number"
                    value={formData.pseudomonas}
                    onChange={(e) => setFormData({ ...formData, pseudomonas: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">RD: 0 UFC/100ml</p>
                </div>

                <div className="space-y-2">
                  <Label>Legionella (UFC/L)</Label>
                  <Input
                    type="number"
                    value={formData.legionella}
                    onChange={(e) => setFormData({ ...formData, legionella: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">RD: 0 UFC/L</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="env" className="space-y-6 mt-6">
              <Alert className="bg-cyan-50 border-cyan-200">
                <Info className="h-4 w-4 text-cyan-600" />
                <AlertTitle className="text-cyan-800">Parámetros Ambientales (Piscinas Cubiertas)</AlertTitle>
                <AlertDescription className="text-cyan-700 text-sm">
                  Estos parámetros aplican especialmente a piscinas cubiertas y centros de hidromasaje.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Temperatura Aire (°C)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.air_temperature}
                    onChange={(e) => setFormData({ ...formData, air_temperature: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Humedad Relativa (%)</Label>
                  <Input
                    type="number"
                    step="1"
                    value={formData.relative_humidity}
                    onChange={(e) => setFormData({ ...formData, relative_humidity: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">Óptimo: 60-70%</p>
                </div>

                <div className="space-y-2">
                  <Label>Tricloramina Aire (mg/m³)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.trichloramine_air}
                    onChange={(e) => setFormData({ ...formData, trichloramine_air: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">RD: máx 0.5 mg/m³</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Acciones Correctivas Realizadas</Label>
                  <Textarea
                    value={formData.actions_taken}
                    onChange={(e) => setFormData({ ...formData, actions_taken: e.target.value })}
                    placeholder="Ej: Añadido cloro líquido, ajustado pH..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Medidas Correctoras (RD 742/2013)</Label>
                  <Textarea
                    value={formData.corrective_measures}
                    onChange={(e) => setFormData({ ...formData, corrective_measures: e.target.value })}
                    placeholder="Medidas aplicadas según normativa..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Observaciones Adicionales</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Cualquier observación relevante..."
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-500 hover:to-teal-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Guardando...' : measurement ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Book, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const FAQ_ITEMS = [
  {
    question: "¿Qué es el certificado de eficiencia energética?",
    answer: "Según el RD 390/2021 (que actualiza el RD 235/2013), es un documento obligatorio que califica energéticamente un edificio mediante una escala de la A (más eficiente) a la G (menos eficiente). Es obligatorio para venta, alquiler y edificios de uso público como hoteles.",
    category: "certificacion"
  },
  {
    question: "¿Cada cuánto debe renovarse el certificado energético?",
    answer: "El certificado de eficiencia energética tiene una validez de 10 años. Debe renovarse antes de su vencimiento o cuando se realicen modificaciones que afecten significativamente a la eficiencia energética del edificio.",
    category: "certificacion"
  },
  {
    question: "¿Qué es el Libro del Edificio Existente?",
    answer: "Según el RD 853/2021, es un documento que recoge información sobre el edificio, sus instalaciones, su estado de conservación, y las actuaciones de mantenimiento y reforma. Es obligatorio para edificios con más de 50 años o que requieran ITE.",
    category: "documentacion"
  },
  {
    question: "¿Qué edificios deben realizar auditoría energética?",
    answer: "El RD 56/2016 obliga a realizar auditorías energéticas cada 4 años a empresas que no sean PYMES, incluidos hoteles que superen ciertos umbrales (250 empleados o 50M€ facturación). La auditoría debe seguir la norma UNE-EN 16247.",
    category: "auditoria"
  },
  {
    question: "¿Qué potencia de iluminación LED es obligatoria en hoteles?",
    answer: "El RITE y el CTE DB HE-3 establecen límites de potencia instalada según el tipo de espacio. Para hoteles, generalmente no más de 10 W/m² en zonas comunes y 5 W/m² en habitaciones. Se recomienda LED con eficiencia mínima de 100 lm/W.",
    category: "iluminacion"
  },
  {
    question: "¿Qué es el BACS y cuándo es obligatorio?",
    answer: "Building Automation and Control System. Según el RD 178/2021, es obligatorio en edificios no residenciales con potencia nominal útil >290 kW. Debe controlar automáticamente calefacción, refrigeración, ACS, ventilación e iluminación para optimizar el consumo.",
    category: "automatizacion"
  },
  {
    question: "¿Cuál es la temperatura máxima permitida en verano en un hotel?",
    answer: "El RD 178/2021 establece que la temperatura de refrigeración en locales de uso público no puede ser inferior a 27°C en verano. En invierno, la calefacción no puede superar los 19°C. Se permiten excepciones justificadas técnicamente.",
    category: "climatizacion"
  },
  {
    question: "¿Qué requisitos tienen las instalaciones solares fotovoltaicas?",
    answer: "El CTE DB HE-4 y HE-5 obligan a incorporar sistemas de generación renovable en edificios nuevos y rehabilitaciones. Deben cubrir un porcentaje mínimo de la demanda energética. Las instalaciones >100 kW requieren proyecto técnico y registro.",
    category: "renovables"
  },
  {
    question: "¿Qué mantenimiento requiere un sistema de climatización?",
    answer: "Según el RITE IT 3, el mantenimiento debe ser trimestral (limpieza de filtros, comprobación de termostatos) y anual (limpieza de intercambiadores, revisión de presiones, análisis de combustión). Las operaciones deben registrarse en el Libro del Edificio.",
    category: "mantenimiento"
  },
  {
    question: "¿Cómo afecta el nuevo RITE 2021 a las instalaciones existentes?",
    answer: "El RD 178/2021 establece requisitos de eficiencia para instalaciones nuevas y renovaciones mayores. Las instalaciones existentes deben adaptarse progresivamente, especialmente en aspectos de control y automatización (BACS) y eliminación de calderas de carbón.",
    category: "normativa"
  }
];

const CATEGORIES = {
  certificacion: { label: "Certificación", color: "bg-blue-100 text-blue-700" },
  documentacion: { label: "Documentación", color: "bg-purple-100 text-purple-700" },
  auditoria: { label: "Auditoría", color: "bg-green-100 text-green-700" },
  iluminacion: { label: "Iluminación", color: "bg-yellow-100 text-yellow-700" },
  automatizacion: { label: "Automatización", color: "bg-cyan-100 text-cyan-700" },
  climatizacion: { label: "Climatización", color: "bg-orange-100 text-orange-700" },
  renovables: { label: "Renovables", color: "bg-emerald-100 text-emerald-700" },
  mantenimiento: { label: "Mantenimiento", color: "bg-red-100 text-red-700" },
  normativa: { label: "Normativa", color: "bg-slate-100 text-slate-700" }
};

export default function EnergyRegulationFAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredFAQs = FAQ_ITEMS.filter(item => {
    const matchesSearch = 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAskAI = async () => {
    if (!chatQuestion.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Eres un experto en normativa de eficiencia energética en España, especialmente en el Real Decreto 244/2019 (autoconsumo eléctrico), el RITE actualizado (RD 178/2021), y el CTE DB HE (ahorro de energía).

Pregunta del usuario: ${chatQuestion}

Proporciona una respuesta clara, precisa y basada en la normativa vigente. Si es relevante, cita artículos específicos de los reales decretos mencionados.`
      });
      
      setChatResponse(response);
    } catch (error) {
      setChatResponse("Error al consultar. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Chatbot */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-600" />
            Consulta sobre RD 244/2019 y RITE
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-amber-100">
            <p className="text-sm text-slate-600 mb-2">
              Pregunta sobre eficiencia energética y normativa aplicable
            </p>
            <Textarea
              value={chatQuestion}
              onChange={(e) => setChatQuestion(e.target.value)}
              placeholder="Ej: ¿Qué requisitos tiene una instalación solar fotovoltaica en un hotel?"
              className="mb-3"
              rows={3}
            />
            <Button 
              onClick={handleAskAI}
              disabled={isLoading || !chatQuestion.trim()}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Consultando normativa...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Consultar
                </>
              )}
            </Button>
          </div>

          {chatResponse && (
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Book className="w-4 h-4 text-amber-600" />
                Respuesta:
              </p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{chatResponse}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parámetros Clave */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Parámetros Clave Eficiencia Energética
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Certificado Energético</p>
              <p className="text-sm text-slate-600">Validez 10 años, obligatorio</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Temperatura Verano</p>
              <p className="text-sm text-slate-600">Mínimo 27°C en refrigeración</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Temperatura Invierno</p>
              <p className="text-sm text-slate-600">Máximo 19°C en calefacción</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Auditoría Energética</p>
              <p className="text-sm text-slate-600">Cada 4 años (empresas grandes)</p>
            </div>
            <div className="p-4 bg-cyan-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">BACS Obligatorio</p>
              <p className="text-sm text-slate-600">{"Potencia > 290 kW"}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Iluminación LED</p>
              <p className="text-sm text-slate-600">≥100 lm/W, max 10 W/m²</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Preguntas Frecuentes</CardTitle>
          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar en FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                Todas
              </Button>
              {Object.entries(CATEGORIES).slice(0, 6).map(([key, { label }]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredFAQs.map((item, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="flex items-start gap-3">
                <Book className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-slate-800">{item.question}</p>
                    <Badge className={CATEGORIES[item.category].color}>
                      {CATEGORIES[item.category].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
          {filteredFAQs.length === 0 && (
            <p className="text-center text-slate-500 py-8">
              No se encontraron resultados
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Book, Search, MessageCircle, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const FAQ_ITEMS = [
  {
    question: "¿Cuáles son los valores de pH permitidos según el RD 742/2013?",
    answer: "El pH del agua debe mantenerse entre 7.2 y 8.0. Valores fuera de este rango pueden causar irritación en piel y ojos, además de afectar la eficacia de la desinfección.",
    category: "químicos"
  },
  {
    question: "¿Cuánto cloro libre debe haber en el agua?",
    answer: "Para piscinas normales: 0.5-2.0 mg/L. Para hidromasajes y spas: 2.0-5.0 mg/L. El cloro libre es el desinfectante activo que elimina bacterias y virus.",
    category: "químicos"
  },
  {
    question: "¿Qué es el cloro combinado y cuál es su límite?",
    answer: "El cloro combinado (cloraminas) se forma cuando el cloro reacciona con contaminantes orgánicos. Su límite máximo es 0.6 mg/L. Niveles altos causan olor desagradable e irritación.",
    category: "químicos"
  },
  {
    question: "¿Con qué frecuencia debo realizar análisis microbiológicos?",
    answer: "Los análisis microbiológicos (E. coli, Pseudomonas, Legionella) deben realizarse según el aforo y tipo de piscina. Generalmente: mensual para piscinas pequeñas, quincenal o semanal para piscinas de gran aforo.",
    category: "microbiológicos"
  },
  {
    question: "¿Qué hacer si detecto E. coli o Pseudomonas?",
    answer: "Se debe cerrar inmediatamente la piscina, realizar una supercloración (shock), investigar la causa (filtración, limpieza), y no reabrir hasta obtener análisis negativos.",
    category: "microbiológicos"
  },
  {
    question: "¿Qué es la turbidez y cuál es su límite?",
    answer: "La turbidez mide la claridad del agua. El límite máximo es 1 NTU (Unidades Nefelométricas de Turbidez). Valores altos indican filtración deficiente o exceso de partículas.",
    category: "químicos"
  },
  {
    question: "¿Qué es la oxidabilidad del agua?",
    answer: "La oxidabilidad (consumo de oxígeno) mide la cantidad de materia orgánica en el agua. El límite máximo es 5 mg/L O₂. Valores altos requieren tratamiento de shock.",
    category: "químicos"
  },
  {
    question: "¿Qué parámetros de calidad del aire se controlan en piscinas cubiertas?",
    answer: "Se controla principalmente la tricloramina en aire (máx 0.5 mg/m³), temperatura del aire (ideal 2°C superior al agua), y humedad relativa (óptimo 60-70%).",
    category: "ambientales"
  },
  {
    question: "¿Qué documentación debo mantener según la normativa?",
    answer: "Debes mantener: registro de análisis de agua, libro de mantenimiento, certificados de limpieza de vasos, certificados de análisis microbiológicos, y plan de autocontrol.",
    category: "gestión"
  },
  {
    question: "¿Cómo debo actuar ante un incumplimiento de parámetros?",
    answer: "1) Registrar el incumplimiento, 2) Tomar medidas correctoras inmediatas, 3) Repetir análisis tras corrección, 4) Documentar acciones, 5) Si es crítico (bacterias patógenas), cerrar hasta normalizar.",
    category: "gestión"
  },
  {
    question: "¿Qué es el plan de autocontrol?",
    answer: "Es un documento que establece los procedimientos de control, frecuencia de análisis, medidas preventivas y correctoras, responsables, y registros. Es obligatorio según el RD 742/2013.",
    category: "gestión"
  },
  {
    question: "¿Cuál es la temperatura ideal del agua?",
    answer: "No hay límite normativo específico, pero se recomienda: piscinas recreativas 24-28°C, piscinas terapéuticas 30-34°C, spas/hidromasajes 36-38°C.",
    category: "ambientales"
  }
];

const CATEGORIES = {
  químicos: { label: "Parámetros Químicos", color: "bg-blue-100 text-blue-700" },
  microbiológicos: { label: "Microbiología", color: "bg-red-100 text-red-700" },
  ambientales: { label: "Ambientales", color: "bg-green-100 text-green-700" },
  gestión: { label: "Gestión y Normativa", color: "bg-purple-100 text-purple-700" }
};

export default function PoolRegulationFAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatResponse, setChatResponse] = useState(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const filteredFAQ = FAQ_ITEMS.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatQuestion.trim()) return;

    setIsLoadingChat(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Eres un experto en el Real Decreto 742/2013 sobre criterios técnico-sanitarios de piscinas en España.

Contexto normativo RD 742/2013:
- pH: 7.2-8.0
- Cloro libre: 0.5-2.0 mg/L (piscinas), 2.0-5.0 mg/L (hidromasajes)
- Cloro combinado: máx 0.6 mg/L
- Turbidez: máx 1 NTU
- Oxidabilidad: máx 5 mg/L O₂
- Bacterias 22°C: máx 200 UFC/ml
- Bacterias 36°C: máx 100 UFC/ml
- E. coli: 0 UFC/100ml
- Pseudomonas aeruginosa: 0 UFC/100ml
- Legionella: 0 UFC/L
- Tricloramina en aire (piscinas cubiertas): máx 0.5 mg/m³

Pregunta del usuario: ${chatQuestion}

Responde de forma clara, concisa y práctica, citando la normativa cuando sea relevante.`,
        add_context_from_internet: false
      });

      setChatResponse(response);
    } catch (error) {
      setChatResponse("Error al procesar la consulta. Por favor, intenta de nuevo.");
    } finally {
      setIsLoadingChat(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Chatbot */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-cyan-50 to-blue-50">
        <CardHeader className="pb-4 border-b border-cyan-200">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-cyan-800">
            <MessageCircle className="w-5 h-5" />
            Consulta el RD 742/2013
          </CardTitle>
          <p className="text-sm text-cyan-700 mt-2">
            Haz cualquier pregunta sobre la normativa de piscinas
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleChatSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                placeholder="Ej: ¿Qué debo hacer si el pH está en 8.5?"
                className="flex-1"
                disabled={isLoadingChat}
              />
              <Button type="submit" disabled={isLoadingChat || !chatQuestion.trim()}>
                {isLoadingChat ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Consultar
                  </>
                )}
              </Button>
            </div>

            {chatResponse && (
              <div className="p-4 bg-white rounded-lg border border-cyan-200 shadow-sm">
                <div className="flex items-start gap-2 mb-2">
                  <Book className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" />
                  <p className="text-sm font-semibold text-cyan-800">Respuesta:</p>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{chatResponse}</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-800">
            <Book className="w-6 h-6 text-cyan-500" />
            Preguntas Frecuentes - RD 742/2013
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar en preguntas..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === "todos" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("todos")}
              >
                Todas
              </Button>
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                  className={selectedCategory === key ? cat.color : ""}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No se encontraron preguntas que coincidan con tu búsqueda
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQ.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-start gap-3 flex-1 pr-2">
                      <Badge className={`${CATEGORIES[item.category].color} shrink-0 mt-1`}>
                        {CATEGORIES[item.category].label}
                      </Badge>
                      <span className="font-semibold text-slate-800">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 pr-4 pt-2 pb-3 text-slate-700 border-l-4 border-cyan-200 bg-cyan-50/30">
                      {item.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-slate-100">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800">
            Resumen RD 742/2013
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Parámetros Físico-Químicos Obligatorios</h4>
            <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
              <li>pH: 7.2-8.0</li>
              <li>Cloro libre: 0.5-2.0 mg/L (normal) / 2.0-5.0 mg/L (hidromasaje)</li>
              <li>Cloro combinado: máx 0.6 mg/L</li>
              <li>Turbidez: máx 1 NTU</li>
              <li>Oxidabilidad: máx 5 mg/L O₂</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Parámetros Microbiológicos</h4>
            <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
              <li>Bacterias 22°C: máx 200 UFC/ml</li>
              <li>Bacterias 36°C: máx 100 UFC/ml</li>
              <li>E. coli: 0 UFC/100ml (ausencia)</li>
              <li>Pseudomonas aeruginosa: 0 UFC/100ml (ausencia)</li>
              <li>Legionella: 0 UFC/L (ausencia)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Calidad del Aire (Piscinas Cubiertas)</h4>
            <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
              <li>Tricloramina: máx 0.5 mg/m³</li>
              <li>Humedad relativa: 60-70% (óptimo)</li>
              <li>Temperatura aire: 2°C superior al agua</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
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
    question: "¿Cuál es la temperatura mínima del ACS en el punto de consumo?",
    answer: "Según el RD 487/2022, el ACS debe estar a 50°C en los puntos de consumo para prevenir la Legionella. En el acumulador, el agua debe mantenerse entre 60-65°C.",
    category: "temperatura"
  },
  {
    question: "¿Con qué frecuencia debe realizarse el análisis de Legionella?",
    answer: "El RD 487/2022 establece: mensual para instalaciones de alto riesgo (hospitales, residencias), trimestral para riesgo medio (hoteles, gimnasios), y anual para bajo riesgo. Además, se debe realizar tras modificaciones importantes.",
    category: "legionella"
  },
  {
    question: "¿Qué temperatura debe tener el retorno del ACS?",
    answer: "La temperatura del retorno del ACS debe ser superior a 50°C. Si es inferior, existe riesgo de proliferación de Legionella en el circuito de recirculación.",
    category: "temperatura"
  },
  {
    question: "¿Cada cuánto tiempo debe limpiarse el depósito de ACS?",
    answer: "Según el RD 487/2022, la limpieza y desinfección del depósito debe realizarse anualmente, o antes si se detectan anomalías en los análisis de Legionella.",
    category: "mantenimiento"
  },
  {
    question: "¿Qué debe incluir el programa de mantenimiento del ACS?",
    answer: "Debe incluir: revisión y limpieza de filtros, comprobación de temperaturas, limpieza de depósitos, revisión de válvulas, comprobación de aislamiento térmico, análisis de Legionella, y registro de todas las operaciones en el libro de mantenimiento.",
    category: "mantenimiento"
  },
  {
    question: "¿Qué hacer si se detecta Legionella en el análisis?",
    answer: "Si se detectan más de 1000 UFC/L, se debe realizar inmediatamente un tratamiento de choque (hipercloración o choque térmico a 70°C durante 2 horas), informar a la autoridad sanitaria, y repetir el análisis tras 48 horas.",
    category: "legionella"
  },
  {
    question: "¿Qué es el libro de registro de ACS y qué debe contener?",
    answer: "Es obligatorio según el RD 487/2022 y debe contener: descripción de la instalación, diagrama de flujo, protocolos de mantenimiento, registro de temperaturas, resultados de análisis de Legionella, operaciones de limpieza y desinfección, y cualquier incidencia.",
    category: "documentacion"
  },
  {
    question: "¿Cuál es el tiempo máximo para obtener ACS en el grifo?",
    answer: "Según el RITE, el tiempo máximo no debe superar los 10 segundos desde la apertura del grifo hasta obtener agua a temperatura de uso. Esto implica un correcto diseño del circuito de recirculación.",
    category: "eficiencia"
  },
  {
    question: "¿Qué tratamiento del agua es obligatorio?",
    answer: "Es obligatorio el tratamiento del agua para prevenir incrustaciones, corrosión y contaminación microbiológica. Debe incluir filtración, descalcificación si la dureza supera ciertos límites, y tratamiento contra la Legionella.",
    category: "tratamiento"
  },
  {
    question: "¿Qué presión mínima y máxima debe tener el ACS?",
    answer: "La presión mínima en el punto más desfavorable debe ser de 100 kPa (1 bar) y la máxima no debe superar los 500 kPa (5 bar). Se deben instalar reductores de presión si es necesario.",
    category: "instalacion"
  }
];

const CATEGORIES = {
  temperatura: { label: "Temperatura", color: "bg-red-100 text-red-700" },
  legionella: { label: "Legionella", color: "bg-purple-100 text-purple-700" },
  mantenimiento: { label: "Mantenimiento", color: "bg-green-100 text-green-700" },
  documentacion: { label: "Documentación", color: "bg-blue-100 text-blue-700" },
  eficiencia: { label: "Eficiencia", color: "bg-yellow-100 text-yellow-700" },
  tratamiento: { label: "Tratamiento", color: "bg-cyan-100 text-cyan-700" },
  instalacion: { label: "Instalación", color: "bg-orange-100 text-orange-700" }
};

export default function WaterRegulationFAQ() {
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
        prompt: `Eres un experto en normativa de agua caliente sanitaria (ACS) en España, especialmente en el RITE (Reglamento de Instalaciones Térmicas en los Edificios) y el Real Decreto 487/2022 sobre prevención de Legionella.

Pregunta del usuario: ${chatQuestion}

Proporciona una respuesta clara, precisa y basada en la normativa vigente. Si es relevante, cita artículos específicos del RITE o del RD 487/2022.`
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
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Consulta sobre RITE y RD 487/2022
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-slate-600 mb-2">
              Pregunta sobre ACS, Legionella y normativa aplicable
            </p>
            <Textarea
              value={chatQuestion}
              onChange={(e) => setChatQuestion(e.target.value)}
              placeholder="Ej: ¿Qué temperatura debe tener el ACS para prevenir Legionella?"
              className="mb-3"
              rows={3}
            />
            <Button 
              onClick={handleAskAI}
              disabled={isLoading || !chatQuestion.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
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
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Book className="w-4 h-4 text-blue-600" />
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
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Parámetros Clave RITE y RD 487/2022
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Temperatura ACS - Acumulador</p>
              <p className="text-sm text-slate-600">60-65°C (prevención Legionella)</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Temperatura ACS - Punto Consumo</p>
              <p className="text-sm text-slate-600">Mínimo 50°C</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Temperatura Retorno</p>
              <p className="text-sm text-slate-600">Superior a 50°C</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Análisis Legionella</p>
              <p className="text-sm text-slate-600">Trimestral (hoteles), límite 1000 UFC/L</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Limpieza Depósito</p>
              <p className="text-sm text-slate-600">Anual obligatoria</p>
            </div>
            <div className="p-4 bg-cyan-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Presión Agua</p>
              <p className="text-sm text-slate-600">Mínimo 1 bar, Máximo 5 bar</p>
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
              {Object.entries(CATEGORIES).map(([key, { label }]) => (
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
                <Book className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
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
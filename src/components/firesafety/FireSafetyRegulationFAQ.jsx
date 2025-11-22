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
    question: "¿Cuáles son los tipos de sistemas de protección contra incendios obligatorios?",
    answer: "Según el RD 513/2017, los sistemas obligatorios incluyen: extintores de incendios, sistemas de alarma, sistemas de alumbrado de emergencia, hidrantes exteriores, bocas de incendio equipadas (BIEs), columna seca, sistemas de detección y alarma, sistemas de comunicación de alarma, sistemas de abastecimiento de agua, sistemas de rociadores automáticos, y sistemas de extinción por agentes extintores.",
    category: "general"
  },
  {
    question: "¿Con qué frecuencia deben inspeccionarse los extintores?",
    answer: "El RD 513/2017 establece: trimestral (verificación de accesibilidad, estado, precintos y presión), anual (comprobación por personal especializado con desmontaje del extintor), y quinquenal (retimbrado o prueba de presión). Los extintores de CO2 deben pesarse anualmente.",
    category: "extintores"
  },
  {
    question: "¿Qué es el mantenimiento de usuario de las BIEs?",
    answer: "Cada tres meses se debe comprobar: accesibilidad, señalización, manguera en buen estado, hermeticidad de racores y ausencia de fugas, manómetro con presión correcta, y lanza cerrada.",
    category: "bies"
  },
  {
    question: "¿Cuándo es obligatorio el sistema de detección de incendios?",
    answer: "Es obligatorio en hoteles con más de 50 plazas, locales de espectáculos con más de 500 personas, aparcamientos cerrados de más de 500 m², y otras situaciones especificadas en el DB SI del CTE según tipo y ocupación del edificio.",
    category: "deteccion"
  },
  {
    question: "¿Qué es la columna seca y cuándo es obligatoria?",
    answer: "Es una instalación de tubería vacía que permite a los bomberos conectar sus equipos. Es obligatoria en edificios con altura de evacuación mayor de 24 metros (aproximadamente 8 plantas).",
    category: "general"
  },
  {
    question: "¿Cuál es la distancia máxima de recorrido hasta un extintor?",
    answer: "La distancia máxima de recorrido hasta el extintor más próximo no debe exceder de 15 metros en cualquier uso, y en cocinas industriales debe haber un extintor cada 10 metros de recorrido.",
    category: "extintores"
  },
  {
    question: "¿Qué información debe constar en el libro de mantenimiento?",
    answer: "Descripción de las instalaciones de protección contra incendios, instrucciones de uso y mantenimiento, resultados de las revisiones e inspecciones, defectos observados, operaciones de mantenimiento realizadas, y relación de las empresas mantenedoras autorizadas.",
    category: "mantenimiento"
  },
  {
    question: "¿Quién puede realizar el mantenimiento de los sistemas contra incendios?",
    answer: "El mantenimiento debe ser realizado por empresas mantenedoras o instaladores de sistemas de protección contra incendios debidamente autorizados e inscritos en el registro del órgano competente de la Comunidad Autónoma.",
    category: "mantenimiento"
  },
  {
    question: "¿Qué es el plan de autoprotección?",
    answer: "Es la herramienta que permite identificar riesgos, evaluar su gravedad, definir medidas preventivas y correctivas, y establecer procedimientos de actuación ante emergencias. Es obligatorio según el RD 393/2007 para hoteles con más de 100 plazas.",
    category: "general"
  },
  {
    question: "¿Cada cuánto tiempo debe revisarse el alumbrado de emergencia?",
    answer: "Mensualmente: verificación de funcionamiento durante 1 hora. Anualmente: verificación de funcionamiento durante la autonomía especificada (mínimo 1 hora) por empresa especializada.",
    category: "alumbrado"
  }
];

const CATEGORIES = {
  general: { label: "General", color: "bg-blue-100 text-blue-700" },
  extintores: { label: "Extintores", color: "bg-red-100 text-red-700" },
  bies: { label: "BIEs", color: "bg-orange-100 text-orange-700" },
  deteccion: { label: "Detección", color: "bg-purple-100 text-purple-700" },
  mantenimiento: { label: "Mantenimiento", color: "bg-green-100 text-green-700" },
  alumbrado: { label: "Alumbrado", color: "bg-yellow-100 text-yellow-700" }
};

export default function FireSafetyRegulationFAQ() {
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
        prompt: `Eres un experto en normativa de protección contra incendios en España, especialmente en el RD 513/2017 (Reglamento de instalaciones de protección contra incendios) y el DB SI del CTE.

Pregunta del usuario: ${chatQuestion}

Proporciona una respuesta clara, precisa y basada en la normativa vigente. Si es relevante, cita artículos específicos del RD 513/2017 o del Código Técnico de la Edificación.`
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
      <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-red-600" />
            Consulta sobre RD 513/2017
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-red-100">
            <p className="text-sm text-slate-600 mb-2">
              Pregunta sobre el Reglamento de instalaciones de protección contra incendios
            </p>
            <Textarea
              value={chatQuestion}
              onChange={(e) => setChatQuestion(e.target.value)}
              placeholder="Ej: ¿Qué mantenimiento requieren las BIEs según el reglamento?"
              className="mb-3"
              rows={3}
            />
            <Button 
              onClick={handleAskAI}
              disabled={isLoading || !chatQuestion.trim()}
              className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
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
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Book className="w-4 h-4 text-red-600" />
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
            <AlertCircle className="w-5 h-5 text-red-600" />
            Parámetros Clave RD 513/2017
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Extintores - Revisión</p>
              <p className="text-sm text-slate-600">Trimestral (usuario), Anual (mantenedor), Quinquenal (retimbrado)</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">BIEs - Mantenimiento</p>
              <p className="text-sm text-slate-600">Trimestral y Anual por empresa autorizada</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Detección - Verificación</p>
              <p className="text-sm text-slate-600">Trimestral (funcionamiento), Anual (limpieza y ajuste)</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Columna Seca</p>
              <p className="text-sm text-slate-600">Semestral y Quinquenal (prueba de presión)</p>
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
                <Book className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
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
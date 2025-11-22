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
    question: "¿Con qué frecuencia debe revisarse una instalación de gas?",
    answer: "Según la UNE 60670, la revisión periódica debe realizarse cada 5 años para instalaciones receptoras. Las instalaciones en locales de pública concurrencia (hoteles) deben revisarse cada año. Además, se requiere inspección inicial antes de la puesta en servicio.",
    category: "inspeccion"
  },
  {
    question: "¿Qué es la ITC-ICG y cuántas existen?",
    answer: "Las ITC-ICG son Instrucciones Técnicas Complementarias para Instalaciones de Combustibles Gaseosos, reguladas por el RD 919/2006. Existen 12 ITC que cubren aspectos como diseño, montaje, inspección, revisión, reparación y modificación de instalaciones.",
    category: "normativa"
  },
  {
    question: "¿Quién puede realizar la instalación de gas?",
    answer: "Solo empresas instaladoras de gas autorizadas e inscritas en el registro del órgano competente de la Comunidad Autónoma pueden realizar instalaciones, modificaciones o reparaciones de instalaciones de gas.",
    category: "instaladores"
  },
  {
    question: "¿Qué ventilación requiere un local con aparatos de gas?",
    answer: "Según UNE 60670, los locales con aparatos de gas deben tener ventilación natural permanente. La superficie mínima depende del tipo de aparato y potencia instalada, siendo generalmente de 10 cm² por cada kW de potencia, con un mínimo de 100 cm².",
    category: "ventilacion"
  },
  {
    question: "¿Cuándo es obligatorio instalar detector de gas?",
    answer: "Es obligatorio en aparcamientos cerrados con instalación de gas, cocinas industriales con potencia superior a 50 kW, y locales con aparatos de más de 70 kW sin ventilación suficiente. El detector debe activar un sistema de alarma y corte de suministro.",
    category: "seguridad"
  },
  {
    question: "¿Qué documentación debe tener una instalación de gas?",
    answer: "Debe incluir: certificado de instalación (modelo oficial), boletín de instalación, manual de uso y mantenimiento, contratos de suministro, certificados de revisiones periódicas, y libro de mantenimiento donde se registren todas las operaciones.",
    category: "documentacion"
  },
  {
    question: "¿Qué presión máxima puede tener una instalación receptora?",
    answer: "Las instalaciones receptoras se clasifican en: baja presión (hasta 0.05 bar), media presión A (0.05 a 0.4 bar), media presión B (0.4 a 4 bar), y alta presión (superior a 4 bar). La mayoría de instalaciones hoteleras operan en baja o media presión A.",
    category: "instalacion"
  },
  {
    question: "¿Qué mantenimiento requiere una caldera de gas?",
    answer: "El mantenimiento anual obligatorio incluye: limpieza de quemador e intercambiador, verificación de presiones y estanqueidad, comprobación de combustión y emisiones, revisión de seguridades, y limpieza de conductos de evacuación. Debe realizarse por empresa autorizada.",
    category: "mantenimiento"
  },
  {
    question: "¿Cómo debe ser la evacuación de productos de combustión?",
    answer: "Los productos de combustión deben evacuarse al exterior mediante conductos independientes para cada aparato o conductos colectivos homologados. Está prohibido evacuar a patios de ventilación cerrados o locales interiores. Los conductos deben cumplir UNE 123001.",
    category: "evacuacion"
  },
  {
    question: "¿Qué hacer en caso de fuga de gas?",
    answer: "Cerrar inmediatamente la llave de corte general, ventilar el local abriendo puertas y ventanas, no accionar interruptores ni encender llamas, evacuar el edificio si es necesario, avisar a la compañía de gas y a los bomberos, y no restablecer el suministro hasta que sea revisado por personal autorizado.",
    category: "seguridad"
  }
];

const CATEGORIES = {
  normativa: { label: "Normativa", color: "bg-blue-100 text-blue-700" },
  inspeccion: { label: "Inspección", color: "bg-purple-100 text-purple-700" },
  instaladores: { label: "Instaladores", color: "bg-green-100 text-green-700" },
  ventilacion: { label: "Ventilación", color: "bg-cyan-100 text-cyan-700" },
  seguridad: { label: "Seguridad", color: "bg-red-100 text-red-700" },
  documentacion: { label: "Documentación", color: "bg-yellow-100 text-yellow-700" },
  instalacion: { label: "Instalación", color: "bg-orange-100 text-orange-700" },
  mantenimiento: { label: "Mantenimiento", color: "bg-emerald-100 text-emerald-700" },
  evacuacion: { label: "Evacuación", color: "bg-slate-100 text-slate-700" }
};

export default function FuelRegulationFAQ() {
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
        prompt: `Eres un experto en normativa de instalaciones de gas y combustibles en España, especialmente en el RD 919/2006 (Reglamento de Distribución y Utilización de Combustibles Gaseosos) y la Norma UNE 60670.

Pregunta del usuario: ${chatQuestion}

Proporciona una respuesta clara, precisa y basada en la normativa vigente. Si es relevante, cita artículos específicos del RD 919/2006 o de la UNE 60670.`
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
      <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-600" />
            Consulta sobre RD 919/2006 y UNE 60670
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-orange-100">
            <p className="text-sm text-slate-600 mb-2">
              Pregunta sobre instalaciones de gas y combustibles
            </p>
            <Textarea
              value={chatQuestion}
              onChange={(e) => setChatQuestion(e.target.value)}
              placeholder="Ej: ¿Cada cuánto debe revisarse una instalación de gas en un hotel?"
              className="mb-3"
              rows={3}
            />
            <Button 
              onClick={handleAskAI}
              disabled={isLoading || !chatQuestion.trim()}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
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
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Book className="w-4 h-4 text-orange-600" />
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
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Parámetros Clave RD 919/2006 y UNE 60670
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Revisión Periódica</p>
              <p className="text-sm text-slate-600">Anual (hoteles) / Quinquenal (viviendas)</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Ventilación Cocina Industrial</p>
              <p className="text-sm text-slate-600">10 cm² por kW, mínimo 100 cm²</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Detector de Gas</p>
              <p className="text-sm text-slate-600">Obligatorio > 50 kW en cocinas</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Presión Instalación Típica</p>
              <p className="text-sm text-slate-600">Baja presión (hasta 0.05 bar)</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Mantenimiento Caldera</p>
              <p className="text-sm text-slate-600">Anual por empresa autorizada</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="font-semibold text-slate-800 mb-1">Documentación</p>
              <p className="text-sm text-slate-600">Certificado + Libro de mantenimiento</p>
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
                <Book className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
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
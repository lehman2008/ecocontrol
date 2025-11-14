import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  es: {
    // Navigation
    dashboard: "Panel de Control",
    analytics: "Analíticas y KPIs",
    reports: "Reportes PDF",
    equipment: "Inventario de Equipos",
    maintenance: "Mantenimientos",
    occupancy: "Ocupación",
    blueprints: "Planos Interactivos",
    documents: "Gestión Documental",
    iot: "Monitorización IoT",
    energy: "Energía",
    water: "Agua y ACS",
    fuel: "Gases y Combustibles",
    pool: "Piscina",
    
    // Categories
    principal: "Principal",
    management: "Gestión",
    iotSensors: "IoT & Sensores",
    consumption: "Consumos",
    
    // Common
    save: "Guardar",
    cancel: "Cancelar",
    edit: "Editar",
    delete: "Eliminar",
    view: "Ver",
    add: "Añadir",
    search: "Buscar",
    filter: "Filtrar",
    date: "Fecha",
    status: "Estado",
    notes: "Notas",
    actions: "Acciones",
    loading: "Cargando",
    noData: "No hay datos disponibles",
    
    // System
    systemStatus: "Estado del Sistema",
    lastUpdate: "Última actualización",
    operational: "Sistema operativo",
    logout: "Cerrar sesión",
  },
  en: {
    // Navigation
    dashboard: "Dashboard",
    analytics: "Analytics & KPIs",
    reports: "PDF Reports",
    equipment: "Equipment Inventory",
    maintenance: "Maintenance",
    occupancy: "Occupancy",
    blueprints: "Interactive Blueprints",
    documents: "Document Management",
    iot: "IoT Monitoring",
    energy: "Energy",
    water: "Water & DHW",
    fuel: "Gas & Fuel",
    pool: "Pool",
    
    // Categories
    principal: "Main",
    management: "Management",
    iotSensors: "IoT & Sensors",
    consumption: "Consumption",
    
    // Common
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    add: "Add",
    search: "Search",
    filter: "Filter",
    date: "Date",
    status: "Status",
    notes: "Notes",
    actions: "Actions",
    loading: "Loading",
    noData: "No data available",
    
    // System
    systemStatus: "System Status",
    lastUpdate: "Last update",
    operational: "System operational",
    logout: "Logout",
  },
  fr: {
    // Navigation
    dashboard: "Tableau de Bord",
    analytics: "Analytiques et KPI",
    reports: "Rapports PDF",
    equipment: "Inventaire d'Équipement",
    maintenance: "Maintenance",
    occupancy: "Occupation",
    blueprints: "Plans Interactifs",
    documents: "Gestion Documentaire",
    iot: "Surveillance IoT",
    energy: "Énergie",
    water: "Eau et ECS",
    fuel: "Gaz et Carburants",
    pool: "Piscine",
    
    // Categories
    principal: "Principal",
    management: "Gestion",
    iotSensors: "IoT & Capteurs",
    consumption: "Consommation",
    
    // Common
    save: "Enregistrer",
    cancel: "Annuler",
    edit: "Modifier",
    delete: "Supprimer",
    view: "Voir",
    add: "Ajouter",
    search: "Rechercher",
    filter: "Filtrer",
    date: "Date",
    status: "Statut",
    notes: "Notes",
    actions: "Actions",
    loading: "Chargement",
    noData: "Aucune donnée disponible",
    
    // System
    systemStatus: "État du Système",
    lastUpdate: "Dernière mise à jour",
    operational: "Système opérationnel",
    logout: "Se déconnecter",
  },
  de: {
    // Navigation
    dashboard: "Übersicht",
    analytics: "Analysen & KPIs",
    reports: "PDF-Berichte",
    equipment: "Geräteinventar",
    maintenance: "Wartung",
    occupancy: "Belegung",
    blueprints: "Interaktive Pläne",
    documents: "Dokumentenverwaltung",
    iot: "IoT-Überwachung",
    energy: "Energie",
    water: "Wasser & Warmwasser",
    fuel: "Gas & Kraftstoff",
    pool: "Schwimmbad",
    
    // Categories
    principal: "Haupt",
    management: "Verwaltung",
    iotSensors: "IoT & Sensoren",
    consumption: "Verbrauch",
    
    // Common
    save: "Speichern",
    cancel: "Abbrechen",
    edit: "Bearbeiten",
    delete: "Löschen",
    view: "Ansehen",
    add: "Hinzufügen",
    search: "Suchen",
    filter: "Filtern",
    date: "Datum",
    status: "Status",
    notes: "Notizen",
    actions: "Aktionen",
    loading: "Wird geladen",
    noData: "Keine Daten verfügbar",
    
    // System
    systemStatus: "Systemstatus",
    lastUpdate: "Letzte Aktualisierung",
    operational: "System betriebsbereit",
    logout: "Abmelden",
  },
  pt: {
    // Navigation
    dashboard: "Painel de Controle",
    analytics: "Análises e KPIs",
    reports: "Relatórios PDF",
    equipment: "Inventário de Equipamentos",
    maintenance: "Manutenção",
    occupancy: "Ocupação",
    blueprints: "Plantas Interativas",
    documents: "Gestão Documental",
    iot: "Monitorização IoT",
    energy: "Energia",
    water: "Água e AQS",
    fuel: "Gás e Combustíveis",
    pool: "Piscina",
    
    // Categories
    principal: "Principal",
    management: "Gestão",
    iotSensors: "IoT & Sensores",
    consumption: "Consumo",
    
    // Common
    save: "Guardar",
    cancel: "Cancelar",
    edit: "Editar",
    delete: "Eliminar",
    view: "Ver",
    add: "Adicionar",
    search: "Pesquisar",
    filter: "Filtrar",
    date: "Data",
    status: "Estado",
    notes: "Notas",
    actions: "Ações",
    loading: "Carregando",
    noData: "Sem dados disponíveis",
    
    // System
    systemStatus: "Estado do Sistema",
    lastUpdate: "Última atualização",
    operational: "Sistema operacional",
    logout: "Sair",
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app-language') || 'es';
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.es[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
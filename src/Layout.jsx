import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Zap, 
  Droplets, 
  Waves, 
  LayoutDashboard,
  LogOut,
  Package,
  Wrench,
  Flame,
  BarChart3,
  Users,
  FileText,
  Radio,
  Map,
  Bell,
  Shield,
  FireExtinguisher
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { LanguageProvider, useLanguage } from "@/components/shared/LanguageContext";
import LanguageSelector from "@/components/shared/LanguageSelector";
import NotificationBell from "@/components/shared/NotificationBell";
import { usePermissions } from "@/components/shared/PermissionGate";

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const { t } = useLanguage();
  const { hasPermission } = usePermissions();

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleLogout = () => {
    base44.auth.logout();
  };

  const navigationItems = [
    {
      title: t('dashboard'),
      url: createPageUrl("Dashboard"),
      icon: LayoutDashboard,
      gradient: "from-blue-500 to-cyan-500",
      category: "principal",
      permission: "dashboard"
    },
    {
      title: t('analytics'),
      url: createPageUrl("Analytics"),
      icon: BarChart3,
      gradient: "from-violet-500 to-purple-600",
      category: "principal",
      permission: "analytics"
    },
    {
      title: t('reports'),
      url: createPageUrl("Reports"),
      icon: FileText,
      gradient: "from-pink-500 to-rose-600",
      category: "principal",
      permission: "reports"
    },
    {
      title: "Alertas",
      url: createPageUrl("Alerts"),
      icon: Bell,
      gradient: "from-orange-500 to-red-600",
      category: "principal",
      permission: "alerts"
    },
    {
      title: t('equipment'),
      url: createPageUrl("Equipment"),
      icon: Package,
      gradient: "from-indigo-500 to-purple-500",
      category: "management",
      permission: "equipment"
    },
    {
      title: t('maintenance'),
      url: createPageUrl("Maintenance"),
      icon: Wrench,
      gradient: "from-green-500 to-emerald-500",
      category: "management",
      permission: "maintenance"
    },
    {
      title: t('occupancy'),
      url: createPageUrl("Occupancy"),
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      category: "management",
      permission: "occupancy"
    },
    {
      title: t('blueprints'),
      url: createPageUrl("Blueprints"),
      icon: Map,
      gradient: "from-blue-600 to-indigo-700",
      category: "management",
      permission: "blueprints"
    },
    {
      title: t('documents'),
      url: createPageUrl("Documents"),
      icon: FileText,
      gradient: "from-cyan-600 to-blue-700",
      category: "management",
      permission: "documents"
    },
    {
      title: t('iot'),
      url: createPageUrl("IoT"),
      icon: Radio,
      gradient: "from-cyan-500 to-blue-600",
      category: "iot",
      permission: "iot"
    },
    {
      title: t('energy'),
      url: createPageUrl("Energy"),
      icon: Zap,
      gradient: "from-amber-500 to-orange-500",
      category: "consumption",
      permission: "energy"
    },
    {
      title: t('water'),
      url: createPageUrl("Water"),
      icon: Droplets,
      gradient: "from-blue-400 to-blue-600",
      category: "consumption",
      permission: "water"
    },
    {
      title: t('fuel'),
      url: createPageUrl("Fuel"),
      icon: Flame,
      gradient: "from-orange-500 to-red-600",
      category: "consumption",
      permission: "fuel"
    },
    {
      title: t('pool'),
      url: createPageUrl("Pool"),
      icon: Waves,
      gradient: "from-cyan-400 to-teal-500",
      category: "consumption",
      permission: "pool"
    },
    {
      title: "Contra Incendios",
      url: createPageUrl("FireSafety"),
      icon: FireExtinguisher,
      gradient: "from-red-500 to-orange-600",
      category: "management",
      permission: "maintenance"
    },
  ];

  // Filtrar por permisos
  const filteredNavigationItems = navigationItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  const categories = {
    principal: t('principal'),
    management: t('management'),
    iot: t('iotSensors'),
    consumption: t('consumption'),
    admin: 'Administración'
  };

  const groupedNav = filteredNavigationItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Añadir Admin si es admin
  if (user?.role === 'admin') {
    if (!groupedNav.admin) groupedNav.admin = [];
    groupedNav.admin.push({
      title: 'Administración',
      url: createPageUrl("Admin"),
      icon: Shield,
      gradient: "from-purple-500 to-pink-600",
      category: "admin"
    });
  }

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary-deep-blue: #0A2463;
          --primary-ocean: #1E5F8C;
          --accent-gold: #D4AF37;
          --accent-coral: #FF6B6B;
          --neutral-light: #F8FAFB;
          --neutral-medium: #E8EDF2;
        }
        
        body {
          background: linear-gradient(135deg, var(--neutral-light) 0%, var(--neutral-medium) 100%);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, var(--primary-ocean) 0%, var(--accent-gold) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
      
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <Sidebar className="border-r-0 shadow-lg glass-effect">
          <SidebarHeader className="border-b border-white/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                <Waves className="w-7 h-7 text-white transform -rotate-3" />
              </div>
              <div>
                <h2 className="font-bold text-xl gradient-text">EcoControl</h2>
                <p className="text-xs text-slate-500 font-medium">Sistema de Mantenimiento</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup className="mb-4">
              <SidebarGroupContent>
                <div className="mx-2">
                  <LanguageSelector />
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {Object.entries(groupedNav).map(([category, items]) => (
              <SidebarGroup key={category}>
                <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-3 mb-1">
                  {categories[category]}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {items.map((item) => {
                      const isActive = location.pathname === item.url;
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            asChild 
                            className={`
                              relative overflow-hidden transition-all duration-300 rounded-xl
                              ${isActive 
                                ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg scale-105' 
                                : 'hover:bg-white/60 text-slate-700 hover:shadow-md'
                              }
                            `}
                          >
                            <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                              <item.icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                              <span className="font-semibold text-sm">{item.title}</span>
                              {isActive && (
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-3 mb-2">
                {t('systemStatus')}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 space-y-3 bg-white/40 rounded-xl mx-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">{t('lastUpdate')}</span>
                    <span className="font-bold text-slate-800">Hoy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-slate-600">{t('operational')}</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-white/50 p-4">
            {user && (
              <div className="flex items-center justify-between gap-3 p-3 bg-white/40 rounded-xl">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">
                      {user.full_name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {user.full_name || 'Usuario'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg"
                  title={t('logout')}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white/60 backdrop-blur-md border-b border-white/80 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 md:hidden">
                <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-xl transition-all" />
                <h1 className="text-xl font-bold gradient-text">EcoControl</h1>
              </div>
              <div className="hidden md:block" />
              <div className="flex items-center gap-3">
                <NotificationBell />
                <div className="md:hidden">
                  <LanguageSelector compact />
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <LanguageProvider>
      <LayoutContent children={children} currentPageName={currentPageName} />
    </LanguageProvider>
  );
}
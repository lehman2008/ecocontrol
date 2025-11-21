import Dashboard from './pages/Dashboard';
import Energy from './pages/Energy';
import Water from './pages/Water';
import Pool from './pages/Pool';
import Equipment from './pages/Equipment';
import Maintenance from './pages/Maintenance';
import Fuel from './pages/Fuel';
import Analytics from './pages/Analytics';
import Occupancy from './pages/Occupancy';
import Reports from './pages/Reports';
import IoT from './pages/IoT';
import Blueprints from './pages/Blueprints';
import Documents from './pages/Documents';
import Alerts from './pages/Alerts';
import Admin from './pages/Admin';
import FireSafety from './pages/FireSafety';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Energy": Energy,
    "Water": Water,
    "Pool": Pool,
    "Equipment": Equipment,
    "Maintenance": Maintenance,
    "Fuel": Fuel,
    "Analytics": Analytics,
    "Occupancy": Occupancy,
    "Reports": Reports,
    "IoT": IoT,
    "Blueprints": Blueprints,
    "Documents": Documents,
    "Alerts": Alerts,
    "Admin": Admin,
    "FireSafety": FireSafety,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};
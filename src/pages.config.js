import Dashboard from './pages/Dashboard';
import Energy from './pages/Energy';
import Water from './pages/Water';
import Pool from './pages/Pool';
import Equipment from './pages/Equipment';
import Maintenance from './pages/Maintenance';
import Fuel from './pages/Fuel';
import Analytics from './pages/Analytics';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Energy": Energy,
    "Water": Water,
    "Pool": Pool,
    "Equipment": Equipment,
    "Maintenance": Maintenance,
    "Fuel": Fuel,
    "Analytics": Analytics,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: Layout,
};
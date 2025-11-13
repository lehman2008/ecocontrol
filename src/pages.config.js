import Dashboard from './pages/Dashboard';
import Energy from './pages/Energy';
import Water from './pages/Water';
import Pool from './pages/Pool';
import Equipment from './pages/Equipment';
import Maintenance from './pages/Maintenance';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Energy": Energy,
    "Water": Water,
    "Pool": Pool,
    "Equipment": Equipment,
    "Maintenance": Maintenance,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: Layout,
};
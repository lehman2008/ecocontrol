import Dashboard from './pages/Dashboard';
import Energy from './pages/Energy';
import Water from './pages/Water';
import Pool from './pages/Pool';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Energy": Energy,
    "Water": Water,
    "Pool": Pool,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: Layout,
};
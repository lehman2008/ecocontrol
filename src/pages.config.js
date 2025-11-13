import Dashboard from './pages/Dashboard';
import Energy from './pages/Energy';
import Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Energy": Energy,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: Layout,
};
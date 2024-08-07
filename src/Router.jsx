import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InterstellarExplorer from './views/InterstellarExplorer/InterstellarExplorer';
import ConfigManagement from './views/ConfigManagement/ConfigManagement';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path='/interstellar-explorer' element={<InterstellarExplorer />} />
                <Route path='/config-management' element={<ConfigManagement />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;

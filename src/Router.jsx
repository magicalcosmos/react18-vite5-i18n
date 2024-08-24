import { 
    BrowserRouter as Router, 
    Routes, 
    Route, 
    useLocation,
    Navigate
 } from 'react-router-dom';
import { lazy, ReactNode, Suspense } from 'react';
import { Spin } from 'antd';

import Layout from './layout/Layout';

import InterstellarExplorer from './views/750/InterstellarExplorer/InterstellarExplorer';
import LucykGift from './views/375/LuckyGift/LuckyGift';

const Management = lazy(() => import('./views/Admin/Management/Management'));
const Login = lazy(() => import('./views/Admin/Login/Login'));
const DataSettings = lazy(() => import('./views/Admin/Management/DataSettings'));
const UploadDataSettings = lazy(() => import('./views/Admin/Management/UploadDataSettings'));
const DownloadDataSettings = lazy(() => import('./views/Admin/Management/DownloadDataSettings'));
const UploadGiftInventory = lazy(() => import('./views/Admin/Management/UploadGiftInventory'));
const UploadGiftInventoryIcons = lazy(() => import('./views/Admin/Management/UploadGiftInventoryIcons'));


// 避免闪屏
const lazyLoad = (conponent) => {
    return <Suspense fallback={<Spin />}>{conponent}</Suspense>;
};


const AppRoutes = () => {
    // const location = useLocation();
    // const { pathname } = location;
    // const pathname = 'test';
    const routes = [
        {
            path: '/',
            element: <Layout />,
            children: [
                {
                    path: '/',
                    element: lazyLoad(<Management />)
                  },
                  {
                    path: '/management',
                    element: lazyLoad(<Management />)
                  },
                  {
                    path: '/data/downloadDataSettings',
                    element: lazyLoad(<DownloadDataSettings />)
                  },
                  {
                    path: '/data/DataSettings',
                    element: lazyLoad(<DataSettings />)
                  },
                  {
                    path: '/data/uploadDataSettings',
                    element: lazyLoad(<UploadDataSettings />)
                  },
                  {
                    path: '/data/uploadGiftInventory',
                    element: lazyLoad(<UploadGiftInventory />)
                  },
                  {
                    path: '/data/uploadGiftInventoryIcons',
                    element: lazyLoad(<UploadGiftInventoryIcons />)
                  },
                  
            ]
        },
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/interstellar-explorer',
            element: <InterstellarExplorer />
        },        
        {
            path: '/lucky-gift',
            element: <LucykGift />
        },
    ];
    const handleRedirect = (item) => {
        return item.element;
        // if (pathname === '/') {
        //     return <Navigate to="/management" />;
        // }
        // if (pathname !== '/login') {
        //     return <Navigate to="/login" replace={true} />;
        // } else {
        //     return item.element;
        // }
    };
    const RouteNav = (param) => {
        return param.map(item => {
            return (
                <Route path={item.path} element={handleRedirect(item)} key={item.path}>
                    {item?.children && RouteNav(item.children)}
                </Route>
            );
        });
    };

    return (
        <Router>
            <Routes>
                {RouteNav(routes)}
            </Routes>
        </Router>
    );
};

export default AppRoutes;


import './App.css';
import AppRoutes from './Router';
import { useTranslation } from 'react-i18next';
import  { useLocation } from '@/hooks/Tools';

const App = () => {
  const { t, i18n } = useTranslation();
  const { getParamByKey } = useLocation();
  const lang = getParamByKey('lang');
  i18n.changeLanguage(lang || 'id');

  return (
    <>
     <AppRoutes />
    </>
  );
}

export default App;

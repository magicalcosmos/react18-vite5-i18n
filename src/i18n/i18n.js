import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationZH from './locales/zh.json';
import translationID from './locales/id.json';

// the translations
const resources = {
  zh: {
    translation: translationZH
  },
  id: {
    translation: translationID
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'zh', // default language
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;

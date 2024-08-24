import { IAppConfig } from 'tt-library-angular-porfolio';

export const environment: IAppConfig = {
  production: false,
  defaultLang: 'vi',
  cookieStorageLangKey: '_lang',
  cookieStorageDeviceIdKey: '_deviceId',
  tokenKey: '_token',
  assetsUrl: 'http://localhost:8080/',
  apiUrl: 'http://localhost:9090/',
  email: 'trinhthanhtung1010@gmail.com',
  phoneNumber: '+84836450670',
  defaultPageSize: 10,
  timeoutMs: 180000,
  settingFormat: {
    dateTime: {
      date: "DD/MM/YYYY",
      time: "HH:mm:ss a",
      dateTime: "DD/MM/YYYY HH:mm:ss",
      portfolioDate: "MMM - yyyy",
      portfolioDateResponsive: "yyyy"
    },
  },
  firebaseConfig: {
    apiKey: "AIzaSyAiujLVKqBWolrMcJX7ULsBnEaOx7DG40s",
    authDomain: "tt-portfolio-dev.firebaseapp.com",
    projectId: "tt-portfolio-dev",
    storageBucket: "tt-portfolio-dev.appspot.com",
    messagingSenderId: "352786881862",
    appId: "1:352786881862:web:3d1297c81be84d19c89947",
    measurementId: "G-J6LX06V4KT"
  },
  googleConfig: {
    downloadCV: "https://drive.google.com/uc?export=download&id=13GFK_OWfcxseMy5gjG2TyLLbIPcc8LML",
  },
  remoteModuleUrl: {
    reactManagement: "http://localhost:3000/static/js/bundle.js",
    angularPortfolio: "http://localhost:8081/",
    angularAuth: 'http://localhost:8082/',
    angularManagement: 'http://localhost:8083/',
    angularWinfitOnline: 'http://localhost:8085/',
    vueAnimation: 'http://localhost:8084/'
  },
};

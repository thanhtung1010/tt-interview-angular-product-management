import { IAppConfig } from 'tt-library-angular-porfolio';

export const environment: IAppConfig = {
  production: true,
  defaultLang: '',
  cookieStorageLangKey: '',
  cookieStorageDeviceIdKey: '',
  tokenKey: '',
  assetsUrl: '',
  apiUrl: '',
  email: '',
  phoneNumber: '',
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
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  },
  googleConfig: {
    downloadCV: "",
  },
  remoteModuleUrl: {
    reactManagement: "",
    angularPortfolio: "",
    angularAuth: "",
    angularManagement: '',
    angularWinfitOnline: '',
    vueAnimation: ""
  },
}

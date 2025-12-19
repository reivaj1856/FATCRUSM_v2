import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp({
      projectId: "studio-1419285377-80c8c",
      appId: "1:207220384453:web:6149709f26f27fd52586ac",
      storageBucket: "studio-1419285377-80c8c.firebasestorage.app",
      apiKey: "AIzaSyApULqCEm1leXyZ2UvbkhxWQna0X-wo0Ig",
      authDomain: "studio-1419285377-80c8c.firebaseapp.com",
      messagingSenderId: "207220384453"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};

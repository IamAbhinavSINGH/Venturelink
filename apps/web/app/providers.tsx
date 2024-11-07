'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { Suspense } from 'react';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <Suspense>
        {children}
      </Suspense>
    </SessionProvider>
  );
};
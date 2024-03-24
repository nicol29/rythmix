'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { ReactNode } from 'react';

export default function ProgressBarProvider({ 
  children
}: { 
  children: ReactNode 
}) {
  return (
    <>
      {children}
      <ProgressBar
        color="#f97516"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};
"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

interface ProviderProps {
  children: ReactNode;
  session: any;
}

const AuthContextProvider: React.FC<ProviderProps> = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}

export default AuthContextProvider;
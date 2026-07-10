"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthSessionContext = createContext(null);
const AuthSessionActionsContext = createContext(null);

export function AuthSessionProvider({ user, children }) {
  const [sessionUser, setSessionUser] = useState(user);
  const actions = useMemo(
    () => ({
      setUser: setSessionUser,
    }),
    []
  );

  useEffect(() => {
    setSessionUser(user);
  }, [user]);

  return (
    <AuthSessionContext.Provider value={sessionUser}>
      <AuthSessionActionsContext.Provider value={actions}>
        {children}
      </AuthSessionActionsContext.Provider>
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const value = useContext(AuthSessionContext);

  if (value === undefined) {
    throw new Error("useAuthSession must be used within AuthSessionProvider.");
  }

  return value;
}

export function useAuthSessionActions() {
  const value = useContext(AuthSessionActionsContext);

  if (value === undefined) {
    throw new Error("useAuthSessionActions must be used within AuthSessionProvider.");
  }

  return value;
}

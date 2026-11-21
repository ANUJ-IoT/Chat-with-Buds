import { createContext, useContext, useState } from "react";

const AuthProvider = createContext();

export function AuthContext({ children }) {
  const [user, setUser] = useState(null);
  return (
    <>
      <AuthProvider.Provider value={{ user, setUser }}>
        {children}
      </AuthProvider.Provider>
    </>
  );
}

export function useAuth() {
  return useContext(AuthProvider);
}

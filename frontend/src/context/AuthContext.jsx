import { createContext, useEffect, useMemo, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  signupUser,
} from "../api/authApi";

const AuthContext = createContext(null);

const extractErrorMessage = (error) => {
  if (error?.response?.data?.details?.length) {
    return error.response.data.details[0].msg;
  }

  return error?.response?.data?.message || "Something went wrong. Please try again.";
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrateAuth = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrateAuth();
  }, []);

  const signup = async (formData) => {
    try {
      const response = await signupUser(formData);
      setUser(response.user);
      return { ok: true, message: response.message || "Signup successful" };
    } catch (error) {
      return { ok: false, message: extractErrorMessage(error) };
    }
  };

  const login = async (formData) => {
    try {
      const response = await loginUser(formData);
      setUser(response.user);
      return { ok: true, message: response.message || "Login successful" };
    } catch (error) {
      return { ok: false, message: extractErrorMessage(error) };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      signup,
      login,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

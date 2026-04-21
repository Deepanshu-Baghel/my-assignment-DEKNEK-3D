import { createContext, useEffect, useMemo, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  resendVerificationEmail,
  signupUser,
  verifyEmailToken,
} from "../api/authApi";

const AuthContext = createContext(null);

const extractError = (error) => {
  if (error?.response?.data?.details?.length) {
    return {
      message: error.response.data.details[0].msg,
      code: null,
      details: error.response.data.details,
    };
  }

  if (!error?.response && error?.code === "ERR_NETWORK") {
    return {
      message: "Backend server unreachable. Start backend and verify MongoDB URI/auth settings.",
      code: "NETWORK_ERROR",
      details: null,
    };
  }

  const data = error?.response?.data || {};
  const details = data.details || null;

  return {
    message: data.message || "Something went wrong. Please try again.",
    code: details && !Array.isArray(details) ? details.code || null : null,
    details,
  };
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
      return { ok: true, message: response.message || "Signup successful" };
    } catch (error) {
      return { ok: false, ...extractError(error) };
    }
  };

  const login = async (formData) => {
    try {
      const response = await loginUser(formData);
      setUser(response.user);
      return { ok: true, message: response.message || "Login successful" };
    } catch (error) {
      return { ok: false, ...extractError(error) };
    }
  };

  const verifyEmail = async (token) => {
    try {
      const response = await verifyEmailToken({ token });
      return { ok: true, message: response.message || "Email verified" };
    } catch (error) {
      return { ok: false, ...extractError(error) };
    }
  };

  const resendVerification = async (email) => {
    try {
      const response = await resendVerificationEmail({ email });
      return {
        ok: true,
        message: response.message || "Verification email sent.",
      };
    } catch (error) {
      return { ok: false, ...extractError(error) };
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
      verifyEmail,
      resendVerification,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

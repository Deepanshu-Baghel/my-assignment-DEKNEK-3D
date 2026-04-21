import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "../components/ThemeToggle";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, resendVerification } = useAuth();

  const [formData, setFormData] = useState({
    email: location.state?.signupEmail || "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [needsVerificationHelp, setNeedsVerificationHelp] = useState(false);

  useEffect(() => {
    if (location.state?.verifiedNotice) {
      setMessageType("success");
      setMessage(location.state.verifiedNotice);
      setNeedsVerificationHelp(true);
    }
  }, [location.state]);

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const result = await login(formData);
    if (!result.ok) {
      setMessageType("error");
      setMessage(result.message);
      setNeedsVerificationHelp(result.code === "EMAIL_NOT_VERIFIED");
      setSubmitting(false);
      return;
    }

    setMessageType("success");
    setMessage(result.message);
    setNeedsVerificationHelp(false);
    const fallbackPath = "/dashboard";
    const redirectPath = location.state?.from || fallbackPath;
    navigate(redirectPath, { replace: true });
  };

  const handleResendVerification = async () => {
    if (!formData.email.trim()) {
      setMessageType("error");
      setMessage("Enter your email first, then resend verification.");
      return;
    }

    setResending(true);
    const result = await resendVerification(formData.email);
    setMessageType(result.ok ? "success" : "error");
    setMessage(result.message);
    setResending(false);
  };

  return (
    <main className="auth-page">
      <header className="auth-header">
        <div>
          <span className="brand-tag">Secure Task Space</span>
          <h1>Welcome back.</h1>
          <p className="subtitle">Log in to continue managing your tasks in one clean dashboard.</p>
        </div>

        <ThemeToggle />
      </header>

      <section className="panel auth-grid">
        <aside className="auth-art">
          <h2>Keep momentum, securely.</h2>
          <p>
            Your session is protected with JWT and HTTP-only cookies, while your data stays tied to your account.
          </p>
          <div className="auth-orbs" />
        </aside>

        <div className="auth-form-wrap">
          <form className="auth-form" onSubmit={handleSubmit}>
            {message && (
              <div className={`message message-${messageType}`} role="alert">
                {message}
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Signing in..." : "Login"}
            </button>

            {needsVerificationHelp ? (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={handleResendVerification}
                disabled={resending}
              >
                {resending ? "Sending verification email..." : "Resend verification email"}
              </button>
            ) : null}

            <p className="auth-footer">
              New here? <Link className="btn-link" to="/signup">Create an account</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;

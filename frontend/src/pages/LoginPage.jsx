import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [submitting, setSubmitting] = useState(false);

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
      setSubmitting(false);
      return;
    }

    setMessageType("success");
    setMessage(result.message);
    const fallbackPath = "/dashboard";
    const redirectPath = location.state?.from || fallbackPath;
    navigate(redirectPath, { replace: true });
  };

  return (
    <main className="auth-page">
      <header className="auth-header">
        <div>
          <span className="brand-tag">Secure Task Space</span>
          <h1>Welcome back.</h1>
          <p className="subtitle">Log in to continue managing your tasks in one clean dashboard.</p>
        </div>
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

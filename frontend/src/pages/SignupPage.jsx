import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "../components/ThemeToggle";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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

    const result = await signup(formData);

    if (!result.ok) {
      setMessageType("error");
      setMessage(result.message);
      setSubmitting(false);
      return;
    }

    setMessageType("success");
    setMessage(result.message);
    navigate("/login", {
      replace: true,
      state: {
        signupEmail: formData.email,
        verifiedNotice: "Account created. Please verify your email before login.",
      },
    });
  };

  return (
    <main className="auth-page">
      <header className="auth-header">
        <div>
          <span className="brand-tag">Secure Task Space</span>
          <h1>Create your account.</h1>
          <p className="subtitle">Sign up to manage your personal task board with protected access.</p>
        </div>

        <ThemeToggle />
      </header>

      <section className="panel auth-grid">
        <aside className="auth-art">
          <h2>Fast setup, safe by default.</h2>
          <p>
            Passwords are hashed with bcrypt, and authenticated requests are secured with JWT sessions.
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
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
                minLength={6}
                required
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Creating account..." : "Signup"}
            </button>

            <p className="auth-footer">
              Already registered? <Link className="btn-link" to="/login">Go to login</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};

export default SignupPage;

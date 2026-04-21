import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../hooks/useAuth";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuth();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing. Please request a new verification email.");
      return;
    }

    let mounted = true;

    const verify = async () => {
      const result = await verifyEmail(token);
      if (!mounted) {
        return;
      }

      setStatus(result.ok ? "success" : "error");
      setMessage(result.message);
    };

    verify();

    return () => {
      mounted = false;
    };
  }, [token, verifyEmail]);

  return (
    <main className="auth-page">
      <header className="auth-header">
        <div>
          <span className="brand-tag">Secure Task Space</span>
          <h1>Email verification</h1>
          <p className="subtitle">We are confirming your email ownership before granting full access.</p>
        </div>

        <ThemeToggle />
      </header>

      <section className="panel auth-grid">
        <aside className="auth-art">
          <h2>One final step.</h2>
          <p>
            Verifying your email helps us keep fake and temporary accounts away from your workspace.
          </p>
          <div className="auth-orbs" />
        </aside>

        <div className="auth-form-wrap">
          <div className="auth-form">
            <div
              className={`message ${
                status === "error" ? "message-error" : "message-success"
              }`}
            >
              {message}
            </div>

            <p className="auth-footer">
              {status === "success" ? (
                <>
                  Continue to <Link className="btn-link" to="/login">login</Link>
                </>
              ) : (
                <>
                  Go back to <Link className="btn-link" to="/signup">signup</Link> and request a new email.
                </>
              )}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default VerifyEmailPage;

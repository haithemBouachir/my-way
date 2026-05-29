import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../shared/api/client";
import { useAuth } from "../../shared/auth/AuthContext";
import "./AuthPage.css";

type AuthResponse = {
  token: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
};

export function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setSession } = useAuth();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister ? { fullName, email, password } : { email, password };

      const response = await apiClient.post<AuthResponse>(endpoint, payload);
      setSession(response.data.token, response.data.fullName, response.data.avatarUrl);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Authentication failed. Please check your credentials.");
    }
  };

  return (
    <section className="auth-shell">
      <article className="auth-card">
        <h2>{isRegister ? "Create your account" : "Welcome back"}</h2>
        <p>Access your career dashboard and recommendations.</p>

        <form onSubmit={submit} className="auth-form">
          {isRegister ? (
            <label>
              Full name
              <input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
            </label>
          ) : null}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </label>

          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit">{isRegister ? "Register" : "Login"}</button>
        </form>

        <button
          type="button"
          className="auth-switch"
          onClick={() => setIsRegister((current) => !current)}
        >
          {isRegister ? "Already have an account? Login" : "No account yet? Register"}
        </button>
      </article>
    </section>
  );
}

import { useState } from "react";
import * as api from "../api.js";

export default function AuthForm({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isLogin = mode === "login";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      // Sign up = register, then log in straight away
      if (!isLogin) await api.register(email, password);
      const { access_token } = await api.login(email, password);
      api.setToken(access_token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{isLogin ? "Log in" : "Create account"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password (min 8 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
        required
      />
      {error && <p className="error">{error}</p>}
      <button disabled={busy}>{busy ? "Please wait..." : isLogin ? "Log in" : "Sign up"}</button>
      <button
        type="button"
        className="link"
        onClick={() => {
          setMode(isLogin ? "register" : "login");
          setError("");
        }}
      >
        {isLogin ? "No account? Sign up" : "Have an account? Log in"}
      </button>
    </form>
  );
}

import { useEffect, useState } from "react";
import { clearToken, getToken, setUnauthorizedHandler } from "./api.js";
import AuthForm from "./components/AuthForm.jsx";
import Tasks from "./components/Tasks.jsx";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(Boolean(getToken()));

  const logout = () => {
    clearToken();
    setLoggedIn(false);
  };

  // Tokens expire after 30 minutes; any 401 response sends the user back to login
  useEffect(() => setUnauthorizedHandler(logout), []);

  return (
    <main className="container">
      <header>
        <h1>Task Manager</h1>
        {loggedIn && (
          <button className="link" onClick={logout}>
            Log out
          </button>
        )}
      </header>
      {loggedIn ? <Tasks /> : <AuthForm onLogin={() => setLoggedIn(true)} />}
    </main>
  );
}

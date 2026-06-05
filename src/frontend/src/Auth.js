import React, { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // SIGN UP
  const signUp = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) alert(error.message);
    else alert("Signup successful! Check email");

    setLoading(false);
  };

  // LOGIN
  const login = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
    else setUser(data.user);

    setLoading(false);
  };

  return (
    <div className="auth">
      <h2>Login / Signup</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login} disabled={loading}>
        Login
      </button>

      <button onClick={signUp} disabled={loading}>
        Signup
      </button>
    </div>
  );
}
"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Signup() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password) { alert("Fill all fields"); return; }
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) { alert(error.message); setLoading(false); return; }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        name: fullName,
        email,
        role,
        is_live: false,
        offers_delivery: false,
        offers_pickup: true,
      });

      if (profileError) { alert("Profile error: " + profileError.message); setLoading(false); return; }

      alert("Account created! Please login.");
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #EBF1FF 0%, #F4F6FB 60%)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .auth-input {
          width: 100%; padding: 14px 16px; border: 2px solid #E4EAFF;
          border-radius: 12px; font-size: 15px; font-weight: 500; color: #0D1B3E;
          background: white; font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none; transition: all 0.2s;
        }
        .auth-input:focus { border-color: #1A6BFF; box-shadow: 0 0 0 4px rgba(26,107,255,0.1); }
        .auth-btn {
          width: 100%; padding: 16px; background: #1A6BFF; color: white; border: none;
          border-radius: 14px; font-size: 16px; font-weight: 800; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; margin-top: 8px;
        }
        .auth-btn:hover:not(:disabled) { background: #1255CC; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,107,255,0.35); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .field-label { display: block; font-size: 12px; font-weight: 700; color: #8A96B5; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 7px; }
        .role-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .role-option {
          padding: 14px; border-radius: 12px; border: 2px solid #E4EAFF;
          background: white; text-align: center; cursor: pointer; transition: all 0.2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .role-option.selected { border-color: #1A6BFF; background: #EBF1FF; }
        .role-icon { font-size: 24px; margin-bottom: 4px; }
        .role-label { font-size: 13px; font-weight: 700; color: #0D1B3E; }
        .role-sub { font-size: 11px; color: #8A96B5; margin-top: 2px; }
      `}</style>

      <div style={{
        background: "#1A6BFF",
        height: 180,
        borderBottomLeftRadius: "50% 40px",
        borderBottomRightRadius: "50% 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 28,
        marginBottom: -20,
        boxShadow: "0 8px 30px rgba(26,107,255,0.3)",
      }}>
        <div style={{ fontSize: 36, marginBottom: 4 }}>🫧</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "white", letterSpacing: "-1px" }}>Join Bubbry</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>Create your free account</div>
      </div>

      <div style={{ flex: 1, padding: "32px 24px 48px", maxWidth: 420, margin: "0 auto", width: "100%" }}>
        <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 8px 40px rgba(26,107,255,0.1)", border: "1.5px solid #E4EAFF" }}>

          <div style={{ marginBottom: 16 }}>
            <label className="field-label">Full Name</label>
            <input className="auth-input" placeholder="Rahul Sharma" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="field-label">Email</label>
            <input type="email" className="auth-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="field-label">Password</label>
            <input type="password" className="auth-input" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="field-label" style={{ marginBottom: 10 }}>I am a...</label>
            <div className="role-toggle">
              <div className={`role-option ${role === "customer" ? "selected" : ""}`} onClick={() => setRole("customer")}>
                <div className="role-icon">🛍️</div>
                <div className="role-label">Customer</div>
                <div className="role-sub">I want to shop</div>
              </div>
              <div className={`role-option ${role === "shopkeeper" ? "selected" : ""}`} onClick={() => setRole("shopkeeper")}>
                <div className="role-icon">🏪</div>
                <div className="role-label">Shopkeeper</div>
                <div className="role-sub">I sell products</div>
              </div>
            </div>
          </div>

          <button className="auth-btn" onClick={handleSignup} disabled={loading}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#8A96B5", fontWeight: 500 }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#1A6BFF", fontWeight: 700, textDecoration: "none" }}>Login</a>
        </p>
      </div>
    </div>
  );
}

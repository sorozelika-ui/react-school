import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { loginParent } from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Remplis tous les champs !");
      return;
    }
    setLoading(true);
    try {
      const response = await loginParent(email, password);
      const parent = response.data;
      localStorage.setItem("parent", JSON.stringify(parent));
      toast.success("Bienvenue " + parent.prenom + " " + parent.nom + " !");
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Aucun compte trouvé avec cet email.");
      } else if (error.response?.status === 401) {
        toast.error("Mot de passe incorrect.");
      } else {
        toast.error("Erreur de connexion. Vérifie que le serveur est démarré.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0a0f1e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      
      
      <div style={{ position: "fixed", top: -200, right: -200, width: 500, height: 500, background: "radial-gradient(circle, rgba(244,168,64,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -200, left: -200, width: 400, height: 400, background: "radial-gradient(circle, rgba(46,204,138,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            style={{ marginBottom: "1rem" }}
          >
            <svg width="72" height="72" viewBox="0 0 72 72" style={{ margin: "0 auto", display: "block" }}>
              <circle cx="36" cy="36" r="36" fill="#f4a840"/>
              <text x="36" y="50" textAnchor="middle" fontFamily="Georgia, serif" fontSize="44" fontWeight="900" fill="white">E</text>
            </svg>
          </motion.div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 900, color: "#f4a840" }}>
            École<span style={{ color: "#e8edf5", fontWeight: 400 }}>Track</span>
          </div>
          <p style={{ color: "#8892a4", fontSize: "0.88rem", marginTop: 6 }}>Espace sécurisé pour les parents</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ background: "#161f38", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: "2rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.8rem" }}>
            <ShieldCheck size={16} color="#2ecc8a" />
            <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#2ecc8a" }}>Connexion sécurisée — Père ou Mère</span>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1.2rem" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#8892a4", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Adresse email
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} color="#8892a4" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  style={{ width: "100%", background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.07)", color: "#e8edf5", padding: "12px 16px 12px 42px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(244,168,64,0.5)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.07)"}
                />
              </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#8892a4", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="#8892a4" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: "100%", background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.07)", color: "#e8edf5", padding: "12px 48px 12px 42px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(244,168,64,0.5)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.07)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8892a4", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? "none" : "0 8px 24px rgba(244,168,64,0.25)" }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              style={{ width: "100%", padding: "14px", background: loading ? "rgba(244,168,64,0.4)" : "#f4a840", color: "#0a0f1e", border: "none", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#0a0f1e", borderRadius: "50%" }}
                  />
                  Connexion en cours…
                </>
              ) : "Se connecter →"}
            </motion.button>
          </form>

          <p style={{ textAlign: "center", color: "#8892a4", fontSize: "0.78rem", marginTop: "1.5rem", lineHeight: 1.7 }}>
  Vous n'avez pas de compte ?{" "}
  <a href="/register" style={{ color: "#f4a840", fontWeight: 700, textDecoration: "none" }}>
    S'inscrire
  </a>
</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
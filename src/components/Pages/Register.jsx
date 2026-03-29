import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone, MapPin, Briefcase, Eye, EyeOff, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const ROLES = [
  { id: "parent", label: "Parent", icon: "👨‍👩‍👧", desc: "Suivre les notes de votre enfant" },
  { id: "professeur", label: "Professeur", icon: "👨‍🏫", desc: "Gérer les notes et bulletins" },
  { id: "educateur", label: "Éducateur", icon: "🧑‍💼", desc: "Encadrement et suivi scolaire" },
  { id: "administrateur", label: "Administrateur", icon: "🏫", desc: "Gestion complète de l'école" },
];

const inputStyle = {
  width: "100%",
  background: "#0a0f1e",
  border: "1px solid rgba(255,255,255,0.07)",
  color: "#e8edf5",
  padding: "12px 16px 12px 42px",
  borderRadius: 10,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.95rem",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#8892a4",
  marginBottom: 7,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

function Field({ icon: Icon, label, type = "text", value, onChange, placeholder, show, onToggle }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <Icon size={15} color="#8892a4" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        <input
          type={type === "password" ? (show ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = "rgba(244,168,64,0.5)"}
          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.07)"}
        />
        {type === "password" && (
          <button type="button" onClick={onToggle} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8892a4", cursor: "pointer" }}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [step, setStep] = useState(0); // 0=choix rôle, 1=infos, 2=infos mère (parent), 3=confirmation
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState({ pere: false, mere: false, main: false });

  // Données père / parent
  const [pere, setPere] = useState({ nom: "", prenom: "", contact: "", email: "", password: "", quartier: "", profession: "" });
  // Données mère
  const [mere, setMere] = useState({ nom: "", prenom: "", contact: "", email: "", password: "", quartier: "", profession: "" });
  // Données autres rôles
  const [user, setUser] = useState({ nom: "", prenom: "", contact: "", email: "", password: "", quartier: "", profession: "" });

  const isParent = role === "parent";
  const totalSteps = isParent ? 4 : 3;

  function nextStep() {
    if (step === 0 && !role) { toast.error("Choisis ton rôle !"); return; }
    if (isParent && step === 1) {
      if (!pere.nom || !pere.prenom || !pere.email || !pere.password || !pere.contact) {
        toast.error("Remplis tous les champs obligatoires du père !");
        return;
      }
    }
    if (isParent && step === 2) {
      if (!mere.nom || !mere.prenom || !mere.email || !mere.password || !mere.contact) {
        toast.error("Remplis tous les champs obligatoires de la mère !");
        return;
      }
    }
    if (!isParent && step === 1) {
      if (!user.nom || !user.prenom || !user.email || !user.password) {
        toast.error("Remplis tous les champs obligatoires !");
        return;
      }
    }
    setStep(s => s + 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isParent) {
        await api.post("/parents", {
          nom_pere: pere.nom,
          prenom_pere: pere.prenom,
          contact_pere: pere.contact,
          email_pere: pere.email,
          pass_pere: pere.password,
          quartier_pere: pere.quartier,
          profession_pere: pere.profession,
          nom_mere: mere.nom,
          prenom_mere: mere.prenom,
          contact_mere: mere.contact,
          email_mere: mere.email,
          pass_mere: mere.password,
          quartier_mere: mere.quartier,
          profession_mere: mere.profession,
        });
      } else {
        // Pour les autres rôles — à adapter selon tes routes API
        await api.post(`/${role}s`, {
          nom: user.nom,
          prenom: user.prenom,
          contact: user.contact,
          email: user.email,
          password: user.password,
          quartier: user.quartier,
          profession: user.profession,
          role: role,
        });
      }
      toast.success("Inscription réussie ! Connecte-toi maintenant 🎉");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0][0];
        toast.error(firstError);
      } else {
        toast.error("Erreur lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  }

  const progressWidth = `${((step) / (totalSteps - 1)) * 100}%`;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0a0f1e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}>
      
      <div style={{ position: "fixed", top: -200, right: -200, width: 500, height: 500, background: "radial-gradient(circle, rgba(244,168,64,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -200, left: -200, width: 400, height: 400, background: "radial-gradient(circle, rgba(46,204,138,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 500, position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <svg width="56" height="56" viewBox="0 0 72 72" style={{ margin: "0 auto 0.8rem", display: "block" }}>
            <circle cx="36" cy="36" r="36" fill="#f4a840"/>
            <text x="36" y="50" textAnchor="middle" fontFamily="Georgia, serif" fontSize="44" fontWeight="900" fill="white">E</text>
          </svg>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.7rem", fontWeight: 900, color: "#f4a840" }}>
            École<span style={{ color: "#e8edf5", fontWeight: 400 }}>Track</span>
          </div>
          <p style={{ color: "#8892a4", fontSize: "0.85rem", marginTop: 4 }}>Création de compte</p>
        </div>

        {/* Barre de progression */}
        {step > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: "0.75rem", color: "#8892a4", fontWeight: 600 }}>
                {isParent
                  ? ["", "Informations du père", "Informations de la mère", "Confirmation"][step]
                  : ["", "Vos informations", "Confirmation"][step]}
              </span>
              <span style={{ fontSize: "0.75rem", color: "#f4a840", fontWeight: 700 }}>
                Étape {step}/{totalSteps - 1}
              </span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 99, height: 4, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: progressWidth }}
                transition={{ duration: 0.4 }}
                style={{ height: "100%", background: "linear-gradient(90deg, #f4a840, #2ecc8a)", borderRadius: 99 }}
              />
            </div>
          </div>
        )}

        {/* Card principale */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          style={{ background: "#161f38", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: "2rem" }}
        >

          {/* ÉTAPE 0 — Choix du rôle */}
          {step === 0 && (
            <>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>
                Qui êtes-vous ?
              </h2>
              <p style={{ color: "#8892a4", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                Choisissez votre rôle pour créer votre compte.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "1.5rem" }}>
                {ROLES.map((r) => (
                  <motion.button
                    key={r.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setRole(r.id)}
                    type="button"
                    style={{
                      background: role === r.id ? "rgba(244,168,64,0.12)" : "rgba(255,255,255,0.03)",
                      border: role === r.id ? "2px solid rgba(244,168,64,0.6)" : "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 14,
                      padding: "1rem",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>{r.icon}</div>
                    <div style={{ color: role === r.id ? "#f4a840" : "#fff", fontWeight: 700, fontSize: "0.9rem", marginBottom: 4 }}>{r.label}</div>
                    <div style={{ color: "#8892a4", fontSize: "0.75rem", lineHeight: 1.4 }}>{r.desc}</div>
                  </motion.button>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={nextStep}
                type="button"
                style={{ width: "100%", padding: "13px", background: "#f4a840", color: "#0a0f1e", border: "none", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                Continuer <ChevronRight size={18} />
              </motion.button>
            </>
          )}

          {/* ÉTAPE 1 — Infos père (parent) ou infos utilisateur (autres) */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "1.5rem" }}>
                {isParent ? "👨 Informations du père" : `${ROLES.find(r => r.id === role)?.icon} Vos informations`}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.8rem" }}>
                <Field icon={User} label="Nom *" value={isParent ? pere.nom : user.nom} onChange={(e) => isParent ? setPere({ ...pere, nom: e.target.value }) : setUser({ ...user, nom: e.target.value })} placeholder="Nom de famille" />
                <Field icon={User} label="Prénom *" value={isParent ? pere.prenom : user.prenom} onChange={(e) => isParent ? setPere({ ...pere, prenom: e.target.value }) : setUser({ ...user, prenom: e.target.value })} placeholder="Prénom" />
              </div>
              <Field icon={Mail} label="Email *" type="email" value={isParent ? pere.email : user.email} onChange={(e) => isParent ? setPere({ ...pere, email: e.target.value }) : setUser({ ...user, email: e.target.value })} placeholder="email@exemple.com" />
              <Field icon={Lock} label="Mot de passe *" type="password" value={isParent ? pere.password : user.password} onChange={(e) => isParent ? setPere({ ...pere, password: e.target.value }) : setUser({ ...user, password: e.target.value })} placeholder="Minimum 6 caractères" show={isParent ? showPass.pere : showPass.main} onToggle={() => setShowPass({ ...showPass, [isParent ? "pere" : "main"]: !showPass[isParent ? "pere" : "main"] })} />
              <Field icon={Phone} label="Contact *" type="tel" value={isParent ? pere.contact : user.contact} onChange={(e) => isParent ? setPere({ ...pere, contact: e.target.value }) : setUser({ ...user, contact: e.target.value })} placeholder="+225 07 00 00 00 00" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.8rem" }}>
                <Field icon={MapPin} label="Quartier" value={isParent ? pere.quartier : user.quartier} onChange={(e) => isParent ? setPere({ ...pere, quartier: e.target.value }) : setUser({ ...user, quartier: e.target.value })} placeholder="Quartier" />
                <Field icon={Briefcase} label="Profession" value={isParent ? pere.profession : user.profession} onChange={(e) => isParent ? setPere({ ...pere, profession: e.target.value }) : setUser({ ...user, profession: e.target.value })} placeholder="Profession" />
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setStep(0)} style={{ flex: 1, padding: "13px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#8892a4", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <ChevronLeft size={16} /> Retour
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" style={{ flex: 2, padding: "13px", background: "#f4a840", color: "#0a0f1e", border: "none", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {isParent ? "Infos de la mère" : "Vérifier"} <ChevronRight size={18} />
                </motion.button>
              </div>
            </form>
          )}

          {/* ÉTAPE 2 — Infos mère (parent seulement) */}
          {step === 2 && isParent && (
            <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "1.5rem" }}>
                👩 Informations de la mère
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.8rem" }}>
                <Field icon={User} label="Nom *" value={mere.nom} onChange={(e) => setMere({ ...mere, nom: e.target.value })} placeholder="Nom de famille" />
                <Field icon={User} label="Prénom *" value={mere.prenom} onChange={(e) => setMere({ ...mere, prenom: e.target.value })} placeholder="Prénom" />
              </div>
              <Field icon={Mail} label="Email *" type="email" value={mere.email} onChange={(e) => setMere({ ...mere, email: e.target.value })} placeholder="email@exemple.com" />
              <Field icon={Lock} label="Mot de passe *" type="password" value={mere.password} onChange={(e) => setMere({ ...mere, password: e.target.value })} placeholder="Minimum 6 caractères" show={showPass.mere} onToggle={() => setShowPass({ ...showPass, mere: !showPass.mere })} />
              <Field icon={Phone} label="Contact *" type="tel" value={mere.contact} onChange={(e) => setMere({ ...mere, contact: e.target.value })} placeholder="+225 07 00 00 00 00" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.8rem" }}>
                <Field icon={MapPin} label="Quartier" value={mere.quartier} onChange={(e) => setMere({ ...mere, quartier: e.target.value })} placeholder="Quartier" />
                <Field icon={Briefcase} label="Profession" value={mere.profession} onChange={(e) => setMere({ ...mere, profession: e.target.value })} placeholder="Profession" />
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: "13px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#8892a4", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <ChevronLeft size={16} /> Retour
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" style={{ flex: 2, padding: "13px", background: "#f4a840", color: "#0a0f1e", border: "none", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Vérifier <ChevronRight size={18} />
                </motion.button>
              </div>
            </form>
          )}

          {/* ÉTAPE FINALE — Confirmation */}
          {((isParent && step === 3) || (!isParent && step === 2)) && (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "1.5rem" }}>
                ✅ Confirmation
              </h2>

              {/* Résumé */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.2rem", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f4a840", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
                  Récapitulatif
                </div>
                {isParent ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "#8892a4", marginBottom: 6, fontWeight: 600 }}>👨 Père</div>
                      <div style={{ color: "#e8edf5", fontSize: "0.88rem", lineHeight: 1.8 }}>
                        <div>{pere.prenom} {pere.nom}</div>
                        <div style={{ color: "#8892a4" }}>{pere.email}</div>
                        <div style={{ color: "#8892a4" }}>{pere.contact}</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "#8892a4", marginBottom: 6, fontWeight: 600 }}>👩 Mère</div>
                      <div style={{ color: "#e8edf5", fontSize: "0.88rem", lineHeight: 1.8 }}>
                        <div>{mere.prenom} {mere.nom}</div>
                        <div style={{ color: "#8892a4" }}>{mere.email}</div>
                        <div style={{ color: "#8892a4" }}>{mere.contact}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: "#e8edf5", fontSize: "0.88rem", lineHeight: 1.9 }}>
                    <div><span style={{ color: "#8892a4" }}>Rôle :</span> {ROLES.find(r => r.id === role)?.label}</div>
                    <div><span style={{ color: "#8892a4" }}>Nom :</span> {user.prenom} {user.nom}</div>
                    <div><span style={{ color: "#8892a4" }}>Email :</span> {user.email}</div>
                    <div><span style={{ color: "#8892a4" }}>Contact :</span> {user.contact}</div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="button" onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: "13px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#8892a4", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <ChevronLeft size={16} /> Modifier
                </button>
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                  type="submit"
                  disabled={loading}
                  style={{ flex: 2, padding: "13px", background: loading ? "rgba(46,204,138,0.4)" : "#2ecc8a", color: "#0a0f1e", border: "none", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  {loading ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "#0a0f1e", borderRadius: "50%" }} />
                      Inscription…
                    </>
                  ) : (
                    <><CheckCircle size={18} /> Confirmer l'inscription</>
                  )}
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Lien vers login */}
        <p style={{ textAlign: "center", color: "#8892a4", fontSize: "0.82rem", marginTop: "1.5rem" }}>
          Déjà un compte ?{" "}
          <Link to="/login" style={{ color: "#f4a840", fontWeight: 700, textDecoration: "none" }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   LayoutDashboard, FileText, Bell, LogOut, Menu, X,
//   TrendingUp, AlertTriangle, Award, ChevronRight, Users
// } from "lucide-react";
// import toast from "react-hot-toast";

// const CI = {
//   orange: "#F77F00",
//   vert: "#009A44",
//   orangeLight: "rgba(247,127,0,0.10)",
//   vertLight: "rgba(0,154,68,0.10)",
//   bg: "#F5F6FA",
//   card: "#FFFFFF",
//   navy: "#FFFFFF",
//   sidebar: "#FFFFFF",
//   muted: "#9099a8",
//   dark: "#1a2236",
//   text: "#2d3748",
//   border: "rgba(0,0,0,0.08)",
// };

// const parent = JSON.parse(localStorage.getItem("parent") || '{"nom":"Parent","prenom":"","role":"pere"}');

// const MENU = [
//   { icon: LayoutDashboard, label: "Tableau de bord", path: "/dashboard", active: true },
//   { icon: FileText, label: "Bulletins", path: "/bulletins" },
//   { icon: Users, label: "Mes enfants", path: "/enfants" },
//   { icon: Bell, label: "Alertes", path: "/alertes", badge: 1 },
// ];

// const enfants = [
//   { id: 1, nom: "Konan Amani", classe: "Terminale D", moyenne: 13.7, rang: 8, effectif: 42, color: CI.orange },
//   { id: 2, nom: "Konan Emmanuella", classe: "3ème B", moyenne: 16.1, rang: 2, effectif: 38, color: CI.vert },
// ];

// const PHOTOS = [
//   "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=300&h=300&q=80",
//   "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=300&h=300&q=80",
// ];

// const HERO_PHOTO = "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&h=400&q=80";

// function getInitiales(nom) {
//   return nom.split(" ").slice(0, 2).map(n => n[0]).join("");
// }
// function getMoyColor(m) {
//   if (m >= 14) return CI.vert;
//   if (m >= 10) return CI.orange;
//   return "#e53e3e";
// }

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [imgErrors, setImgErrors] = useState({});

//   function handleLogout() {
//     localStorage.removeItem("parent");
//     toast("Au revoir ! 👋");
//     setTimeout(() => navigate("/login"), 800);
//   }

//   return (
//     <div style={{ fontFamily: "'DM Sans', sans-serif", background: CI.bg, minHeight: "100vh", color: CI.text, display: "flex" }}>
//       <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

//       {/* SIDEBAR */}
//       <AnimatePresence>
//         {sidebarOpen && (
//           <motion.aside
//             initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
//             transition={{ duration: 0.3 }}
//             style={{ width: 240, background: CI.sidebar, borderRight: `1px solid ${CI.border}`, boxShadow: "2px 0 16px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 50 }}
//           >
//             {/* Bande drapeau CI */}
//             <div style={{ height: 5, background: `linear-gradient(90deg, ${CI.orange} 33%, #fff 33%, #fff 66%, ${CI.vert} 66%)` }} />

//             {/* Logo */}
//             <div style={{ padding: "1.3rem 1.5rem 1rem", borderBottom: `1px solid ${CI.border}` }}>
//               <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 900, color: CI.orange }}>
//                 École<span style={{ color: CI.dark, fontWeight: 700 }}>Track</span>
//               </div>
//               <div style={{ fontSize: "0.7rem", color: CI.muted, marginTop: 3 }}>🇨🇮 Suivi scolaire officiel</div>
//             </div>

//             {/* Profil */}
//             <div style={{ padding: "1.2rem 1.5rem", borderBottom: `1px solid ${CI.border}` }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg, ${CI.orange}, #c45e00)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: "0.9rem", flexShrink: 0 }}>
//                   {getInitiales(parent.prenom + " " + parent.nom)}
//                 </div>
//                 <div>
//                   <div style={{ fontSize: "0.88rem", fontWeight: 700, color: CI.dark }}>{parent.prenom} {parent.nom}</div>
//                   <div style={{ fontSize: "0.7rem", color: CI.orange, fontWeight: 600, textTransform: "capitalize" }}>{parent.role}</div>
//                 </div>
//               </div>
//             </div>

//             {/* Navigation */}
//             <nav style={{ flex: 1, padding: "1rem 0.75rem" }}>
//               {MENU.map((item) => (
//                 <motion.div key={item.label} whileHover={{ x: 4 }} onClick={() => navigate(item.path)}
//                   style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer", background: item.active ? CI.orangeLight : "transparent", borderLeft: item.active ? `3px solid ${CI.orange}` : "3px solid transparent", color: item.active ? CI.orange : CI.muted, marginBottom: 4, position: "relative", transition: "all 0.2s" }}
//                 >
//                   <item.icon size={18} />
//                   <span style={{ fontSize: "0.88rem", fontWeight: item.active ? 700 : 500 }}>{item.label}</span>
//                   {item.badge && (
//                     <span style={{ position: "absolute", right: 10, background: "#e53e3e", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700 }}>
//                       {item.badge}
//                     </span>
//                   )}
//                 </motion.div>
//               ))}
//             </nav>

//             {/* Déconnexion */}
//             <div style={{ padding: "1rem 0.75rem", borderTop: `1px solid ${CI.border}` }}>
//               <motion.button whileHover={{ x: 4 }} onClick={handleLogout}
//                 style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 10, background: "rgba(229,62,62,0.08)", border: "none", color: "#e53e3e", cursor: "pointer", fontSize: "0.88rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}
//               >
//                 <LogOut size={18} /> Se déconnecter
//               </motion.button>
//             </div>
//           </motion.aside>
//         )}
//       </AnimatePresence>

//       {/* CONTENU PRINCIPAL */}
//       <div style={{ flex: 1, marginLeft: sidebarOpen ? 240 : 0, transition: "margin 0.3s", display: "flex", flexDirection: "column" }}>

//         {/* TOPBAR */}
//         <header style={{ background: "#fff", borderBottom: `1px solid ${CI.border}`, boxShadow: "0 1px 8px rgba(0,0,0,0.05)", padding: "0 1.5rem", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
//           <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: CI.muted, cursor: "pointer", padding: 6, borderRadius: 8 }}>
//             {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
//           </button>
//           <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}
//             onClick={() => toast.error("1 discordance de note détectée !")}
//             style={{ background: "rgba(229,62,62,0.08)", border: "1px solid rgba(229,62,62,0.2)", color: "#e53e3e", padding: "6px 14px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}
//           >
//             <Bell size={13} /> 1 alerte
//           </motion.div>
//         </header>

//         <main style={{ padding: "1.8rem 1.5rem", flex: 1 }}>

//           {/* HERO PHOTO */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
//             style={{ borderRadius: 24, marginBottom: "1.5rem", overflow: "hidden", position: "relative", height: 240, display: "flex", alignItems: "flex-end", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
//           >
//             <img src={HERO_PHOTO} alt="Enfants africains à l'école"
//               style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
//             />
//             <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(247,127,0,0.88), rgba(0,0,0,0.45) 50%, rgba(0,154,68,0.75))" }} />
//             <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${CI.orange} 33%, #fff 33%, #fff 66%, ${CI.vert} 66%)` }} />
//             <div style={{ position: "relative", zIndex: 1, padding: "2rem" }}>
//               <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.88rem", marginBottom: 4 }}>Bonjour 👋</p>
//               <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 900, color: "#fff", marginBottom: 8, textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
//                 {parent.prenom} {parent.nom}
//               </h1>
//               <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.88rem", lineHeight: 1.7, maxWidth: 400 }}>
//                 Bienvenue sur ÉcoleTrack 🇨🇮. Consultez les notes officielles de vos enfants et détectez toute discordance.
//               </p>
//             </div>
//           </motion.div>

//           {/* STATS */}
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
//             style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}
//           >
//             {[
//               { icon: <Users size={20}/>, label: "Enfants suivis", value: enfants.length, color: CI.orange },
//               { icon: <TrendingUp size={20}/>, label: "Meilleure moyenne", value: "16.1/20", color: CI.vert },
//               { icon: <AlertTriangle size={20}/>, label: "Alertes", value: "1", color: "#e53e3e" },
//               { icon: <Award size={20}/>, label: "Meilleur rang", value: "2ème", color: CI.orange },
//             ].map((s, i) => (
//               <motion.div key={i} whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.10)" }}
//                 style={{ background: "#fff", border: `1px solid ${CI.border}`, borderRadius: 16, padding: "1.2rem", borderTop: `3px solid ${s.color}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
//               >
//                 <div style={{ color: s.color, marginBottom: 8 }}>{s.icon}</div>
//                 <div style={{ fontSize: "1.5rem", fontFamily: "'Playfair Display', serif", fontWeight: 900, color: s.color }}>{s.value}</div>
//                 <div style={{ fontSize: "0.72rem", color: CI.muted, fontWeight: 600, textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* CARTES ENFANTS */}
//           <div style={{ fontSize: "0.78rem", fontWeight: 700, color: CI.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>👧 Mes enfants</div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
//             {enfants.map((e, i) => (
//               <motion.div key={e.id}
//                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.1 }}
//                 whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
//                 style={{ background: "#fff", border: `1px solid ${CI.border}`, borderRadius: 20, overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
//                 onClick={() => navigate("/bulletins")}
//               >
//                 <div style={{ height: 5, background: `linear-gradient(90deg, ${CI.orange} 33%, #fff 33%, #fff 66%, ${CI.vert} 66%)` }} />

//                 {/* Photo enfant */}
//                 <div style={{ height: 150, overflow: "hidden", position: "relative" }}>
//                   {!imgErrors[i] ? (
//                     <img
//                       src={PHOTOS[i]}
//                       alt={e.nom}
//                       style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
//                       onError={() => setImgErrors(prev => ({ ...prev, [i]: true }))}
//                     />
//                   ) : (
//                     <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${e.color}22, ${e.color}11)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
//                       <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${e.color}, ${e.color}bb)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 900, color: "#fff" }}>
//                         {getInitiales(e.nom)}
//                       </div>
//                     </div>
//                   )}
//                   {/* Dégradé bas */}
//                   <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 70, background: "linear-gradient(to top, rgba(255,255,255,1), transparent)" }} />
//                   <div style={{ position: "absolute", bottom: 10, left: 14 }}>
//                     <div style={{ fontWeight: 700, fontSize: "0.95rem", color: CI.dark }}>{e.nom}</div>
//                     <div style={{ fontSize: "0.75rem", color: CI.muted }}>📚 {e.classe}</div>
//                   </div>
//                 </div>

//                 <div style={{ padding: "1rem" }}>
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
//                     <div style={{ background: CI.bg, borderRadius: 10, padding: "0.75rem", border: `1px solid ${CI.border}` }}>
//                       <div style={{ fontSize: "0.65rem", color: CI.muted, marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Moyenne</div>
//                       <div style={{ fontSize: "1.4rem", fontWeight: 900, fontFamily: "'Playfair Display', serif", color: getMoyColor(e.moyenne) }}>{e.moyenne}</div>
//                     </div>
//                     <div style={{ background: CI.bg, borderRadius: 10, padding: "0.75rem", border: `1px solid ${CI.border}` }}>
//                       <div style={{ fontSize: "0.65rem", color: CI.muted, marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Rang</div>
//                       <div style={{ fontSize: "1.4rem", fontWeight: 900, fontFamily: "'Playfair Display', serif", color: e.color }}>
//                         {e.rang}<span style={{ fontSize: "0.7rem", color: CI.muted }}>/{e.effectif}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: e.color === CI.orange ? CI.orangeLight : CI.vertLight, borderRadius: 10, border: `1px solid ${e.color === CI.orange ? "rgba(247,127,0,0.2)" : "rgba(0,154,68,0.2)"}` }}>
//                     <span style={{ fontSize: "0.82rem", fontWeight: 700, color: e.color }}>Voir le bulletin</span>
//                     <ChevronRight size={16} color={e.color} />
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//         </main>

//         {/* Footer */}
//         <footer style={{ borderTop: `1px solid ${CI.border}`, background: "#fff", padding: "1rem 1.5rem", textAlign: "center" }}>
//           <div style={{ height: 3, background: `linear-gradient(90deg, ${CI.orange} 33%, #eee 33%, #eee 66%, ${CI.vert} 66%)`, borderRadius: 2, marginBottom: "0.75rem" }} />
//           <span style={{ fontSize: "0.75rem", color: CI.muted }}>ÉcoleTrack 🇨🇮 — Données officielles · Confidentiel</span>
//         </footer>
//       </div>
//     </div>
//   );
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Bell, LogOut, Menu, X,
  TrendingUp, ChevronRight, Users,
  ChevronDown, BookOpen, ClipboardList, GraduationCap,
  Settings, BarChart2, UserCheck, School, Eye, Star,
  Home, Layers, BookMarked, PenTool, CheckSquare
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const API = "http://127.0.0.1:8001/api";

const CI = {
  orange: "#F77F00",
  vert: "#009A44",
  orangeLight: "rgba(247,127,0,0.10)",
  vertLight: "rgba(0,154,68,0.10)",
  bg: "#F5F6FA",
  muted: "#9099a8",
  dark: "#1a2236",
  text: "#2d3748",
  border: "rgba(0,0,0,0.08)",
};

// ✅ Cherche "parent" en premier car Login.jsx sauvegarde sous "parent"
const getCurrentUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem("parent") ||
      localStorage.getItem("user") ||
      '{"nom":"Utilisateur","prenom":"","role":"user"}'
    );
  } catch {
    return { nom: "Utilisateur", prenom: "", role: "user" };
  }
};

const MENU_COMPLET = [
  { icon: Home, label: "Accueil", path: "/dashboard", single: true, color: CI.orange },
  {
    icon: Users, label: "Parents", color: CI.orange,
    children: [
      { icon: Eye, label: "Mes enfants", path: "/enfants" },
      { icon: FileText, label: "Bulletins & notes", path: "/bulletins" },
      { icon: TrendingUp, label: "Évolution des notes", path: "/evolution" },
    ],
  },
  {
    icon: BookOpen, label: "Professeurs", color: "#6c63ff",
    children: [
      { icon: PenTool, label: "Saisir les notes", path: "/saisir-notes" },
      { icon: ClipboardList, label: "Bulletins trimestre", path: "/bulletins-trim" },
      { icon: BarChart2, label: "Statistiques classe", path: "/stats-classe" },
      { icon: Users, label: "Liste des élèves", path: "/eleves-classe" },
    ],
  },
  {
    icon: UserCheck, label: "Éducateurs", color: CI.vert,
    children: [
      { icon: Layers, label: "Liste des classes", path: "/classes" },
      { icon: Users, label: "Élèves par classe", path: "/eleves-par-classe" },
      { icon: Eye, label: "Fiche élève", path: "/fiche-eleve" },
      { icon: CheckSquare, label: "Présences & absences", path: "/presences" },
      { icon: Star, label: "Comportement", path: "/comportement" },
    ],
  },
  {
    icon: Settings, label: "Administrateur", color: "#e53e3e",
    children: [
      { icon: BarChart2, label: "Statistiques globales", path: "/stats-globales" },
      { icon: GraduationCap, label: "Gestion professeurs", path: "/gestion-profs" },
      { icon: UserCheck, label: "Gestion éducateurs", path: "/gestion-educ" },
      { icon: Users, label: "Gestion parents", path: "/gestion-parents" },
      { icon: GraduationCap, label: "Gestion élèves", path: "/gestion-eleves" },
      { icon: School, label: "Classes & sections", path: "/gestion-classes" },
      { icon: BookMarked, label: "Matières & coefficients", path: "/matieres" },
      { icon: Layers, label: "Années scolaires", path: "/annees" },
      { icon: School, label: "Paramètres école", path: "/infos-ecole" },
    ],
  },
];

const HERO_PHOTO = "https://media-files.abidjan.net/photo/enlignetousresponsables-les-proviseurs-des-lycee-scientifique-et-lycee-mami_cgix2a0q2j.jpg";

function getInitiales(nom = "") {
  return nom.split(" ").slice(0, 2).map(n => n[0] || "").join("").toUpperCase();
}

function MenuItem({ item, navigate }) {
  const [open, setOpen] = useState(false);

  if (item.single) {
    return (
      <motion.div whileHover={{ x: 4 }} onClick={() => navigate(item.path)}
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, cursor: "pointer", color: item.color, marginBottom: 2, fontWeight: 700, fontSize: "0.88rem" }}
      >
        <item.icon size={17} color={item.color} /> {item.label}
      </motion.div>
    );
  }

  return (
    <div style={{ marginBottom: 3 }}>
      <motion.div whileHover={{ x: 2 }} onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, cursor: "pointer", background: open ? `${item.color}10` : "transparent", borderLeft: open ? `3px solid ${item.color}` : "3px solid transparent" }}
      >
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${item.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <item.icon size={16} color={item.color} />
        </div>
        <span style={{ fontSize: "0.88rem", fontWeight: 700, flex: 1, color: open ? item.color : CI.dark }}>{item.label}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} color={open ? item.color : CI.muted} />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden", paddingLeft: "1rem" }}
          >
            <div style={{ borderLeft: `2px solid ${item.color}25`, paddingLeft: "0.75rem", marginTop: 3, marginBottom: 4 }}>
              {item.children.map((child, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ x: 4 }}
                  onClick={() => navigate(child.path)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 8, cursor: "pointer", color: CI.muted, marginBottom: 1, fontSize: "0.82rem", fontWeight: 500 }}
                  onMouseEnter={e => { e.currentTarget.style.color = item.color; e.currentTarget.style.background = `${item.color}08`; }}
                  onMouseLeave={e => { e.currentTarget.style.color = CI.muted; e.currentTarget.style.background = "transparent"; }}
                >
                  <child.icon size={14} />
                  <span style={{ flex: 1 }}>{child.label}</span>
                  {child.badge && (
                    <span style={{ background: "#e53e3e", color: "#fff", borderRadius: 99, padding: "1px 6px", fontSize: "0.62rem", fontWeight: 700 }}>
                      {child.badge}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  const [stats, setStats] = useState({ eleves: null, professeurs: null, classes: null });
  const [loadingStats, setLoadingStats] = useState(true);

  const [enfants, setEnfants] = useState([]);
  const [loadingEnfants, setLoadingEnfants] = useState(false);

  useEffect(() => {
    loadStats();
    // ✅ Recharge le user si le localStorage change (changement de compte)
    const handleStorage = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ✅ Recharge les enfants quand le user change
  useEffect(() => {
    if (currentUser?.id) {
      loadEnfants(currentUser.id);
    }
  }, [currentUser?.id]);

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const [elevesRes, profsRes, classesRes] = await Promise.all([
        axios.get(`${API}/eleves`),
        axios.get(`${API}/professeurs`),
        axios.get(`${API}/classes`),
      ]);
      setStats({
        eleves:      (Array.isArray(elevesRes.data)  ? elevesRes.data  : elevesRes.data.data  || []).length,
        professeurs: (Array.isArray(profsRes.data)   ? profsRes.data   : profsRes.data.data   || []).length,
        classes:     (Array.isArray(classesRes.data) ? classesRes.data : classesRes.data.data || []).length,
      });
    } catch (err) {
      console.error("Erreur stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  // ✅ Filtre les enfants depuis /eleve-parent selon parent_id
  const loadEnfants = async (parentId) => {
    setLoadingEnfants(true);
    try {
      const r = await axios.get(`${API}/eleve-parent`);
      const relations = Array.isArray(r.data) ? r.data : r.data.data || [];
      const mesEnfants = relations
        .filter(rel => rel.parent_id === parentId)
        .map(rel => rel.eleve)
        .filter(Boolean);
      setEnfants(mesEnfants);
    } catch {
      setEnfants([]);
    } finally {
      setLoadingEnfants(false);
    }
  };

  function handleLogout() {
    localStorage.removeItem("parent");
    localStorage.removeItem("user");
    toast("Au revoir ! 👋");
    setTimeout(() => navigate("/login"), 800);
  }

  const STATS_DISPLAY = [
    { icon: <Users size={20}/>,         label: "Élèves inscrits",  value: stats.eleves,      color: CI.orange  },
    { icon: <GraduationCap size={20}/>, label: "Professeurs",      value: stats.professeurs, color: "#6c63ff"  },
    { icon: <School size={20}/>,        label: "Classes",          value: stats.classes,     color: CI.vert    },
    { icon: <TrendingUp size={20}/>,    label: "Taux de réussite", value: "—",               color: "#e53e3e"  },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: CI.bg, minHeight: "100vh", color: CI.text, display: "flex" }}>

      {/* SIDEBAR */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
            transition={{ duration: 0.3 }}
            style={{ width: 256, background: "#fff", borderRight: `1px solid ${CI.border}`, boxShadow: "2px 0 16px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 50 }}
          >
            {/* Bande drapeau */}
            <div style={{ height: 5, background: `linear-gradient(90deg, ${CI.orange} 33%, #fff 33%, #fff 66%, ${CI.vert} 66%)` }} />

            {/* Logo */}
            <div style={{ padding: "1.2rem 1.5rem 1rem", borderBottom: `1px solid ${CI.border}` }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 900, color: CI.orange }}>
                École<span style={{ color: CI.dark, fontWeight: 700 }}>Track</span>
              </div>
              <div style={{ fontSize: "0.68rem", color: CI.muted, marginTop: 2 }}>🇨🇮 Suivi scolaire officiel</div>
            </div>

            {/* ✅ Profil dynamique selon user connecté */}
            <div style={{ padding: "1rem 1.5rem", borderBottom: `1px solid ${CI.border}`, background: `${CI.orange}08` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${CI.orange}, #c45e00)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: "0.88rem", flexShrink: 0 }}>
                  {getInitiales(`${currentUser.prenom || ""} ${currentUser.nom || ""}`)}
                </div>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontSize: "0.87rem", fontWeight: 700, color: CI.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {currentUser.prenom} {currentUser.nom}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: CI.orange, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {currentUser.role || "Utilisateur"}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: "0.8rem 0.6rem", overflowY: "auto" }}>
              {MENU_COMPLET.map((item, i) => (
                <MenuItem key={i} item={item} navigate={navigate} />
              ))}
            </nav>

            {/* Déconnexion */}
            <div style={{ padding: "0.8rem 0.75rem", borderTop: `1px solid ${CI.border}` }}>
              <motion.button whileHover={{ x: 4 }} onClick={handleLogout}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 10, background: "rgba(229,62,62,0.07)", border: "none", color: "#e53e3e", cursor: "pointer", fontSize: "0.87rem", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}
              >
                <LogOut size={17} /> Se déconnecter
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* CONTENU PRINCIPAL */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 256 : 0, transition: "margin 0.3s", display: "flex", flexDirection: "column" }}>

        {/* TOPBAR */}
        <header style={{ background: "#fff", borderBottom: `1px solid ${CI.border}`, boxShadow: "0 1px 8px rgba(0,0,0,0.05)", padding: "0 1.5rem", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: "none", border: "none", color: CI.muted, cursor: "pointer", padding: 6, borderRadius: 8 }}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span style={{ fontSize: "0.88rem", color: CI.muted, fontWeight: 500 }}>Tableau de bord</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              onClick={() => toast.error("1 discordance de note détectée !")}
              style={{ background: "rgba(229,62,62,0.08)", border: "1px solid rgba(229,62,62,0.2)", color: "#e53e3e", padding: "5px 12px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}
            >
              <Bell size={12} /> 1 alerte
            </motion.div>
          </div>
        </header>

        <main style={{ padding: "1.8rem 1.5rem", flex: 1 }}>

          {/* HERO */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ borderRadius: 20, marginBottom: "1.5rem", overflow: "hidden", position: "relative", height: 200, display: "flex", alignItems: "flex-end", boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}
          >
            <img src={HERO_PHOTO} alt="École"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
            />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, rgba(247,127,0,0.88), rgba(0,0,0,0.4) 60%, rgba(0,154,68,0.7))` }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg, ${CI.orange} 33%, #fff 33%, #fff 66%, ${CI.vert} 66%)` }} />
            <div style={{ position: "relative", zIndex: 1, padding: "1.5rem 2rem" }}>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.85rem", marginBottom: 3 }}>Bonjour 👋</p>
              {/* ✅ Nom dynamique */}
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)", fontWeight: 900, color: "#fff", marginBottom: 6, textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
                {currentUser.prenom} {currentUser.nom}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", lineHeight: 1.6, maxWidth: 420 }}>
                Bienvenue sur ÉcoleTrack 🇨🇮 — Plateforme de suivi scolaire officielle
              </p>
            </div>
          </motion.div>

          {/* ✅ STATS DYNAMIQUES */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}
          >
            {STATS_DISPLAY.map((s, i) => (
              <motion.div key={i} whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
                style={{ background: "#fff", border: `1px solid ${CI.border}`, borderRadius: 16, padding: "1.2rem", borderTop: `3px solid ${s.color}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              >
                <div style={{ color: s.color, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: "1.5rem", fontFamily: "'Playfair Display', serif", fontWeight: 900, color: s.color }}>
                  {loadingStats && s.label !== "Taux de réussite" ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{ width: 24, height: 24, border: `3px solid ${s.color}30`, borderTopColor: s.color, borderRadius: "50%" }} />
                  ) : s.value}
                </div>
                <div style={{ fontSize: "0.7rem", color: CI.muted, fontWeight: 600, textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* ✅ ENFANTS DYNAMIQUES selon parent connecté */}
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: CI.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem" }}>
            👧 Mes enfants
          </div>

          {loadingEnfants ? (
            <div style={{ textAlign: "center", padding: "2rem", color: CI.muted }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: 32, height: 32, border: `3px solid ${CI.orange}30`, borderTopColor: CI.orange, borderRadius: "50%", margin: "0 auto 10px" }} />
              Chargement...
            </div>
          ) : enfants.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${CI.border}`, padding: "2.5rem", textAlign: "center", color: CI.muted }}>
              <Users size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600, color: CI.dark }}>Aucun enfant associé à ce compte</p>
              <p style={{ margin: "4px 0 0", fontSize: "0.78rem" }}>Les élèves liés à votre compte apparaîtront ici</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
              {enfants.map((e, i) => {
                const color = i % 2 === 0 ? CI.orange : CI.vert;
                return (
                  <motion.div key={e.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                    whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(0,0,0,0.10)" }}
                    style={{ background: "#fff", border: `1px solid ${CI.border}`, borderRadius: 18, overflow: "hidden", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
                    onClick={() => navigate("/bulletins")}
                  >
                    <div style={{ height: 4, background: `linear-gradient(90deg, ${CI.orange} 33%, #fff 33%, #fff 66%, ${CI.vert} 66%)` }} />

                    {/* Avatar */}
                    <div style={{ height: 100, background: `linear-gradient(135deg, ${color}22, ${color}0a)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}bb)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 900, color: "#fff" }}>
                        {getInitiales(`${e.prenom || ""} ${e.nom || ""}`)}
                      </div>
                    </div>

                    <div style={{ padding: "0.9rem" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.92rem", color: CI.dark, marginBottom: 2 }}>
                        {e.prenom} {e.nom}
                      </div>
                      {/* ✅ classe.libelle car classe est un objet */}
                      <div style={{ fontSize: "0.72rem", color: CI.muted, marginBottom: "0.9rem" }}>
                        📚 {e.classe?.libelle || `Classe #${e.classe_id}`} · {e.matricule}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: color === CI.orange ? CI.orangeLight : CI.vertLight, borderRadius: 9, border: `1px solid ${color === CI.orange ? "rgba(247,127,0,0.2)" : "rgba(0,154,68,0.2)"}` }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color }}>Voir le bulletin</span>
                        <ChevronRight size={15} color={color} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>

        <footer style={{ borderTop: `1px solid ${CI.border}`, background: "#fff", padding: "0.8rem 1.5rem", textAlign: "center" }}>
          <div style={{ height: 3, background: `linear-gradient(90deg, ${CI.orange} 33%, #eee 33%, #eee 66%, ${CI.vert} 66%)`, borderRadius: 2, marginBottom: "0.5rem" }} />
          <span style={{ fontSize: "0.72rem", color: CI.muted }}>ÉcoleTrack 🇨🇮 — Données officielles · Confidentiel</span>
        </footer>
      </div>
    </div>
  );
}
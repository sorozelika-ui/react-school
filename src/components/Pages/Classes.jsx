import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Plus, Search, X, User, Mail, Phone,
  MapPin, Calendar, Hash, School, CheckCircle,
  Pencil, Trash2, Eye, Filter, ChevronLeft, ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const CI = {
  orange: "#F77F00",
  vert: "#009A44",
  orangeLight: "rgba(247,127,0,0.10)",
  bg: "#F5F6FA",
  muted: "#9099a8",
  dark: "#1a2236",
  text: "#2d3748",
  border: "rgba(0,0,0,0.08)",
};

const avatarColors = [CI.orange, CI.vert, "#6c63ff", "#e53e3e", "#00bcd4", "#ff6b9d"];

function getInitiales(nom, prenom) {
  return `${prenom?.[0] || ""}${nom?.[0] || ""}`.toUpperCase();
}

function InputField({ icon: Icon, label, required, type = "text", value, onChange, placeholder }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: "0.73rem", fontWeight: 700, color: CI.muted, marginBottom: 6, 
        textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label} {required && <span style={{ color: "#e53e3e" }}>*</span>}
      </label>
      <div style={{ position: "relative" }}>
        <Icon size={14} color={focus ? CI.orange : CI.muted} style={{ position: "absolute", left: 12, top: "50%", 
            transform: "translateY(-50%)", pointerEvents: "none", transition: "color 0.2s" }} />
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ width: "100%", background: focus ? "#fff" : "#F8F9FC", border: `1.5px solid ${focus ? CI.orange : "rgba(0,0,0,0.10)"}`,
           color: CI.dark, padding: "10px 12px 10px 38px", borderRadius: 9, fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", 
           outline: "none", boxSizing: "border-box", transition: "all 0.2s", boxShadow: focus ? `0 0 0 3px ${CI.orange}15` : "none" }}
        />
      </div>
    </div>
  );
}

function SelectField({ icon: Icon, label, required, value, onChange, options, placeholder }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: "0.73rem", fontWeight: 700, color: CI.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label} {required && <span style={{ color: "#e53e3e" }}>*</span>}
      </label>
      <div style={{ position: "relative" }}>
        <Icon size={14} color={focus ? CI.orange : CI.muted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        <select value={value} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ width: "100%", background: focus ? "#fff" : "#F8F9FC", border: `1.5px solid ${focus ? CI.orange : "rgba(0,0,0,0.10)"}`, color: value ? CI.dark : CI.muted, padding: "10px 12px 10px 38px", borderRadius: 9, fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", outline: "none", appearance: "none", cursor: "pointer", boxSizing: "border-box", transition: "all 0.2s", boxShadow: focus ? `0 0 0 3px ${CI.orange}15` : "none" }}
        >
          <option value="">{placeholder}</option>
          {options.map(o => <option key={o.id} value={o.id}>{o.nom}</option>)}
        </select>
      </div>
    </div>
  );
}

const FORM_VIDE = { matricule: "", nom: "", prenom: "", date_naissance: "", email: "", contact: "", quartier: "", classe_id: "" };

export default function Eleves() {
  const navigate = useNavigate();
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [modeEdit, setModeEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [filtreClasse, setFiltreClasse] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(FORM_VIDE);
  const PER_PAGE = 8;

  useEffect(() => { fetchEleves(); fetchClasses(); }, []);

  async function fetchEleves() {
    try {
      setLoading(true);
      const res = await api.get("/eleves");
      setEleves(res.data);
    } catch { toast.error("Impossible de charger les élèves."); }
    finally { setLoading(false); }
  }

  async function fetchClasses() {
    try {
      const res = await api.get("/classes");
      setClasses(res.data);
    } catch { toast.error("Impossible de charger les classes."); }
  }

  function handleChange(field, value) { setForm(prev => ({ ...prev, [field]: value })); }

  function genererMatricule() {
    const annee = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 9000) + 1000;
    handleChange("matricule", `EL${annee}${rand}`);
  }

  function ouvrirAjout() { setForm(FORM_VIDE); setModeEdit(false); setEditId(null); setShowForm(true); }

  function ouvrirEdit(eleve) {
    setForm({
      matricule: eleve.matricule || "",
      nom: eleve.nom || "",
      prenom: eleve.prenom || "",
      date_naissance: eleve.date_naissance || "",
      email: eleve.email || "",
      contact: eleve.contact || "",
      quartier: eleve.quartier || "",
      classe_id: eleve.classe_id || "",
    });
    setModeEdit(true);
    setEditId(eleve.id);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nom || !form.prenom || !form.date_naissance || !form.classe_id || (!modeEdit && !form.matricule)) {
      toast.error("Remplis tous les champs obligatoires !");
      return;
    }
    setSaving(true);
    try {
      if (modeEdit) {
        await api.put(`/eleves/${editId}`, form);
        toast.success("Élève modifié avec succès ✅");
      } else {
        await api.post("/eleves", form);
        toast.success(`Élève ${form.prenom} ${form.nom} inscrit ! 🎉`);
      }
      setShowForm(false);
      setForm(FORM_VIDE);
      fetchEleves();
    } catch (error) {
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0][0];
        toast.error(firstError);
      } else {
        toast.error("Erreur lors de l'enregistrement.");
      }
    } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/eleves/${deleteId}`);
      toast.success("Élève supprimé avec succès !");
      setDeleteId(null);
      fetchEleves();
    } catch { toast.error("Erreur lors de la suppression."); }
    finally { setDeleting(false); }
  }

  // Filtrage + pagination
  const elevesFiltres = eleves.filter(e => {
    const s = search.toLowerCase();
    const matchSearch = !search || e.nom?.toLowerCase().includes(s) || e.prenom?.toLowerCase().includes(s) || e.matricule?.toLowerCase().includes(s);
    const matchClasse = !filtreClasse || String(e.classe_id) === String(filtreClasse);
    return matchSearch && matchClasse;
  });

  const totalPages = Math.ceil(elevesFiltres.length / PER_PAGE);
  const elevesPagines = elevesFiltres.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function getClasseNom(classe_id) {
    return classes.find(c => c.id === classe_id)?.nom || "—";
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: CI.bg, minHeight: "100vh", color: CI.text }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <header style={{ background: "#fff", borderBottom: `1px solid ${CI.border}`, padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <motion.button whileHover={{ x: -3 }} onClick={() => navigate("/dashboard")}
            style={{ background: "none", border: "none", color: CI.muted, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif", padding: "6px 10px", borderRadius: 8 }}
          >
            <ArrowLeft size={16} /> Retour
          </motion.button>
          <div style={{ width: 1, height: 20, background: CI.border }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 900, color: CI.orange }}>
            École<span style={{ color: CI.dark, fontWeight: 700 }}>Track</span>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.03, boxShadow: "0 6px 20px rgba(247,127,0,0.3)" }} whileTap={{ scale: 0.97 }}
          onClick={ouvrirAjout}
          style={{ display: "flex", alignItems: "center", gap: 8, background: CI.orange, color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer" }}
        >
          <Plus size={17} /> Nouvel élève
        </motion.button>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* TITRE */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "1.5rem" }}>
          <div style={{ height: 4, width: 48, background: `linear-gradient(90deg, ${CI.orange}, ${CI.vert})`, borderRadius: 2, marginBottom: "0.75rem" }} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 900, color: CI.dark, marginBottom: 4 }}>
            Gestion des Élèves
          </h1>
          <p style={{ color: CI.muted, fontSize: "0.88rem" }}>
            {eleves.length} élève{eleves.length > 1 ? "s" : ""} enregistré{eleves.length > 1 ? "s" : ""} · Année 2024–2025
          </p>
        </motion.div>

        {/* STATS */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}
        >
          {[
            { label: "Total élèves", value: eleves.length, color: CI.orange, icon: <User size={18}/> },
            { label: "Classes", value: classes.length, color: "#6c63ff", icon: <School size={18}/> },
            { label: "Résultats", value: elevesFiltres.length, color: CI.vert, icon: <Filter size={18}/> },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "1rem", border: `1px solid ${CI.border}`, borderTop: `3px solid ${s.color}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ color: s.color, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 900, fontFamily: "'Playfair Display', serif", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "0.7rem", color: CI.muted, fontWeight: 600, textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* RECHERCHE + FILTRE */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          style={{ display: "flex", gap: "1rem", marginBottom: "1.2rem", flexWrap: "wrap" }}
        >
          <div style={{ position: "relative", flex: 2, minWidth: 200 }}>
            <Search size={15} color={CI.muted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input type="text" placeholder="Rechercher par nom, prénom ou matricule..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ width: "100%", background: "#fff", border: `1px solid ${CI.border}`, color: CI.dark, padding: "10px 38px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", outline: "none", boxSizing: "border-box", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}
            />
            {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: CI.muted }}><X size={14} /></button>}
          </div>
          <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
            <School size={14} color={CI.muted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <select value={filtreClasse} onChange={e => { setFiltreClasse(e.target.value); setPage(1); }}
              style={{ width: "100%", background: "#fff", border: `1px solid ${CI.border}`, color: CI.dark, padding: "10px 12px 10px 36px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", outline: "none", appearance: "none", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}
            >
              <option value="">Toutes les classes</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>
        </motion.div>

        {/* TABLEAU */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
          style={{ background: "#fff", borderRadius: 20, border: `1px solid ${CI.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}
        >
          {/* Bande drapeau */}
          <div style={{ height: 4, background: `linear-gradient(90deg, ${CI.orange} 33%, #fff 33%, #fff 66%, ${CI.vert} 66%)` }} />

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem", color: CI.muted }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                style={{ width: 36, height: 36, border: `3px solid ${CI.orange}30`, borderTopColor: CI.orange, borderRadius: "50%", margin: "0 auto 1rem" }}
              />
              Chargement...
            </div>
          ) : elevesFiltres.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: CI.dark, marginBottom: 8 }}>Aucun élève trouvé</h3>
              <p style={{ color: CI.muted, fontSize: "0.85rem", marginBottom: "1.2rem" }}>Commence par inscrire un élève.</p>
              <motion.button whileHover={{ scale: 1.03 }} onClick={ouvrirAjout}
                style={{ background: CI.orange, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <Plus size={15} /> Inscrire un élève
              </motion.button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F8F9FC" }}>
                    {["Élève", "Matricule", "Classe", "Date naissance", "Contact", "Email", "Quartier", "Actions"].map((h, i) => (
                      <th key={i} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: CI.muted, textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: `1px solid ${CI.border}`, whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {elevesPagines.map((eleve, i) => {
                    const color = avatarColors[i % avatarColors.length];
                    return (
                      <motion.tr key={eleve.id}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                        style={{ borderBottom: `1px solid ${CI.border}`, transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#FAFBFF"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        {/* Élève */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, ${color}bb)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: "0.85rem", fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                              {getInitiales(eleve.nom, eleve.prenom)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: "0.88rem", color: CI.dark, whiteSpace: "nowrap" }}>
                                {eleve.prenom} {eleve.nom}
                              </div>
                            </div>
                          </div>
                        </td>
                        {/* Matricule */}
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ background: `${color}15`, color, borderRadius: 6, padding: "3px 10px", fontSize: "0.75rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                            {eleve.matricule}
                          </span>
                        </td>
                        {/* Classe */}
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ background: CI.orangeLight, color: CI.orange, borderRadius: 6, padding: "3px 10px", fontSize: "0.75rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                            {eleve.classe?.nom || getClasseNom(eleve.classe_id)}
                          </span>
                        </td>
                        {/* Date naissance */}
                        <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: CI.muted, whiteSpace: "nowrap" }}>
                          {eleve.date_naissance ? new Date(eleve.date_naissance).toLocaleDateString("fr-FR") : "—"}
                        </td>
                        {/* Contact */}
                        <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: CI.text, whiteSpace: "nowrap" }}>
                          {eleve.contact || <span style={{ color: CI.muted }}>—</span>}
                        </td>
                        {/* Email */}
                        <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: CI.text, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {eleve.email || <span style={{ color: CI.muted }}>—</span>}
                        </td>
                        {/* Quartier */}
                        <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: CI.text, whiteSpace: "nowrap" }}>
                          {eleve.quartier || <span style={{ color: CI.muted }}>—</span>}
                        </td>
                        {/* ACTIONS */}
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {/* Voir */}
                            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                              onClick={() => toast(`Dossier de ${eleve.prenom} ${eleve.nom}`)}
                              title="Voir le dossier"
                              style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(108,99,255,0.1)", border: "none", color: "#6c63ff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              <Eye size={15} />
                            </motion.button>
                            {/* Modifier */}
                            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                              onClick={() => ouvrirEdit(eleve)}
                              title="Modifier"
                              style={{ width: 32, height: 32, borderRadius: 8, background: CI.orangeLight, border: "none", color: CI.orange, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              <Pencil size={15} />
                            </motion.button>
                            {/* Supprimer */}
                            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                              onClick={() => setDeleteId(eleve.id)}
                              title="Supprimer"
                              style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(229,62,62,0.1)", border: "none", color: "#e53e3e", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              <Trash2 size={15} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.5rem", borderTop: `1px solid ${CI.border}` }}>
                  <span style={{ fontSize: "0.8rem", color: CI.muted }}>
                    Page {page} sur {totalPages} · {elevesFiltres.length} élèves
                  </span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <motion.button whileHover={{ scale: 1.05 }} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      style={{ width: 34, height: 34, borderRadius: 8, background: page === 1 ? "#f0f0f0" : CI.orangeLight, border: "none", color: page === 1 ? CI.muted : CI.orange, cursor: page === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <ChevronLeft size={16} />
                    </motion.button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <motion.button key={p} whileHover={{ scale: 1.05 }} onClick={() => setPage(p)}
                        style={{ width: 34, height: 34, borderRadius: 8, background: p === page ? CI.orange : "#f0f0f0", border: "none", color: p === page ? "#fff" : CI.muted, cursor: "pointer", fontWeight: p === page ? 700 : 500, fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {p}
                      </motion.button>
                    ))}
                    <motion.button whileHover={{ scale: 1.05 }} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      style={{ width: 34, height: 34, borderRadius: 8, background: page === totalPages ? "#f0f0f0" : CI.orangeLight, border: "none", color: page === totalPages ? CI.muted : CI.orange, cursor: page === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <ChevronRight size={16} />
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>

      {/* MODAL FORMULAIRE AJOUT/EDIT */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
            onClick={e => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 30 }}
              style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}
            >
              {/* Header modal */}
              <div style={{ padding: "1.4rem 1.8rem", borderBottom: `1px solid ${CI.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#fff", zIndex: 10 }}>
                <div>
                  <div style={{ height: 3, width: 36, background: `linear-gradient(90deg, ${CI.orange}, ${CI.vert})`, borderRadius: 2, marginBottom: 8 }} />
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 900, color: CI.dark, margin: 0 }}>
                    {modeEdit ? "✏️ Modifier l'élève" : "📋 Inscription d'un élève"}
                  </h2>
                  <p style={{ color: CI.muted, fontSize: "0.78rem", margin: "3px 0 0" }}>
                    {modeEdit ? "Modifie les informations de l'élève" : "Remplis les informations pour inscrire un nouvel élève"}
                  </p>
                </div>
                <button onClick={() => setShowForm(false)}
                  style={{ background: "rgba(0,0,0,0.06)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: CI.muted }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ padding: "1.4rem 1.8rem" }}>
                {/* Matricule */}
                {!modeEdit && (
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", fontSize: "0.73rem", fontWeight: 700, color: CI.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Matricule <span style={{ color: "#e53e3e" }}>*</span>
                    </label>
                    <div style={{ display: "flex", gap: "0.6rem" }}>
                      <div style={{ position: "relative", flex: 1 }}>
                        <Hash size={14} color={CI.muted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                        <input type="text" value={form.matricule} onChange={e => handleChange("matricule", e.target.value)} placeholder="Ex: EL20240001"
                          style={{ width: "100%", background: "#F8F9FC", border: "1.5px solid rgba(0,0,0,0.10)", color: CI.dark, padding: "10px 12px 10px 38px", borderRadius: 9, fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                      <motion.button type="button" whileHover={{ scale: 1.03 }} onClick={genererMatricule}
                        style={{ background: CI.orangeLight, border: `1px solid rgba(247,127,0,0.3)`, color: CI.orange, borderRadius: 9, padding: "0 14px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                      >
                        Auto ✨
                      </motion.button>
                    </div>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.8rem" }}>
                  <InputField icon={User} label="Nom" required value={form.nom} onChange={e => handleChange("nom", e.target.value)} placeholder="Nom de famille" />
                  <InputField icon={User} label="Prénom" required value={form.prenom} onChange={e => handleChange("prenom", e.target.value)} placeholder="Prénom(s)" />
                </div>
                <InputField icon={Calendar} label="Date de naissance" required type="date" value={form.date_naissance} onChange={e => handleChange("date_naissance", e.target.value)} placeholder="" />
                <SelectField icon={School} label="Classe" required value={form.classe_id} onChange={e => handleChange("classe_id", e.target.value)} options={classes} placeholder="Choisir une classe" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.8rem" }}>
                  <InputField icon={Phone} label="Contact" type="tel" value={form.contact} onChange={e => handleChange("contact", e.target.value)} placeholder="+225 07 00 00 00" />
                  <InputField icon={Mail} label="Email" type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} placeholder="email@exemple.com" />
                </div>
                <InputField icon={MapPin} label="Quartier" value={form.quartier} onChange={e => handleChange("quartier", e.target.value)} placeholder="Quartier de résidence" />

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.2rem" }}>
                  <button type="button" onClick={() => setShowForm(false)}
                    style={{ flex: 1, padding: "12px", background: "#f0f0f0", border: "none", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", color: CI.muted }}
                  >
                    Annuler
                  </button>
                  <motion.button type="submit" disabled={saving} whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: saving ? 1 : 0.97 }}
                    style={{ flex: 2, padding: "12px", background: saving ? `${CI.orange}80` : CI.orange, color: "#fff", border: "none", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    {saving ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }} /> Enregistrement...</>
                    ) : (
                      <><CheckCircle size={17} /> {modeEdit ? "Enregistrer les modifications" : "Inscrire l'élève"}</>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL CONFIRMATION SUPPRESSION */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          >
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              style={{ background: "#fff", borderRadius: 20, padding: "2rem", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}
            >
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(229,62,62,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                <Trash2 size={24} color="#e53e3e" />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 900, color: CI.dark, marginBottom: 8 }}>
                Confirmer la suppression
              </h3>
              <p style={{ color: CI.muted, fontSize: "0.88rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                Es-tu sûre de vouloir supprimer cet élève ? Cette action est <strong>irréversible</strong>.
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => setDeleteId(null)}
                  style={{ flex: 1, padding: "11px", background: "#f0f0f0", border: "none", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer", color: CI.muted }}
                >
                  Annuler
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleDelete} disabled={deleting}
                  style={{ flex: 1, padding: "11px", background: "#e53e3e", border: "none", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                >
                  {deleting ? "Suppression..." : <><Trash2 size={15} /> Supprimer</>}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
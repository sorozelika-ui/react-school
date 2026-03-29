// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   BookOpen, Users, Plus, Edit3, Trash2, Save, X,
//   ChevronDown, Award, AlertCircle, CheckCircle, FileText
// } from "lucide-react";
// import axios from "axios";

// const API = "http://127.0.0.1:8001/api";

// const TYPE_EPREUVE = {
//   interrogation: { label: "Interrogation",    coeff: 0.5, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
//   devoir_classe: { label: "Devoir de classe", coeff: 1,   color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
//   devoir_niveau: { label: "Devoir de niveau", coeff: 2,   color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
// };

// const getAppr = (note) => {
//   if (note >= 16) return { label: "Très Bien",  color: "#059669" };
//   if (note >= 14) return { label: "Bien",        color: "#2563eb" };
//   if (note >= 12) return { label: "Assez Bien",  color: "#7c3aed" };
//   if (note >= 10) return { label: "Passable",    color: "#f59e0b" };
//   return             { label: "Insuffisant",     color: "#dc2626" };
// };

// const labelSt = {
//   display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px",
// };
// const inputSt = {
//   width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "9px",
//   fontSize: "14px", outline: "none", color: "#0f172a", boxSizing: "border-box",
//   fontFamily: "inherit", background: "#fafafa",
// };

// /* ── Modal saisie/édition note ── */
// const NoteModal = ({ eleve, note, onSave, onClose }) => {
//   const [form, setForm] = useState(
//     note
//       ? { type_epreuve: note.type_epreuve, valeur: note.valeur, matiere: note.matiere, commentaire: note.commentaire || "" }
//       : { type_epreuve: "interrogation", valeur: "", matiere: "", commentaire: "" }
//   );
//   const [error, setError] = useState("");

//   const handleSubmit = () => {
//     if (form.valeur === "") { setError("La note est obligatoire."); return; }
//     const val = parseFloat(form.valeur);
//     if (isNaN(val) || val < 0 || val > 20) { setError("La note doit être entre 0 et 20."); return; }
//     if (!form.matiere.trim()) { setError("La matière est obligatoire."); return; }
//     onSave({ ...form, valeur: val });
//   };

//   const cfg = TYPE_EPREUVE[form.type_epreuve];

//   return (
//     <motion.div
//       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//       style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}
//       onClick={e => e.target === e.currentTarget && onClose()}
//     >
//       <motion.div
//         initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
//         style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "480px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}
//       >
//         <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//           <div>
//             <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0f172a", fontFamily: "'Fraunces', serif" }}>
//               {note ? "Modifier la note" : "Ajouter une note"}
//             </h3>
//             <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#64748b" }}>
//               {eleve.nom} {eleve.prenom}
//             </p>
//           </div>
//           <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
//             <X size={16} color="#64748b" />
//           </button>
//         </div>

//         <div style={{ padding: "22px 24px" }}>
//           <div style={{ marginBottom: "18px" }}>
//             <label style={labelSt}>Type d'épreuve</label>
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
//               {Object.entries(TYPE_EPREUVE).map(([k, v]) => (
//                 <button key={k} onClick={() => setForm({ ...form, type_epreuve: k })}
//                   style={{
//                     padding: "10px 8px", borderRadius: "10px",
//                     border: `2px solid ${form.type_epreuve === k ? v.color : "#e2e8f0"}`,
//                     background: form.type_epreuve === k ? v.bg : "white",
//                     cursor: "pointer", transition: "all 0.15s",
//                   }}>
//                   <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: form.type_epreuve === k ? v.color : "#64748b" }}>{v.label}</p>
//                   <p style={{ margin: "2px 0 0", fontSize: "11px", color: form.type_epreuve === k ? v.color : "#94a3b8" }}>Coeff ×{v.coeff}</p>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div style={{ marginBottom: "14px" }}>
//             <label style={labelSt}>Matière <span style={{ color: "#ef4444" }}>*</span></label>
//             <input value={form.matiere} onChange={e => setForm({ ...form, matiere: e.target.value })}
//               placeholder="Ex : Mathématiques, Français..." style={inputSt} />
//           </div>

//           <div style={{ marginBottom: "14px" }}>
//             <label style={labelSt}>Note /20 <span style={{ color: "#ef4444" }}>*</span></label>
//             <div style={{ position: "relative" }}>
//               <input type="number" min="0" max="20" step="0.25"
//                 value={form.valeur} onChange={e => setForm({ ...form, valeur: e.target.value })}
//                 placeholder="0 — 20"
//                 style={{ ...inputSt, paddingRight: "60px" }} />
//               <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: "#94a3b8", fontWeight: 600 }}>/20</span>
//             </div>
//             {form.valeur !== "" && !isNaN(parseFloat(form.valeur)) && (
//               <p style={{ margin: "6px 0 0", fontSize: "12px", color: cfg.color }}>
//                 Note pondérée : <strong>{(parseFloat(form.valeur) * cfg.coeff).toFixed(2)}</strong> (×{cfg.coeff})
//               </p>
//             )}
//           </div>

//           <div style={{ marginBottom: "20px" }}>
//             <label style={labelSt}>Commentaire <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optionnel)</span></label>
//             <textarea value={form.commentaire} onChange={e => setForm({ ...form, commentaire: e.target.value })}
//               rows={2} placeholder="Appréciation du professeur..."
//               style={{ ...inputSt, resize: "none" }} />
//           </div>

//           {error && (
//             <div style={{ marginBottom: "14px", padding: "10px 14px", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "13px", display: "flex", gap: "8px", alignItems: "center" }}>
//               <AlertCircle size={15} /> {error}
//             </div>
//           )}

//           <div style={{ display: "flex", gap: "10px" }}>
//             <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "white", color: "#64748b", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
//               Annuler
//             </button>
//             <button onClick={handleSubmit}
//               style={{ flex: 2, padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", color: "white", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 12px rgba(59,130,246,0.35)" }}>
//               <Save size={16} /> {note ? "Enregistrer" : "Ajouter la note"}
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// /* ── Carte élève avec ses notes ── */
// const EleveCard = ({ eleve, onAddNote, onEditNote, onDeleteNote }) => {
//   const [open, setOpen] = useState(false);
//   const notes = eleve.notes || [];

//   const moyenne = notes.length > 0
//     ? (() => {
//         const sumPondere = notes.reduce((s, n) => s + (parseFloat(n.valeur) * (TYPE_EPREUVE[n.type_epreuve]?.coeff || 1)), 0);
//         const sumCoeff   = notes.reduce((s, n) => s + (TYPE_EPREUVE[n.type_epreuve]?.coeff || 1), 0);
//         return (sumPondere / sumCoeff).toFixed(2);
//       })()
//     : null;

//   const appr = moyenne ? getAppr(parseFloat(moyenne)) : null;

//   return (
//     <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//       style={{ background: "white", borderRadius: "14px", border: "1.5px solid #e2e8f0", overflow: "hidden" }}>

//       <div onClick={() => setOpen(o => !o)}
//         style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer", background: open ? "#f8fafc" : "white", transition: "background 0.15s" }}>
//         <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #1d4ed8, #60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//           <span style={{ fontSize: "15px", fontWeight: 800, color: "white" }}>
//             {eleve.nom?.charAt(0)?.toUpperCase()}
//           </span>
//         </div>
//         <div style={{ flex: 1 }}>
//           <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
//             {eleve.nom} {eleve.prenom}
//           </p>
//           <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#94a3b8" }}>
//             {/* ✅ CORRIGÉ : eleve.classe est un objet → on affiche eleve.classe.libelle */}
//             Matricule : {eleve.matricule} · Classe : {eleve.classe?.libelle || "—"} · {notes.length} note{notes.length > 1 ? "s" : ""}
//           </p>
//         </div>
//         {moyenne && (
//           <div style={{ textAlign: "right", marginRight: "8px" }}>
//             <p style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: appr.color, lineHeight: 1 }}>{moyenne}</p>
//             <p style={{ margin: "2px 0 0", fontSize: "11px", color: appr.color, fontWeight: 600 }}>{appr.label}</p>
//           </div>
//         )}
//         <div style={{ color: "#94a3b8", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>
//           <ChevronDown size={18} />
//         </div>
//       </div>

//       <AnimatePresence>
//         {open && (
//           <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} style={{ overflow: "hidden" }}>
//             <div style={{ padding: "0 18px 16px", borderTop: "1px solid #f1f5f9" }}>
//               {notes.length === 0 ? (
//                 <div style={{ padding: "20px 0", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
//                   Aucune note pour cet élève
//                 </div>
//               ) : (
//                 <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
//                   {notes.map((note, i) => {
//                     const tcfg = TYPE_EPREUVE[note.type_epreuve] || TYPE_EPREUVE.devoir_classe;
//                     const a = getAppr(parseFloat(note.valeur));
//                     return (
//                       <motion.div key={note.id || i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
//                         style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #f1f5f9" }}>
//                         <div style={{ padding: "3px 10px", borderRadius: "20px", background: tcfg.bg, border: `1px solid ${tcfg.border}`, fontSize: "11px", fontWeight: 700, color: tcfg.color, whiteSpace: "nowrap", flexShrink: 0 }}>
//                           {tcfg.label} ×{tcfg.coeff}
//                         </div>
//                         <p style={{ margin: 0, flex: 1, fontSize: "13px", color: "#475569", fontWeight: 500 }}>
//                           {/* ✅ CORRIGÉ : note.matiere est une string, pas d'objet ici */}
//                           {note.matiere}
//                         </p>
//                         {note.commentaire && (
//                           <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", fontStyle: "italic", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                             {note.commentaire}
//                           </p>
//                         )}
//                         <div style={{ textAlign: "right", flexShrink: 0 }}>
//                           <span style={{ fontSize: "16px", fontWeight: 800, color: a.color }}>{note.valeur}</span>
//                           <span style={{ fontSize: "12px", color: "#94a3b8" }}>/20</span>
//                         </div>
//                         <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
//                           <button onClick={e => { e.stopPropagation(); onEditNote(eleve, note); }}
//                             style={{ width: "30px", height: "30px", borderRadius: "7px", border: "1px solid #bfdbfe", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
//                             <Edit3 size={13} color="#2563eb" />
//                           </button>
//                           <button onClick={e => { e.stopPropagation(); onDeleteNote(eleve, note); }}
//                             style={{ width: "30px", height: "30px", borderRadius: "7px", border: "1px solid #fecaca", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
//                             <Trash2 size={13} color="#ef4444" />
//                           </button>
//                         </div>
//                       </motion.div>
//                     );
//                   })}
//                 </div>
//               )}

//               <button onClick={e => { e.stopPropagation(); onAddNote(eleve); }}
//                 style={{ marginTop: "12px", width: "100%", padding: "10px", borderRadius: "10px", border: "1.5px dashed #bfdbfe", background: "#f8fbff", color: "#2563eb", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
//                 <Plus size={15} /> Ajouter une note
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// /* ══ COMPOSANT PRINCIPAL ══ */
// const Notes = () => {
//   const [classes, setClasses]               = useState([]);
//   const [selectedClasse, setSelectedClasse] = useState(null);
//   const [eleves, setEleves]                 = useState([]);
//   const [loadingClasses, setLoadingClasses] = useState(true);
//   const [loadingEleves, setLoadingEleves]   = useState(false);
//   const [modal, setModal]                   = useState(null);
//   const [feedback, setFeedback]             = useState(null);
//   const [search, setSearch]                 = useState("");

//   useEffect(() => { loadClasses(); }, []);
//   useEffect(() => { if (selectedClasse) loadEleves(selectedClasse.id); }, [selectedClasse]);

//   const loadClasses = async () => {
//     setLoadingClasses(true);
//     try {
//       const r = await axios.get(`${API}/classes`);
//       setClasses(Array.isArray(r.data) ? r.data : r.data.data || []);
//     } catch {
//       setFeedback({ type: "error", msg: "Impossible de charger les classes." });
//     } finally {
//       setLoadingClasses(false);
//     }
//   };

//   const loadEleves = async (classeId) => {
//     setLoadingEleves(true);
//     try {
//       const [elevesRes, notesRes] = await Promise.all([
//         axios.get(`${API}/eleves`),
//         axios.get(`${API}/notes`),
//       ]);

//       const tousEleves  = Array.isArray(elevesRes.data) ? elevesRes.data : elevesRes.data.data || [];
//       const toutesNotes = Array.isArray(notesRes.data)  ? notesRes.data  : notesRes.data.data  || [];

//       const elevesClasse = tousEleves.filter(e => e.classe_id === classeId);

//       // ✅ CORRIGÉ : on s'assure que eleve.classe n'est jamais rendu directement
//       // eleve vient de l'API avec classe = {id, libelle, ...} (objet imbriqué)
//       // On l'aplatit pour n'exposer que eleve.classe_libelle en string safe
//       const elevesAvecNotes = elevesClasse.map(e => ({
//         ...e,
//         // ✅ classe_libelle = string extraite de l'objet classe pour usage sûr dans le JSX
//         classe_libelle: typeof e.classe === "object" ? e.classe?.libelle : "—",
//         notes: toutesNotes.filter(n => n.eleve_id === e.id),
//       }));

//       setEleves(elevesAvecNotes);
//     } catch {
//       setEleves([]);
//       setFeedback({ type: "error", msg: "Impossible de charger les élèves." });
//     } finally {
//       setLoadingEleves(false);
//     }
//   };

//   const handleSaveNote = async (noteData) => {
//     const { eleve, note } = modal;
//     try {
//       if (note?.id) {
//         const r = await axios.put(`${API}/notes/${note.id}`, {
//           ...noteData,
//           eleve_id: eleve.id,
//           classe_id: selectedClasse?.id,
//         });
//         const updated = r.data.data || r.data;
//         setEleves(es => es.map(e => e.id === eleve.id
//           ? { ...e, notes: e.notes.map(n => n.id === note.id ? { ...n, ...noteData, ...updated } : n) }
//           : e
//         ));
//         showFeedback("success", "Note modifiée avec succès !");
//       } else {
//         const r = await axios.post(`${API}/notes`, {
//           ...noteData,
//           eleve_id: eleve.id,
//           classe_id: selectedClasse?.id,
//         });
//         const newNote = r.data.data || r.data;
//         setEleves(es => es.map(e => e.id === eleve.id
//           ? { ...e, notes: [...e.notes, newNote] }
//           : e
//         ));
//         showFeedback("success", "Note ajoutée avec succès !");
//       }
//       setModal(null);
//     } catch (err) {
//       showFeedback("error", err.response?.data?.message || "Erreur lors de l'enregistrement.");
//     }
//   };

//   const handleDeleteNote = async (eleve, note) => {
//     if (!window.confirm(`Supprimer la note ${note.valeur}/20 de ${eleve.nom} ${eleve.prenom} ?`)) return;
//     try {
//       await axios.delete(`${API}/notes/${note.id}`);
//       setEleves(es => es.map(e => e.id === eleve.id
//         ? { ...e, notes: e.notes.filter(n => n.id !== note.id) }
//         : e
//       ));
//       showFeedback("success", "Note supprimée.");
//     } catch {
//       showFeedback("error", "Erreur lors de la suppression.");
//     }
//   };

//   const showFeedback = (type, msg) => {
//     setFeedback({ type, msg });
//     setTimeout(() => setFeedback(null), 3500);
//   };

//   const filteredEleves = eleves.filter(e =>
//     `${e.nom} ${e.prenom}`.toLowerCase().includes(search.toLowerCase()) ||
//     e.matricule?.toLowerCase().includes(search.toLowerCase())
//   );

//   const statsGlobales = {
//     totalNotes: eleves.reduce((s, e) => s + (e.notes?.length || 0), 0),
//     moyenneClasse: (() => {
//       const allNotes = eleves.flatMap(e => e.notes || []);
//       if (!allNotes.length) return null;
//       const sum      = allNotes.reduce((s, n) => s + parseFloat(n.valeur) * (TYPE_EPREUVE[n.type_epreuve]?.coeff || 1), 0);
//       const coeffSum = allNotes.reduce((s, n) => s + (TYPE_EPREUVE[n.type_epreuve]?.coeff || 1), 0);
//       return (sum / coeffSum).toFixed(2);
//     })(),
//   };

//   return (
//     <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Outfit', 'Segoe UI', sans-serif" }}>
//       <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

//       {/* Header */}
//       <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "0 32px" }}>
//         <div style={{ maxWidth: "1100px", margin: "0 auto", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//             <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}>
//               <BookOpen size={20} color="white" />
//             </div>
//             <div>
//               <h1 style={{ margin: 0, fontSize: "19px", fontWeight: 700, color: "#0f172a", fontFamily: "'Fraunces', serif" }}>Gestion des Notes</h1>
//               {/* ✅ CORRIGÉ : selectedClasse.nom → selectedClasse.libelle */}
//               <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
//                 {selectedClasse ? `Classe : ${selectedClasse.libelle}` : "Saisie et suivi des évaluations"}
//               </p>
//             </div>
//           </div>

//           {selectedClasse && (
//             <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
//               {statsGlobales.moyenneClasse && (
//                 <div style={{ textAlign: "center" }}>
//                   <p style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#1d4ed8" }}>{statsGlobales.moyenneClasse}</p>
//                   <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>Moy. classe</p>
//                 </div>
//               )}
//               <div style={{ textAlign: "center" }}>
//                 <p style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#7c3aed" }}>{statsGlobales.totalNotes}</p>
//                 <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>Notes saisies</p>
//               </div>
//               <div style={{ textAlign: "center" }}>
//                 <p style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#059669" }}>{eleves.length}</p>
//                 <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>Élèves</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 32px" }}>

//         {/* Feedback */}
//         <AnimatePresence>
//           {feedback && (
//             <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
//               style={{ marginBottom: "16px", padding: "12px 18px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px",
//                 background: feedback.type === "success" ? "#f0fdf4" : "#fef2f2",
//                 border: `1px solid ${feedback.type === "success" ? "#bbf7d0" : "#fecaca"}`,
//                 color: feedback.type === "success" ? "#15803d" : "#dc2626",
//               }}>
//               {feedback.type === "success" ? <CheckCircle size={17} /> : <AlertCircle size={17} />}
//               <span style={{ fontSize: "14px", fontWeight: 500 }}>{feedback.msg}</span>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Légende coefficients */}
//         <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
//           {Object.entries(TYPE_EPREUVE).map(([k, v]) => (
//             <div key={k} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "20px", background: v.bg, border: `1px solid ${v.border}` }}>
//               <span style={{ fontSize: "13px", fontWeight: 700, color: v.color }}>{v.label}</span>
//               <span style={{ fontSize: "12px", color: v.color, background: "white", padding: "1px 7px", borderRadius: "10px", fontWeight: 700 }}>×{v.coeff}</span>
//             </div>
//           ))}
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px" }}>

//           {/* Colonne gauche : classes */}
//           <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", height: "fit-content" }}>
//             <div style={{ padding: "16px 18px", borderBottom: "1px solid #f1f5f9" }}>
//               <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
//                 <Users size={15} color="#2563eb" /> Sélectionner une classe
//               </h2>
//             </div>
//             <div style={{ padding: "10px" }}>
//               {loadingClasses ? (
//                 <div style={{ padding: "30px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>Chargement...</div>
//               ) : classes.length === 0 ? (
//                 <div style={{ padding: "30px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>Aucune classe disponible</div>
//               ) : classes.map((c, i) => (
//                 <motion.button key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
//                   onClick={() => { setSelectedClasse(c); setSearch(""); }}
//                   style={{
//                     width: "100%", padding: "12px 14px", borderRadius: "10px",
//                     border: `1.5px solid ${selectedClasse?.id === c.id ? "#3b82f6" : "transparent"}`,
//                     background: selectedClasse?.id === c.id ? "#eff6ff" : "transparent",
//                     display: "flex", alignItems: "center", gap: "12px", cursor: "pointer",
//                     marginBottom: "4px", textAlign: "left", transition: "all 0.15s",
//                   }}>
//                   <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: selectedClasse?.id === c.id ? "#2563eb" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                     <FileText size={15} color={selectedClasse?.id === c.id ? "white" : "#64748b"} />
//                   </div>
//                   <div>
//                     {/* ✅ CORRIGÉ : c.nom → c.libelle (champ réel de l'API) */}
//                     <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: selectedClasse?.id === c.id ? "#1d4ed8" : "#0f172a" }}>{c.libelle}</p>
//                     {c.niveau && <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#94a3b8" }}>{c.niveau}</p>}
//                   </div>
//                 </motion.button>
//               ))}
//             </div>
//           </div>

//           {/* Colonne droite : élèves */}
//           <div>
//             {!selectedClasse ? (
//               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//                 style={{ background: "white", borderRadius: "16px", border: "2px dashed #e2e8f0", padding: "80px 40px", textAlign: "center" }}>
//                 <Award size={48} color="#cbd5e1" style={{ marginBottom: "16px" }} />
//                 <p style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#cbd5e1", fontFamily: "'Fraunces', serif" }}>Sélectionnez une classe</p>
//                 <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#e2e8f0" }}>pour afficher les élèves et gérer leurs notes</p>
//               </motion.div>
//             ) : loadingEleves ? (
//               <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "60px", textAlign: "center", color: "#94a3b8" }}>
//                 <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                   style={{ width: "32px", height: "32px", border: "3px solid #e2e8f0", borderTopColor: "#3b82f6", borderRadius: "50%", margin: "0 auto 12px" }} />
//                 Chargement des élèves...
//               </div>
//             ) : (
//               <>
//                 <div style={{ marginBottom: "16px" }}>
//                   <input value={search} onChange={e => setSearch(e.target.value)}
//                     placeholder="Rechercher par nom, prénom ou matricule..."
//                     style={{ width: "100%", padding: "11px 16px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", outline: "none", color: "#0f172a", boxSizing: "border-box", background: "white", fontFamily: "inherit" }} />
//                 </div>

//                 {filteredEleves.length === 0 ? (
//                   <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "60px", textAlign: "center", color: "#94a3b8" }}>
//                     <Users size={40} style={{ marginBottom: "12px", opacity: 0.3 }} />
//                     <p style={{ margin: 0, fontSize: "14px" }}>
//                       {eleves.length === 0 ? "Aucun élève dans cette classe" : "Aucun élève trouvé"}
//                     </p>
//                   </div>
//                 ) : (
//                   <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//                     <AnimatePresence>
//                       {filteredEleves.map(eleve => (
//                         <EleveCard key={eleve.id} eleve={eleve}
//                           onAddNote={(e) => setModal({ eleve: e, note: null })}
//                           onEditNote={(e, n) => setModal({ eleve: e, note: n })}
//                           onDeleteNote={handleDeleteNote}
//                         />
//                       ))}
//                     </AnimatePresence>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       <AnimatePresence>
//         {modal && (
//           <NoteModal
//             eleve={modal.eleve}
//             note={modal.note}
//             onSave={handleSaveNote}
//             onClose={() => setModal(null)}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Notes;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Users, Plus, Edit3, Trash2, Save, X,
  ChevronDown, Award, AlertCircle, CheckCircle, FileText
} from "lucide-react";
import axios from "axios";

const API = "http://127.0.0.1:8001/api";

const TYPE_EPREUVE = {
  interrogation: { label: "Interrogation",    coeff: 0.5, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  devoir_classe: { label: "Devoir de classe", coeff: 1,   color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  devoir_niveau: { label: "Devoir de niveau", coeff: 2,   color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
};

const PERIODES = ["Trimestre 1", "Trimestre 2", "Trimestre 3"];

const getAppr = (note) => {
  if (note >= 16) return { label: "Très Bien",  color: "#059669" };
  if (note >= 14) return { label: "Bien",        color: "#2563eb" };
  if (note >= 12) return { label: "Assez Bien",  color: "#7c3aed" };
  if (note >= 10) return { label: "Passable",    color: "#f59e0b" };
  return             { label: "Insuffisant",     color: "#dc2626" };
};

const labelSt = {
  display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px",
};
const inputSt = {
  width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "9px",
  fontSize: "14px", outline: "none", color: "#0f172a", boxSizing: "border-box",
  fontFamily: "inherit", background: "#fafafa",
};

/* ── Modal saisie/édition note ── */
// ✅ CORRIGÉ : ajout de matieres et professeurs en props
// ✅ CORRIGÉ : champs adaptés à la vraie structure API (note, matiere_id, professeur_id, periode)
const NoteModal = ({ eleve, note, matieres, professeurs, onSave, onClose }) => {
  const [form, setForm] = useState(
    note
      ? {
          type_epreuve: note.type,
          note: note.note,
          matiere_id: note.matiere_id,
          professeur_id: note.professeur_id,
          periode: note.periode,
        }
      : {
          type_epreuve: "interrogation",
          note: "",
          matiere_id: "",
          professeur_id: professeurs[0]?.id || "",
          periode: "Trimestre 1",
        }
  );
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (form.note === "") { setError("La note est obligatoire."); return; }
    const val = parseFloat(form.note);
    if (isNaN(val) || val < 0 || val > 20) { setError("La note doit être entre 0 et 20."); return; }
    if (!form.matiere_id) { setError("La matière est obligatoire."); return; }
    if (!form.professeur_id) { setError("Le professeur est obligatoire."); return; }
    if (!form.periode) { setError("La période est obligatoire."); return; }
    onSave({ ...form, note: val });
  };

  const cfg = TYPE_EPREUVE[form.type_epreuve];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "500px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0f172a", fontFamily: "'Fraunces', serif" }}>
              {note ? "Modifier la note" : "Ajouter une note"}
            </h3>
            <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#64748b" }}>
              {eleve.nom} {eleve.prenom}
            </p>
          </div>
          <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color="#64748b" />
          </button>
        </div>

        <div style={{ padding: "22px 24px" }}>

          {/* Type d'épreuve */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelSt}>Type d'épreuve</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {Object.entries(TYPE_EPREUVE).map(([k, v]) => (
                <button key={k} onClick={() => setForm({ ...form, type_epreuve: k })}
                  style={{
                    padding: "10px 8px", borderRadius: "10px",
                    border: `2px solid ${form.type_epreuve === k ? v.color : "#e2e8f0"}`,
                    background: form.type_epreuve === k ? v.bg : "white",
                    cursor: "pointer", transition: "all 0.15s",
                  }}>
                  <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: form.type_epreuve === k ? v.color : "#64748b" }}>{v.label}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "11px", color: form.type_epreuve === k ? v.color : "#94a3b8" }}>Coeff ×{v.coeff}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ✅ CORRIGÉ : Matière via select (matiere_id) au lieu d'un champ texte libre */}
          <div style={{ marginBottom: "14px" }}>
            <label style={labelSt}>Matière <span style={{ color: "#ef4444" }}>*</span></label>
            <select value={form.matiere_id} onChange={e => setForm({ ...form, matiere_id: e.target.value })} style={inputSt}>
              <option value="">Choisir une matière</option>
              {matieres.map(m => (
                <option key={m.id} value={m.id}>{m.libelle}</option>
              ))}
            </select>
          </div>

          {/* ✅ CORRIGÉ : Professeur via select (professeur_id) — requis par l'API */}
          <div style={{ marginBottom: "14px" }}>
            <label style={labelSt}>Professeur <span style={{ color: "#ef4444" }}>*</span></label>
            <select value={form.professeur_id} onChange={e => setForm({ ...form, professeur_id: e.target.value })} style={inputSt}>
              <option value="">Choisir un professeur</option>
              {professeurs.map(p => (
                <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>
              ))}
            </select>
          </div>

          {/* ✅ CORRIGÉ : Période via select */}
          <div style={{ marginBottom: "14px" }}>
            <label style={labelSt}>Période <span style={{ color: "#ef4444" }}>*</span></label>
            <select value={form.periode} onChange={e => setForm({ ...form, periode: e.target.value })} style={inputSt}>
              {PERIODES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* ✅ CORRIGÉ : champ "note" au lieu de "valeur" */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelSt}>Note /20 <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={{ position: "relative" }}>
              <input type="number" min="0" max="20" step="0.25"
                value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
                placeholder="0 — 20"
                style={{ ...inputSt, paddingRight: "60px" }} />
              <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: "#94a3b8", fontWeight: 600 }}>/20</span>
            </div>
            {form.note !== "" && !isNaN(parseFloat(form.note)) && (
              <p style={{ margin: "6px 0 0", fontSize: "12px", color: cfg.color }}>
                Note pondérée : <strong>{(parseFloat(form.note) * cfg.coeff).toFixed(2)}</strong> (×{cfg.coeff})
              </p>
            )}
          </div>

          {error && (
            <div style={{ marginBottom: "14px", padding: "10px 14px", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "13px", display: "flex", gap: "8px", alignItems: "center" }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "white", color: "#64748b", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
              Annuler
            </button>
            <button onClick={handleSubmit}
              style={{ flex: 2, padding: "12px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", color: "white", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 12px rgba(59,130,246,0.35)" }}>
              <Save size={16} /> {note ? "Enregistrer" : "Ajouter la note"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Carte élève avec ses notes ── */
const EleveCard = ({ eleve, onAddNote, onEditNote, onDeleteNote }) => {
  const [open, setOpen] = useState(false);
  const notes = eleve.notes || [];

  const moyenne = notes.length > 0
    ? (() => {
        // ✅ CORRIGÉ : utilise note.note et note.coefficient (vrais champs API)
        const sumPondere = notes.reduce((s, n) => s + (parseFloat(n.note) * parseFloat(n.coefficient || TYPE_EPREUVE[n.type]?.coeff || 1)), 0);
        const sumCoeff   = notes.reduce((s, n) => s + parseFloat(n.coefficient || TYPE_EPREUVE[n.type]?.coeff || 1), 0);
        return (sumPondere / sumCoeff).toFixed(2);
      })()
    : null;

  const appr = moyenne ? getAppr(parseFloat(moyenne)) : null;

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: "white", borderRadius: "14px", border: "1.5px solid #e2e8f0", overflow: "hidden" }}>

      <div onClick={() => setOpen(o => !o)}
        style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer", background: open ? "#f8fafc" : "white", transition: "background 0.15s" }}>
        <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #1d4ed8, #60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: "15px", fontWeight: 800, color: "white" }}>
            {eleve.nom?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
            {eleve.nom} {eleve.prenom}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#94a3b8" }}>
            {/* ✅ CORRIGÉ : eleve.classe est un objet → on affiche eleve.classe.libelle */}
            Matricule : {eleve.matricule} · Classe : {eleve.classe_libelle || "—"} · {notes.length} note{notes.length > 1 ? "s" : ""}
          </p>
        </div>
        {moyenne && (
          <div style={{ textAlign: "right", marginRight: "8px" }}>
            <p style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: appr.color, lineHeight: 1 }}>{moyenne}</p>
            <p style={{ margin: "2px 0 0", fontSize: "11px", color: appr.color, fontWeight: 600 }}>{appr.label}</p>
          </div>
        )}
        <div style={{ color: "#94a3b8", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>
          <ChevronDown size={18} />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} style={{ overflow: "hidden" }}>
            <div style={{ padding: "0 18px 16px", borderTop: "1px solid #f1f5f9" }}>
              {notes.length === 0 ? (
                <div style={{ padding: "20px 0", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                  Aucune note pour cet élève
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                  {notes.map((note, i) => {
                    // ✅ CORRIGÉ : note.type (pas note.type_epreuve) — vrai champ API
                    const tcfg = TYPE_EPREUVE[note.type] || TYPE_EPREUVE.devoir_classe;
                    const a = getAppr(parseFloat(note.note));
                    return (
                      <motion.div key={note.id || i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                        <div style={{ padding: "3px 10px", borderRadius: "20px", background: tcfg.bg, border: `1px solid ${tcfg.border}`, fontSize: "11px", fontWeight: 700, color: tcfg.color, whiteSpace: "nowrap", flexShrink: 0 }}>
                          {tcfg.label} ×{tcfg.coeff}
                        </div>
                        {/* ✅ CORRIGÉ : matière via note.matiere.libelle (objet imbriqué) */}
                        <p style={{ margin: 0, flex: 1, fontSize: "13px", color: "#475569", fontWeight: 500 }}>
                          {note.matiere?.libelle || "—"}
                        </p>
                        {/* ✅ CORRIGÉ : période affichée */}
                        <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", whiteSpace: "nowrap" }}>
                          {note.periode}
                        </p>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          {/* ✅ CORRIGÉ : note.note (pas note.valeur) */}
                          <span style={{ fontSize: "16px", fontWeight: 800, color: a.color }}>{note.note}</span>
                          <span style={{ fontSize: "12px", color: "#94a3b8" }}>/20</span>
                        </div>
                        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                          <button onClick={e => { e.stopPropagation(); onEditNote(eleve, note); }}
                            style={{ width: "30px", height: "30px", borderRadius: "7px", border: "1px solid #bfdbfe", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                            <Edit3 size={13} color="#2563eb" />
                          </button>
                          <button onClick={e => { e.stopPropagation(); onDeleteNote(eleve, note); }}
                            style={{ width: "30px", height: "30px", borderRadius: "7px", border: "1px solid #fecaca", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                            <Trash2 size={13} color="#ef4444" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              <button onClick={e => { e.stopPropagation(); onAddNote(eleve); }}
                style={{ marginTop: "12px", width: "100%", padding: "10px", borderRadius: "10px", border: "1.5px dashed #bfdbfe", background: "#f8fbff", color: "#2563eb", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <Plus size={15} /> Ajouter une note
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ══ COMPOSANT PRINCIPAL ══ */
const Notes = () => {
  const [classes, setClasses]               = useState([]);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [eleves, setEleves]                 = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingEleves, setLoadingEleves]   = useState(false);
  const [modal, setModal]                   = useState(null);
  const [feedback, setFeedback]             = useState(null);
  const [search, setSearch]                 = useState("");
  // ✅ CORRIGÉ : ajout des states pour matieres et professeurs
  const [matieres, setMatieres]             = useState([]);
  const [professeurs, setProfesseurs]       = useState([]);

  useEffect(() => {
    loadClasses();
    // ✅ CORRIGÉ : charge matieres et professeurs au démarrage
    loadMatieres();
    loadProfesseurs();
  }, []);

  useEffect(() => { if (selectedClasse) loadEleves(selectedClasse.id); }, [selectedClasse]);

  const loadClasses = async () => {
    setLoadingClasses(true);
    try {
      const r = await axios.get(`${API}/classes`);
      setClasses(Array.isArray(r.data) ? r.data : r.data.data || []);
    } catch {
      setFeedback({ type: "error", msg: "Impossible de charger les classes." });
    } finally {
      setLoadingClasses(false);
    }
  };

  // ✅ CORRIGÉ : charge les matières depuis /matieres
  const loadMatieres = async () => {
    try {
      const r = await axios.get(`${API}/matieres`);
      setMatieres(Array.isArray(r.data) ? r.data : r.data.data || []);
    } catch { console.error("Impossible de charger les matières"); }
  };

  // ✅ CORRIGÉ : charge les professeurs depuis /professeurs
  const loadProfesseurs = async () => {
    try {
      const r = await axios.get(`${API}/professeurs`);
      setProfesseurs(Array.isArray(r.data) ? r.data : r.data.data || []);
    } catch { console.error("Impossible de charger les professeurs"); }
  };

  const loadEleves = async (classeId) => {
    setLoadingEleves(true);
    try {
      const [elevesRes, notesRes] = await Promise.all([
        axios.get(`${API}/eleves`),
        axios.get(`${API}/notes`),
      ]);

      const tousEleves  = Array.isArray(elevesRes.data) ? elevesRes.data : elevesRes.data.data || [];
      const toutesNotes = Array.isArray(notesRes.data)  ? notesRes.data  : notesRes.data.data  || [];

      const elevesClasse = tousEleves.filter(e => e.classe_id === classeId);

      const elevesAvecNotes = elevesClasse.map(e => ({
        ...e,
        // ✅ CORRIGÉ : extrait le libelle de classe comme string safe
        classe_libelle: typeof e.classe === "object" ? e.classe?.libelle : "—",
        // ✅ CORRIGÉ : filtre par eleve_id (vrai champ API)
        notes: toutesNotes.filter(n => n.eleve_id === e.id),
      }));

      setEleves(elevesAvecNotes);
    } catch {
      setEleves([]);
      setFeedback({ type: "error", msg: "Impossible de charger les élèves." });
    } finally {
      setLoadingEleves(false);
    }
  };

  const handleSaveNote = async (noteData) => {
    const { eleve, note } = modal;
    try {
      if (note?.id) {
        // ✅ CORRIGÉ : PUT envoie note, type, periode (champs acceptés par update)
        const r = await axios.put(`${API}/notes/${note.id}`, {
          note: noteData.note,
          type: noteData.type_epreuve,
          periode: noteData.periode,
        });
        const updated = r.data.data || r.data;
        setEleves(es => es.map(e => e.id === eleve.id
          ? { ...e, notes: e.notes.map(n => n.id === note.id ? { ...n, ...updated } : n) }
          : e
        ));
        showFeedback("success", "Note modifiée avec succès !");
      } else {
        // ✅ CORRIGÉ : POST envoie tous les champs requis par store()
        const r = await axios.post(`${API}/notes`, {
          eleve_id:      eleve.id,
          professeur_id: noteData.professeur_id,
          matiere_id:    noteData.matiere_id,
          note:          noteData.note,
          type:          noteData.type_epreuve,
          periode:       noteData.periode,
        });
        const newNote = r.data.data || r.data;
        setEleves(es => es.map(e => e.id === eleve.id
          ? { ...e, notes: [...e.notes, newNote] }
          : e
        ));
        showFeedback("success", "Note ajoutée avec succès !");
      }
      setModal(null);
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Erreur lors de l'enregistrement.");
    }
  };

  const handleDeleteNote = async (eleve, note) => {
    if (!window.confirm(`Supprimer la note ${note.note}/20 de ${eleve.nom} ${eleve.prenom} ?`)) return;
    try {
      await axios.delete(`${API}/notes/${note.id}`);
      setEleves(es => es.map(e => e.id === eleve.id
        ? { ...e, notes: e.notes.filter(n => n.id !== note.id) }
        : e
      ));
      showFeedback("success", "Note supprimée.");
    } catch {
      showFeedback("error", "Erreur lors de la suppression.");
    }
  };

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3500);
  };

  const filteredEleves = eleves.filter(e =>
    `${e.nom} ${e.prenom}`.toLowerCase().includes(search.toLowerCase()) ||
    e.matricule?.toLowerCase().includes(search.toLowerCase())
  );

  const statsGlobales = {
    totalNotes: eleves.reduce((s, e) => s + (e.notes?.length || 0), 0),
    moyenneClasse: (() => {
      const allNotes = eleves.flatMap(e => e.notes || []);
      if (!allNotes.length) return null;
      // ✅ CORRIGÉ : note.note et note.coefficient (vrais champs API)
      const sum      = allNotes.reduce((s, n) => s + parseFloat(n.note) * parseFloat(n.coefficient || 1), 0);
      const coeffSum = allNotes.reduce((s, n) => s + parseFloat(n.coefficient || 1), 0);
      return (sum / coeffSum).toFixed(2);
    })(),
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Outfit', 'Segoe UI', sans-serif" }}>
     
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "0 32px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}>
              <BookOpen size={20} color="white" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "19px", fontWeight: 700, color: "#0f172a", fontFamily: "'Fraunces', serif" }}>Gestion des Notes</h1>
              {/* ✅ CORRIGÉ : selectedClasse.libelle au lieu de selectedClasse.nom */}
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                {selectedClasse ? `Classe : ${selectedClasse.libelle}` : "Saisie et suivi des évaluations"}
              </p>
            </div>
          </div>

          {selectedClasse && (
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              {statsGlobales.moyenneClasse && (
                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#1d4ed8" }}>{statsGlobales.moyenneClasse}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>Moy. classe</p>
                </div>
              )}
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#7c3aed" }}>{statsGlobales.totalNotes}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>Notes saisies</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#059669" }}>{eleves.length}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>Élèves</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 32px" }}>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ marginBottom: "16px", padding: "12px 18px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px",
                background: feedback.type === "success" ? "#f0fdf4" : "#fef2f2",
                border: `1px solid ${feedback.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                color: feedback.type === "success" ? "#15803d" : "#dc2626",
              }}>
              {feedback.type === "success" ? <CheckCircle size={17} /> : <AlertCircle size={17} />}
              <span style={{ fontSize: "14px", fontWeight: 500 }}>{feedback.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Légende coefficients */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
          {Object.entries(TYPE_EPREUVE).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "20px", background: v.bg, border: `1px solid ${v.border}` }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: v.color }}>{v.label}</span>
              <span style={{ fontSize: "12px", color: v.color, background: "white", padding: "1px 7px", borderRadius: "10px", fontWeight: 700 }}>×{v.coeff}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px" }}>

          {/* Colonne gauche : classes */}
          <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", height: "fit-content" }}>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid #f1f5f9" }}>
              <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
                <Users size={15} color="#2563eb" /> Sélectionner une classe
              </h2>
            </div>
            <div style={{ padding: "10px" }}>
              {loadingClasses ? (
                <div style={{ padding: "30px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>Chargement...</div>
              ) : classes.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>Aucune classe disponible</div>
              ) : classes.map((c, i) => (
                <motion.button key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  onClick={() => { setSelectedClasse(c); setSearch(""); }}
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: "10px",
                    border: `1.5px solid ${selectedClasse?.id === c.id ? "#3b82f6" : "transparent"}`,
                    background: selectedClasse?.id === c.id ? "#eff6ff" : "transparent",
                    display: "flex", alignItems: "center", gap: "12px", cursor: "pointer",
                    marginBottom: "4px", textAlign: "left", transition: "all 0.15s",
                  }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: selectedClasse?.id === c.id ? "#2563eb" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileText size={15} color={selectedClasse?.id === c.id ? "white" : "#64748b"} />
                  </div>
                  <div>
                    {/* ✅ CORRIGÉ : c.libelle au lieu de c.nom */}
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: selectedClasse?.id === c.id ? "#1d4ed8" : "#0f172a" }}>{c.libelle}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Colonne droite : élèves */}
          <div>
            {!selectedClasse ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ background: "white", borderRadius: "16px", border: "2px dashed #e2e8f0", padding: "80px 40px", textAlign: "center" }}>
                <Award size={48} color="#cbd5e1" style={{ marginBottom: "16px" }} />
                <p style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#cbd5e1", fontFamily: "'Fraunces', serif" }}>Sélectionnez une classe</p>
                <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#e2e8f0" }}>pour afficher les élèves et gérer leurs notes</p>
              </motion.div>
            ) : loadingEleves ? (
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "60px", textAlign: "center", color: "#94a3b8" }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ width: "32px", height: "32px", border: "3px solid #e2e8f0", borderTopColor: "#3b82f6", borderRadius: "50%", margin: "0 auto 12px" }} />
                Chargement des élèves...
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "16px" }}>
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher par nom, prénom ou matricule..."
                    style={{ width: "100%", padding: "11px 16px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", outline: "none", color: "#0f172a", boxSizing: "border-box", background: "white", fontFamily: "inherit" }} />
                </div>

                {filteredEleves.length === 0 ? (
                  <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "60px", textAlign: "center", color: "#94a3b8" }}>
                    <Users size={40} style={{ marginBottom: "12px", opacity: 0.3 }} />
                    <p style={{ margin: 0, fontSize: "14px" }}>
                      {eleves.length === 0 ? "Aucun élève dans cette classe" : "Aucun élève trouvé"}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <AnimatePresence>
                      {filteredEleves.map(eleve => (
                        <EleveCard key={eleve.id} eleve={eleve}
                          onAddNote={(e) => setModal({ eleve: e, note: null })}
                          onEditNote={(e, n) => setModal({ eleve: e, note: n })}
                          onDeleteNote={handleDeleteNote}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ✅ CORRIGÉ : passe matieres et professeurs au modal */}
      <AnimatePresence>
        {modal && (
          <NoteModal
            eleve={modal.eleve}
            note={modal.note}
            matieres={matieres}
            professeurs={professeurs}
            onSave={handleSaveNote}
            onClose={() => setModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notes;
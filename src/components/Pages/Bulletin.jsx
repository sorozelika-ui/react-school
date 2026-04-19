// import { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ArrowLeft, ChevronLeft, ChevronRight, Search, X,
//   BookOpen, Award, Save, Eye, AlertCircle, CheckCircle,
//   TrendingUp, Users, FileText, ClipboardList
// } from "lucide-react";
// import toast from "react-hot-toast";
// import api from "../../services/api";

// const CI = {
//   orange: "#F77F00",
//   vert: "#009A44",
//   orangeLight: "rgba(247,127,0,0.10)",
//   bg: "#F5F6FA",
//   muted: "#9099a8",
//   dark: "#1a2236",
//   text: "#2d3748",
//   border: "rgba(0,0,0,0.08)",
// };

// const TRIMESTRES = [
//   { value: 1, label: "1er Trimestre" },
//   { value: 2, label: "2ème Trimestre" },
//   { value: 3, label: "3ème Trimestre" },
// ];

// const CONDUITES = ["Très bien", "Bien", "Assez bien", "Passable", "Insuffisant"];

// const avatarColors = [CI.orange, CI.vert, "#6c63ff", "#e53e3e", "#00bcd4", "#ff6b9d"];

// function getInitiales(nom, prenom) {
//   return `${prenom?.[0] || ""}${nom?.[0] || ""}`.toUpperCase();
// }

// function getMentionColor(moyenne) {
//   if (moyenne === null || moyenne === undefined) return CI.muted;
//   if (moyenne >= 16) return "#009A44";
//   if (moyenne >= 14) return "#3b82f6";
//   if (moyenne >= 12) return "#F77F00";
//   if (moyenne >= 10) return "#f59e0b";
//   return "#e53e3e";
// }

// function getMention(moyenne) {
//   if (moyenne === null || moyenne === undefined) return "—";
//   if (moyenne >= 16) return "Très bien";
//   if (moyenne >= 14) return "Bien";
//   if (moyenne >= 12) return "Assez bien";
//   if (moyenne >= 10) return "Passable";
//   return "Insuffisant";
// }

// // ─── Composant : Modal saisie des notes d'un élève ───────────────────────────
// function ModalSaisieNotes({ eleve, trimestre, matieres, onClose, onSave }) {
//   const [notes, setNotes] = useState({});
//   const [appreciations, setAppreciations] = useState({});
//   const [absences, setAbsences] = useState(eleve.absences || 0);
//   const [conduite, setConduite] = useState(eleve.conduite || "");
//   const [appreciationGenerale, setAppreciationGenerale] = useState(eleve.appreciation_generale || "");
//   const [saving, setSaving] = useState(false);

//   // Pré-remplir avec les notes existantes
//   useEffect(() => {
//     const n = {};
//     const a = {};
//     (eleve.notes || []).forEach(note => {
//       n[note.matiere_id] = note.note;
//       a[note.matiere_id] = note.appreciation || "";
//     });
//     setNotes(n);
//     setAppreciations(a);
//   }, [eleve]);

//   // Calcul de la moyenne en temps réel
//   const moyenneCalculee = (() => {
//     let totalPoints = 0;
//     let totalCoeff = 0;
//     matieres.forEach(m => {
//       const note = parseFloat(notes[m.id]);
//       if (!isNaN(note) && note >= 0 && note <= 20) {
//         totalPoints += note * m.coefficient;
//         totalCoeff += m.coefficient;
//       }
//     });
//     return totalCoeff > 0 ? (totalPoints / totalCoeff).toFixed(2) : null;
//   })();

//   async function handleSave() {
//     const notesPayload = matieres
//       .filter(m => notes[m.id] !== undefined && notes[m.id] !== "")
//       .map(m => ({
//         matiere_id: m.id,
//         note: parseFloat(notes[m.id]),
//         appreciation: appreciations[m.id] || null,
//       }));

//     if (notesPayload.length === 0) {
//       toast.error("Saisis au moins une note !");
//       return;
//     }

//     setSaving(true);
//     try {
//       await api.post("/notes", {
//         eleve_id: eleve.eleve_id,
//         trimestre,
//         absences,
//         conduite,
//         appreciation_generale: appreciationGenerale,
//         notes: notesPayload,
//       });
//       toast.success("Notes enregistrées ✅");
//       onSave();
//       onClose();
//     } catch (error) {
//       if (error.response?.data?.errors) {
//         const firstError = Object.values(error.response.data.errors)[0][0];
//         toast.error(firstError);
//       } else {
//         toast.error("Erreur lors de l'enregistrement.");
//       }
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//       style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300,
//         display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
//       onClick={e => e.target === e.currentTarget && onClose()}
//     >
//       <motion.div initial={{ opacity: 0, scale: 0.93, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.93, y: 24 }}
//         style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 680,
//           maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}
//       >
//         {/* Header */}
//         <div style={{ padding: "1.4rem 1.8rem", borderBottom: `1px solid ${CI.border}`,
//           position: "sticky", top: 0, background: "#fff", zIndex: 10,
//           display: "flex", alignItems: "center", justifyContent: "space-between" }}
//         >
//           <div>
//             <div style={{ height: 3, width: 36, background: `linear-gradient(90deg, ${CI.orange}, ${CI.vert})`,
//               borderRadius: 2, marginBottom: 8 }} />
//             <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem",
//               fontWeight: 900, color: CI.dark, margin: 0 }}>
//               📝 Notes de {eleve.prenom} {eleve.nom}
//             </h2>
//             <p style={{ color: CI.muted, fontSize: "0.78rem", margin: "3px 0 0" }}>
//               {TRIMESTRES.find(t => t.value === trimestre)?.label} · Année 2024–2025
//             </p>
//           </div>
//           {/* Moyenne en temps réel */}
//           {moyenneCalculee && (
//             <div style={{ textAlign: "center", background: `${getMentionColor(parseFloat(moyenneCalculee))}15`,
//               borderRadius: 12, padding: "8px 16px" }}>
//               <div style={{ fontSize: "1.5rem", fontWeight: 900, fontFamily: "'Playfair Display', serif",
//                 color: getMentionColor(parseFloat(moyenneCalculee)) }}>
//                 {moyenneCalculee}
//               </div>
//               <div style={{ fontSize: "0.68rem", color: CI.muted, fontWeight: 600 }}>MOY. CALCULÉE</div>
//             </div>
//           )}
//         </div>

//         <div style={{ padding: "1.4rem 1.8rem" }}>
//           {/* Tableau des notes par matière */}
//           <div style={{ marginBottom: "1.5rem" }}>
//             <div style={{ fontSize: "0.73rem", fontWeight: 700, color: CI.muted,
//               textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
//               Notes par matière
//             </div>
//             <div style={{ border: `1px solid ${CI.border}`, borderRadius: 12, overflow: "hidden" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ background: "#F8F9FC" }}>
//                     {["Matière", "Coeff.", "Note /20", "Appréciation du prof"].map((h, i) => (
//                       <th key={i} style={{ padding: "10px 14px", textAlign: "left",
//                         fontSize: "0.7rem", fontWeight: 700, color: CI.muted,
//                         textTransform: "uppercase", letterSpacing: "0.5px",
//                         borderBottom: `1px solid ${CI.border}` }}>
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {matieres.map((matiere, i) => {
//                     const noteVal = notes[matiere.id] ?? "";
//                     const noteNum = parseFloat(noteVal);
//                     const noteColor = !isNaN(noteNum)
//                       ? getMentionColor(noteNum)
//                       : CI.muted;
//                     return (
//                       <tr key={matiere.id}
//                         style={{ borderBottom: `1px solid ${CI.border}`,
//                           background: i % 2 === 0 ? "#fff" : "#FAFBFF" }}
//                       >
//                         <td style={{ padding: "10px 14px" }}>
//                           <div style={{ fontWeight: 600, fontSize: "0.85rem", color: CI.dark }}>
//                             {matiere.nom}
//                           </div>
//                           <div style={{ fontSize: "0.72rem", color: CI.muted }}>{matiere.code}</div>
//                         </td>
//                         <td style={{ padding: "10px 14px" }}>
//                           <span style={{ background: CI.orangeLight, color: CI.orange,
//                             borderRadius: 6, padding: "2px 8px", fontSize: "0.75rem", fontWeight: 700 }}>
//                             ×{matiere.coefficient}
//                           </span>
//                         </td>
//                         <td style={{ padding: "10px 14px", width: 100 }}>
//                           <input
//                             type="number" min="0" max="20" step="0.25"
//                             value={noteVal}
//                             onChange={e => setNotes(prev => ({ ...prev, [matiere.id]: e.target.value }))}
//                             placeholder="—"
//                             style={{
//                               width: 72, padding: "6px 10px", borderRadius: 8, outline: "none",
//                               border: `1.5px solid ${!isNaN(noteNum) && noteVal !== "" ? noteColor : "rgba(0,0,0,0.10)"}`,
//                               fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem",
//                               fontWeight: 700, color: noteColor, textAlign: "center",
//                               background: !isNaN(noteNum) && noteVal !== "" ? `${noteColor}10` : "#F8F9FC",
//                             }}
//                           />
//                         </td>
//                         <td style={{ padding: "10px 14px" }}>
//                           <input
//                             type="text"
//                             value={appreciations[matiere.id] || ""}
//                             onChange={e => setAppreciations(prev => ({ ...prev, [matiere.id]: e.target.value }))}
//                             placeholder="ex: Bon travail..."
//                             style={{
//                               width: "100%", padding: "6px 10px", borderRadius: 8,
//                               border: "1.5px solid rgba(0,0,0,0.10)", outline: "none",
//                               fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem",
//                               color: CI.text, background: "#F8F9FC", boxSizing: "border-box"
//                             }}
//                           />
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Infos bulletin */}
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
//             {/* Absences */}
//             <div style={{ marginBottom: "1rem" }}>
//               <label style={{ display: "block", fontSize: "0.73rem", fontWeight: 700,
//                 color: CI.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
//                 Absences (heures)
//               </label>
//               <input type="number" min="0" value={absences}
//                 onChange={e => setAbsences(parseInt(e.target.value) || 0)}
//                 style={{ width: "100%", padding: "10px 12px", borderRadius: 9, outline: "none",
//                   border: "1.5px solid rgba(0,0,0,0.10)", fontFamily: "'DM Sans', sans-serif",
//                   fontSize: "0.9rem", color: CI.dark, background: "#F8F9FC", boxSizing: "border-box" }}
//               />
//             </div>

//             {/* Conduite */}
//             <div style={{ marginBottom: "1rem" }}>
//               <label style={{ display: "block", fontSize: "0.73rem", fontWeight: 700,
//                 color: CI.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
//                 Conduite
//               </label>
//               <select value={conduite} onChange={e => setConduite(e.target.value)}
//                 style={{ width: "100%", padding: "10px 12px", borderRadius: 9, outline: "none",
//                   border: "1.5px solid rgba(0,0,0,0.10)", fontFamily: "'DM Sans', sans-serif",
//                   fontSize: "0.9rem", color: conduite ? CI.dark : CI.muted,
//                   background: "#F8F9FC", appearance: "none", cursor: "pointer", boxSizing: "border-box" }}
//               >
//                 <option value="">Choisir...</option>
//                 {CONDUITES.map(c => <option key={c} value={c}>{c}</option>)}
//               </select>
//             </div>
//           </div>

//           {/* Appréciation générale */}
//           <div style={{ marginBottom: "1.5rem" }}>
//             <label style={{ display: "block", fontSize: "0.73rem", fontWeight: 700,
//               color: CI.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
//               Appréciation générale du conseil de classe
//             </label>
//             <textarea
//               value={appreciationGenerale}
//               onChange={e => setAppreciationGenerale(e.target.value)}
//               placeholder="ex: Élève sérieux, des efforts à maintenir en mathématiques..."
//               rows={3}
//               style={{ width: "100%", padding: "10px 12px", borderRadius: 9, outline: "none",
//                 border: "1.5px solid rgba(0,0,0,0.10)", fontFamily: "'DM Sans', sans-serif",
//                 fontSize: "0.88rem", color: CI.dark, background: "#F8F9FC",
//                 resize: "vertical", boxSizing: "border-box" }}
//             />
//           </div>

//           {/* Boutons */}
//           <div style={{ display: "flex", gap: "0.75rem" }}>
//             <button onClick={onClose}
//               style={{ flex: 1, padding: "12px", background: "#f0f0f0", border: "none",
//                 borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
//                 fontSize: "0.88rem", cursor: "pointer", color: CI.muted }}
//             >
//               Annuler
//             </button>
//             <motion.button onClick={handleSave} disabled={saving}
//               whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: saving ? 1 : 0.97 }}
//               style={{ flex: 2, padding: "12px", background: saving ? `${CI.vert}80` : CI.vert,
//                 color: "#fff", border: "none", borderRadius: 12, fontFamily: "'DM Sans', sans-serif",
//                 fontSize: "0.9rem", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
//                 display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
//             >
//               {saving ? (
//                 <>
//                   <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
//                     style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)",
//                       borderTopColor: "#fff", borderRadius: "50%" }} />
//                   Enregistrement...
//                 </>
//               ) : (
//                 <><Save size={17} /> Enregistrer les notes</>
//               )}
//             </motion.button>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// // ─── Composant : Modal aperçu du bulletin ────────────────────────────────────
// function ModalAperçuBulletin({ eleve, trimestre, matieres, onClose }) {
//   const moyenneCalculee = (() => {
//     let totalPoints = 0;
//     let totalCoeff = 0;
//     (eleve.notes || []).forEach(n => {
//       totalPoints += n.note * n.coefficient;
//       totalCoeff += n.coefficient;
//     });
//     return totalCoeff > 0 ? (totalPoints / totalCoeff).toFixed(2) : null;
//   })();

//   const couleurMoyenne = getMentionColor(parseFloat(moyenneCalculee));

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//       style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300,
//         display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
//       onClick={e => e.target === e.currentTarget && onClose()}
//     >
//       <motion.div initial={{ opacity: 0, scale: 0.93, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
//         exit={{ opacity: 0, scale: 0.93, y: 24 }}
//         style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 620,
//           maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}
//       >
//         {/* En-tête bulletin */}
//         <div style={{ background: `linear-gradient(135deg, ${CI.dark} 0%, #2d3748 100%)`,
//           borderRadius: "24px 24px 0 0", padding: "2rem 1.8rem", color: "#fff" }}>
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <div>
//               <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem",
//                 fontWeight: 900, color: CI.orange }}>
//                 ÉcoleTrack
//               </div>
//               <div style={{ fontSize: "0.78rem", opacity: 0.7, marginTop: 2 }}>
//                 Bulletin de notes · Année 2024–2025
//               </div>
//             </div>
//             <div style={{ textAlign: "right" }}>
//               <div style={{ fontSize: "0.78rem", opacity: 0.7 }}>Classe</div>
//               <div style={{ fontWeight: 700, fontSize: "1rem" }}>{eleve.classe || "—"}</div>
//             </div>
//           </div>
//           <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: 16 }}>
//             <div style={{ width: 52, height: 52, borderRadius: "50%",
//               background: `linear-gradient(135deg, ${CI.orange}, ${CI.vert})`,
//               display: "flex", alignItems: "center", justifyContent: "center",
//               fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 900, color: "#fff" }}>
//               {getInitiales(eleve.nom, eleve.prenom)}
//             </div>
//             <div>
//               <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 900 }}>
//                 {eleve.prenom} {eleve.nom}
//               </div>
//               <div style={{ fontSize: "0.78rem", opacity: 0.7 }}>
//                 {TRIMESTRES.find(t => t.value === trimestre)?.label}
//               </div>
//             </div>
//             {moyenneCalculee && (
//               <div style={{ marginLeft: "auto", textAlign: "center",
//                 background: `${couleurMoyenne}25`, borderRadius: 14, padding: "10px 18px" }}>
//                 <div style={{ fontSize: "2rem", fontWeight: 900,
//                   fontFamily: "'Playfair Display', serif", color: couleurMoyenne }}>
//                   {moyenneCalculee}
//                 </div>
//                 <div style={{ fontSize: "0.65rem", color: couleurMoyenne, fontWeight: 700 }}>
//                   MOYENNE · {getMention(parseFloat(moyenneCalculee))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <div style={{ padding: "1.4rem 1.8rem" }}>
//           {/* Infos résumé */}
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem",
//             marginBottom: "1.5rem" }}>
//             {[
//               { label: "Rang", value: eleve.rang ? `${eleve.rang}e` : "—", color: "#6c63ff" },
//               { label: "Absences", value: `${eleve.absences || 0}h`, color: "#e53e3e" },
//               { label: "Conduite", value: eleve.conduite || "—", color: CI.vert },
//             ].map((s, i) => (
//               <div key={i} style={{ background: "#F8F9FC", borderRadius: 10,
//                 padding: "0.75rem", textAlign: "center", border: `1px solid ${CI.border}` }}>
//                 <div style={{ fontSize: "1.1rem", fontWeight: 900,
//                   fontFamily: "'Playfair Display', serif", color: s.color }}>
//                   {s.value}
//                 </div>
//                 <div style={{ fontSize: "0.68rem", color: CI.muted, fontWeight: 600,
//                   textTransform: "uppercase", marginTop: 2 }}>
//                   {s.label}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Tableau des notes */}
//           <div style={{ border: `1px solid ${CI.border}`, borderRadius: 12, overflow: "hidden", marginBottom: "1.2rem" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr style={{ background: "#F8F9FC" }}>
//                   {["Matière", "Coeff.", "Note", "Appréciation"].map((h, i) => (
//                     <th key={i} style={{ padding: "10px 14px", textAlign: "left",
//                       fontSize: "0.7rem", fontWeight: 700, color: CI.muted,
//                       textTransform: "uppercase", letterSpacing: "0.5px",
//                       borderBottom: `1px solid ${CI.border}` }}>
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {matieres.map((matiere, i) => {
//                   const noteData = eleve.notes?.find(n => n.matiere_id === matiere.id);
//                   const noteColor = noteData ? getMentionColor(noteData.note) : CI.muted;
//                   return (
//                     <tr key={matiere.id}
//                       style={{ borderBottom: `1px solid ${CI.border}`,
//                         background: i % 2 === 0 ? "#fff" : "#FAFBFF" }}
//                     >
//                       <td style={{ padding: "10px 14px", fontWeight: 600,
//                         fontSize: "0.85rem", color: CI.dark }}>
//                         {matiere.nom}
//                       </td>
//                       <td style={{ padding: "10px 14px" }}>
//                         <span style={{ background: CI.orangeLight, color: CI.orange,
//                           borderRadius: 6, padding: "2px 8px", fontSize: "0.72rem", fontWeight: 700 }}>
//                           ×{matiere.coefficient}
//                         </span>
//                       </td>
//                       <td style={{ padding: "10px 14px" }}>
//                         {noteData ? (
//                           <span style={{ background: `${noteColor}15`, color: noteColor,
//                             borderRadius: 6, padding: "3px 10px", fontSize: "0.82rem", fontWeight: 700 }}>
//                             {noteData.note}/20
//                           </span>
//                         ) : (
//                           <span style={{ color: CI.muted, fontSize: "0.82rem" }}>—</span>
//                         )}
//                       </td>
//                       <td style={{ padding: "10px 14px", fontSize: "0.8rem",
//                         color: CI.muted, fontStyle: noteData?.appreciation ? "normal" : "italic" }}>
//                         {noteData?.appreciation || "—"}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Appréciation générale */}
//           {eleve.appreciation_generale && (
//             <div style={{ background: `${CI.orange}08`, border: `1px solid ${CI.orangeLight}`,
//               borderRadius: 12, padding: "1rem 1.2rem", marginBottom: "1.2rem" }}>
//               <div style={{ fontSize: "0.72rem", fontWeight: 700, color: CI.orange,
//                 textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>
//                 Appréciation du conseil de classe
//               </div>
//               <p style={{ fontSize: "0.88rem", color: CI.dark, margin: 0, lineHeight: 1.6 }}>
//                 {eleve.appreciation_generale}
//               </p>
//             </div>
//           )}

//           <button onClick={onClose}
//             style={{ width: "100%", padding: "12px", background: "#f0f0f0", border: "none",
//               borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
//               fontSize: "0.88rem", cursor: "pointer", color: CI.muted }}
//           >
//             Fermer
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// // ─── Composant principal ──────────────────────────────────────────────────────
// export default function Bulletins() {
//   const navigate = useNavigate();
//   const [trimestre, setTrimestre] = useState(1);
//   const [eleves, setEleves] = useState([]);
//   const [matieres, setMatieres] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [filtreClasse, setFiltreClasse] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [eleveSelectionne, setEleveSelectionne] = useState(null);
//   const [modeModal, setModeModal] = useState(null); // "saisie" | "apercu"
//   const PER_PAGE = 10;

//   const fetchDonnees = useCallback(async () => {
//     try {
//       setLoading(true);
//       const params = { trimestre };
//       if (filtreClasse) params.classe_id = filtreClasse;
//       const res = await api.get("/bulletin", { params });
//       setEleves(res.data.eleves || []);
//       setMatieres(res.data.matieres || []);
//     } catch {
//       toast.error("Impossible de charger les bulletins.");
//     } finally {
//       setLoading(false);
//     }
//   }, [trimestre, filtreClasse]);

//   // Charger les classes une seule fois
//   useEffect(() => {
//     api.get("/classes").then(res => {
//       setClasses(Array.isArray(res.data) ? res.data : res.data.data || []);
//     }).catch(() => {});
//   }, []);

//   useEffect(() => {
//     fetchDonnees();
//     setPage(1);
//   }, [fetchDonnees]);

//   const elevesFiltres = eleves.filter(e => {
//     const s = search.toLowerCase();
//     return !search || e.nom?.toLowerCase().includes(s) || e.prenom?.toLowerCase().includes(s);
//   });

//   const totalPages = Math.ceil(elevesFiltres.length / PER_PAGE);
//   const elevesPagines = elevesFiltres.slice((page - 1) * PER_PAGE, page * PER_PAGE);

//   // Stats globales
//   const moyennes = eleves.filter(e => e.moyenne !== null).map(e => parseFloat(e.moyenne));
//   const moyenneClasse = moyennes.length > 0
//     ? (moyennes.reduce((a, b) => a + b, 0) / moyennes.length).toFixed(2)
//     : null;
//   const nbNotesSaisies = eleves.filter(e => e.notes?.length > 0).length;

//   return (
//     <div style={{ fontFamily: "'DM Sans', sans-serif", background: CI.bg, minHeight: "100vh", color: CI.text }}>

//       {/* HEADER */}
//       <header style={{ background: "#fff", borderBottom: `1px solid ${CI.border}`, padding: "0 2rem",
//         height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
//         position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
//           <motion.button whileHover={{ x: -3 }} onClick={() => navigate("/dashboard")}
//             style={{ background: "none", border: "none", color: CI.muted, cursor: "pointer",
//               display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem",
//               fontFamily: "'DM Sans', sans-serif", padding: "6px 10px", borderRadius: 8 }}
//           >
//             <ArrowLeft size={16} /> Retour
//           </motion.button>
//           <div style={{ width: 1, height: 20, background: CI.border }} />
//           <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 900, color: CI.orange }}>
//             École<span style={{ color: CI.dark, fontWeight: 700 }}>Track</span>
//           </div>
//         </div>

//         {/* Sélecteur de trimestre */}
//         <div style={{ display: "flex", gap: "0.5rem" }}>
//           {TRIMESTRES.map(t => (
//             <motion.button key={t.value} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
//               onClick={() => setTrimestre(t.value)}
//               style={{ padding: "8px 16px", borderRadius: 10, border: "none", fontFamily: "'DM Sans', sans-serif",
//                 fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
//                 background: trimestre === t.value ? CI.orange : "#f0f0f0",
//                 color: trimestre === t.value ? "#fff" : CI.muted,
//                 boxShadow: trimestre === t.value ? "0 4px 12px rgba(247,127,0,0.3)" : "none" }}
//             >
//               {t.label}
//             </motion.button>
//           ))}
//         </div>
//       </header>

//       <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>

//         {/* TITRE */}
//         <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "1.5rem" }}>
//           <div style={{ height: 4, width: 48, background: `linear-gradient(90deg, ${CI.orange}, ${CI.vert})`,
//             borderRadius: 2, marginBottom: "0.75rem" }} />
//           <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem",
//             fontWeight: 900, color: CI.dark, marginBottom: 4 }}>
//             Bulletins — {TRIMESTRES.find(t => t.value === trimestre)?.label}
//           </h1>
//           <p style={{ color: CI.muted, fontSize: "0.88rem" }}>
//             {eleves.length} élève{eleves.length > 1 ? "s" : ""} · Année 2024–2025
//           </p>
//         </motion.div>

//         {/* STATS */}
//         <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
//           style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
//             gap: "1rem", marginBottom: "1.5rem" }}
//         >
//           {[
//             { label: "Total élèves", value: eleves.length, color: CI.orange, icon: <Users size={18} /> },
//             { label: "Notes saisies", value: nbNotesSaisies, color: CI.vert, icon: <ClipboardList size={18} /> },
//             { label: "Moy. classe", value: moyenneClasse || "—", color: "#6c63ff", icon: <TrendingUp size={18} /> },
//             { label: "Matières", value: matieres.length, color: "#00bcd4", icon: <BookOpen size={18} /> },
//           ].map((s, i) => (
//             <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "1rem",
//               border: `1px solid ${CI.border}`, borderTop: `3px solid ${s.color}`,
//               boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
//               <div style={{ color: s.color, marginBottom: 6 }}>{s.icon}</div>
//               <div style={{ fontSize: "1.6rem", fontWeight: 900,
//                 fontFamily: "'Playfair Display', serif", color: s.color }}>
//                 {s.value}
//               </div>
//               <div style={{ fontSize: "0.7rem", color: CI.muted, fontWeight: 600,
//                 textTransform: "uppercase", marginTop: 2 }}>
//                 {s.label}
//               </div>
//             </div>
//           ))}
//         </motion.div>

//         {/* RECHERCHE + FILTRE CLASSE */}
//         <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
//           style={{ display: "flex", gap: "1rem", marginBottom: "1.2rem", flexWrap: "wrap" }}
//         >
//           <div style={{ position: "relative", flex: 2, minWidth: 200 }}>
//             <Search size={15} color={CI.muted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
//             <input type="text" placeholder="Rechercher un élève..." value={search}
//               onChange={e => { setSearch(e.target.value); setPage(1); }}
//               style={{ width: "100%", background: "#fff", border: `1px solid ${CI.border}`,
//                 color: CI.dark, padding: "10px 38px", borderRadius: 10,
//                 fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", outline: "none",
//                 boxSizing: "border-box", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}
//             />
//             {search && (
//               <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12,
//                 top: "50%", transform: "translateY(-50%)", background: "none",
//                 border: "none", cursor: "pointer", color: CI.muted }}>
//                 <X size={14} />
//               </button>
//             )}
//           </div>
//           {classes.length > 0 && (
//             <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
//               <select value={filtreClasse} onChange={e => { setFiltreClasse(e.target.value); setPage(1); }}
//                 style={{ width: "100%", background: "#fff", border: `1px solid ${CI.border}`,
//                   color: CI.dark, padding: "10px 12px", borderRadius: 10,
//                   fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem",
//                   outline: "none", appearance: "none", cursor: "pointer",
//                   boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}
//               >
//                 <option value="">Toutes les classes</option>
//                 {classes.map(c => <option key={c.id} value={c.id}>{c.libelle}</option>)}
//               </select>
//             </div>
//           )}
//         </motion.div>

//         {/* TABLEAU */}
//         <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
//           style={{ background: "#fff", borderRadius: 20, border: `1px solid ${CI.border}`,
//             boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}
//         >
//           <div style={{ height: 4, background: `linear-gradient(90deg, ${CI.orange} 33%, #fff 33%, #fff 66%, ${CI.vert} 66%)` }} />

//           {loading ? (
//             <div style={{ textAlign: "center", padding: "4rem", color: CI.muted }}>
//               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
//                 style={{ width: 36, height: 36, border: `3px solid ${CI.orange}30`,
//                   borderTopColor: CI.orange, borderRadius: "50%", margin: "0 auto 1rem" }} />
//               Chargement...
//             </div>
//           ) : elevesFiltres.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
//               <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
//               <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem",
//                 color: CI.dark, marginBottom: 8 }}>
//                 Aucun élève trouvé
//               </h3>
//               <p style={{ color: CI.muted, fontSize: "0.85rem" }}>
//                 Vérifie le filtre de classe ou le trimestre sélectionné.
//               </p>
//             </div>
//           ) : (
//             <div style={{ overflowX: "auto" }}>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ background: "#F8F9FC" }}>
//                     {["Élève", "Classe", "Moyenne", "Rang", "Absences", "Conduite", "Statut", "Actions"].map((h, i) => (
//                       <th key={i} style={{ padding: "12px 16px", textAlign: "left",
//                         fontSize: "0.72rem", fontWeight: 700, color: CI.muted,
//                         textTransform: "uppercase", letterSpacing: "0.6px",
//                         borderBottom: `1px solid ${CI.border}`, whiteSpace: "nowrap" }}>
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {elevesPagines.map((eleve, i) => {
//                     const color = avatarColors[i % avatarColors.length];
//                     const aNotes = eleve.notes?.length > 0;
//                     const moyenneColor = getMentionColor(parseFloat(eleve.moyenne));

//                     return (
//                       <tr key={eleve.eleve_id}
//                         style={{ borderBottom: `1px solid ${CI.border}`, transition: "background 0.15s" }}
//                         onMouseEnter={e => e.currentTarget.style.background = "#FAFBFF"}
//                         onMouseLeave={e => e.currentTarget.style.background = "transparent"}
//                       >
//                         {/* Élève */}
//                         <td style={{ padding: "12px 16px" }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                             <div style={{ width: 36, height: 36, borderRadius: "50%",
//                               background: `linear-gradient(135deg, ${color}, ${color}bb)`,
//                               display: "flex", alignItems: "center", justifyContent: "center",
//                               fontSize: "0.8rem", fontWeight: 900, color: "#fff", flexShrink: 0,
//                               fontFamily: "'Playfair Display', serif" }}>
//                               {getInitiales(eleve.nom, eleve.prenom)}
//                             </div>
//                             <div style={{ fontWeight: 700, fontSize: "0.88rem",
//                               color: CI.dark, whiteSpace: "nowrap" }}>
//                               {eleve.prenom} {eleve.nom}
//                             </div>
//                           </div>
//                         </td>

//                         {/* Classe */}
//                         <td style={{ padding: "12px 16px" }}>
//                           <span style={{ background: CI.orangeLight, color: CI.orange,
//                             borderRadius: 6, padding: "3px 10px", fontSize: "0.75rem",
//                             fontWeight: 700, whiteSpace: "nowrap" }}>
//                             {eleve.classe || "—"}
//                           </span>
//                         </td>

//                         {/* Moyenne */}
//                         <td style={{ padding: "12px 16px" }}>
//                           {eleve.moyenne ? (
//                             <span style={{ background: `${moyenneColor}15`, color: moyenneColor,
//                               borderRadius: 6, padding: "3px 10px", fontSize: "0.82rem",
//                               fontWeight: 700, whiteSpace: "nowrap" }}>
//                               {eleve.moyenne}/20
//                             </span>
//                           ) : (
//                             <span style={{ color: CI.muted, fontSize: "0.82rem" }}>—</span>
//                           )}
//                         </td>

//                         {/* Rang */}
//                         <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: CI.dark, fontWeight: 700 }}>
//                           {eleve.rang ? (
//                             <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
//                               {eleve.rang === 1 && <Award size={14} color="#f59e0b" />}
//                               {eleve.rang}e
//                             </span>
//                           ) : "—"}
//                         </td>

//                         {/* Absences */}
//                         <td style={{ padding: "12px 16px", fontSize: "0.82rem",
//                           color: eleve.absences > 0 ? "#e53e3e" : CI.muted }}>
//                           {eleve.absences > 0 ? `${eleve.absences}h` : "0h"}
//                         </td>

//                         {/* Conduite */}
//                         <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: CI.text }}>
//                           {eleve.conduite || <span style={{ color: CI.muted }}>—</span>}
//                         </td>

//                         {/* Statut */}
//                         <td style={{ padding: "12px 16px" }}>
//                           {aNotes ? (
//                             <span style={{ display: "inline-flex", alignItems: "center", gap: 4,
//                               background: "#009A4415", color: CI.vert, borderRadius: 6,
//                               padding: "3px 10px", fontSize: "0.72rem", fontWeight: 700 }}>
//                               <CheckCircle size={11} /> Saisi
//                             </span>
//                           ) : (
//                             <span style={{ display: "inline-flex", alignItems: "center", gap: 4,
//                               background: "rgba(247,127,0,0.1)", color: CI.orange, borderRadius: 6,
//                               padding: "3px 10px", fontSize: "0.72rem", fontWeight: 700 }}>
//                               <AlertCircle size={11} /> En attente
//                             </span>
//                           )}
//                         </td>

//                         {/* Actions */}
//                         <td style={{ padding: "12px 16px" }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                             <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
//                               onClick={() => { setEleveSelectionne(eleve); setModeModal("saisie"); }}
//                               title="Saisir / modifier les notes"
//                               style={{ width: 32, height: 32, borderRadius: 8, background: CI.orangeLight,
//                                 border: "none", color: CI.orange, cursor: "pointer",
//                                 display: "flex", alignItems: "center", justifyContent: "center" }}
//                             >
//                               <FileText size={15} />
//                             </motion.button>
//                             {aNotes && (
//                               <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
//                                 onClick={() => { setEleveSelectionne(eleve); setModeModal("apercu"); }}
//                                 title="Voir le bulletin"
//                                 style={{ width: 32, height: 32, borderRadius: 8,
//                                   background: "rgba(108,99,255,0.1)", border: "none",
//                                   color: "#6c63ff", cursor: "pointer",
//                                   display: "flex", alignItems: "center", justifyContent: "center" }}
//                               >
//                                 <Eye size={15} />
//                               </motion.button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>

//               {/* PAGINATION */}
//               {totalPages > 1 && (
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
//                   padding: "1rem 1.5rem", borderTop: `1px solid ${CI.border}` }}>
//                   <span style={{ fontSize: "0.8rem", color: CI.muted }}>
//                     Page {page} sur {totalPages} · {elevesFiltres.length} élèves
//                   </span>
//                   <div style={{ display: "flex", gap: "0.5rem" }}>
//                     <motion.button whileHover={{ scale: 1.05 }}
//                       onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
//                       style={{ width: 34, height: 34, borderRadius: 8,
//                         background: page === 1 ? "#f0f0f0" : CI.orangeLight,
//                         border: "none", color: page === 1 ? CI.muted : CI.orange,
//                         cursor: page === 1 ? "not-allowed" : "pointer",
//                         display: "flex", alignItems: "center", justifyContent: "center" }}
//                     >
//                       <ChevronLeft size={16} />
//                     </motion.button>
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
//                       <motion.button key={p} whileHover={{ scale: 1.05 }} onClick={() => setPage(p)}
//                         style={{ width: 34, height: 34, borderRadius: 8,
//                           background: p === page ? CI.orange : "#f0f0f0",
//                           border: "none", color: p === page ? "#fff" : CI.muted,
//                           cursor: "pointer", fontWeight: p === page ? 700 : 500,
//                           fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
//                         {p}
//                       </motion.button>
//                     ))}
//                     <motion.button whileHover={{ scale: 1.05 }}
//                       onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
//                       style={{ width: 34, height: 34, borderRadius: 8,
//                         background: page === totalPages ? "#f0f0f0" : CI.orangeLight,
//                         border: "none", color: page === totalPages ? CI.muted : CI.orange,
//                         cursor: page === totalPages ? "not-allowed" : "pointer",
//                         display: "flex", alignItems: "center", justifyContent: "center" }}
//                     >
//                       <ChevronRight size={16} />
//                     </motion.button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </motion.div>
//       </main>

//       {/* MODALS */}
//       <AnimatePresence>
//         {eleveSelectionne && modeModal === "saisie" && (
//           <ModalSaisieNotes
//             key="saisie"
//             eleve={eleveSelectionne}
//             trimestre={trimestre}
//             matieres={matieres}
//             onClose={() => { setEleveSelectionne(null); setModeModal(null); }}
//             onSave={fetchDonnees}
//           />
//         )}
//         {eleveSelectionne && modeModal === "apercu" && (
//           <ModalAperçuBulletin
//             key="apercu"
//             eleve={eleveSelectionne}
//             trimestre={trimestre}
//             matieres={matieres}
//             onClose={() => { setEleveSelectionne(null); setModeModal(null); }}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
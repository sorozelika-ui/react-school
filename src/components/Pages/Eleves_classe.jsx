import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const ElevesParClasse = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClasseId, setSelectedClasseId] = useState(""); // stocke juste l'id
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les classes au montage
  useEffect(() => {
    axios
      .get("http://localhost:8001/api/classes")
      .then((res) => {
      console.log(res.data); // <-- vérifie la structure ici
      setClasses(res.data);
    })
    .catch((err) => console.error(err));
  }, []);

  // Charger les élèves lorsque la classe change
  useEffect(() => {
    if (selectedClasseId) {
      setLoading(true);
      axios
        .get(`http://localhost:8001/api/eleves?classe_id=${selectedClasseId}`)
        .then((res) => setEleves(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setEleves([]);
    }
  }, [selectedClasseId]);

  // Trouver l'objet classe complet si besoin
  // const selectedClasse = classes.find((c) => c.id === Number(selectedClasseId));

  // Actions
  const handleVoir = (eleve) => {
    alert(`Voir le dossier de ${eleve.nom} ${eleve.prenom}`);
  };

  const handleModifier = (eleve) => {
    alert(`Modifier ${eleve.nom} ${eleve.prenom}`);
  };

  const handleSupprimer = (eleve) => {
    if (window.confirm(`Supprimer ${eleve.nom} ${eleve.prenom} ?`)) {
      axios
        .delete(`http://localhost:8001/api/eleves/${eleve.id}`)
        .then(() => {
          setEleves(eleves.filter((e) => e.id !== eleve.id));
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Liste des élèves par classe</h2>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="classe">Sélectionnez une classe:</label>
        <select
          id="classe"
          value={selectedClasseId}
          onChange={(e) => setSelectedClasseId(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          <option value="">-- Choisir une classe --</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Chargement des élèves...</p>
      ) : eleves.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ccc" }}>
              <th style={{ textAlign: "left", padding: "8px" }}>Nom</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Prénom</th>
              <th style={{ textAlign: "center", padding: "8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {eleves.map((e) => (
              <tr key={e.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px" }}>{e.nom}</td>
                <td style={{ padding: "8px" }}>{e.prenom}</td>
                <td style={{ textAlign: "center", padding: "8px" }}>
                  <FaEye
                    style={{ cursor: "pointer", marginRight: "10px", color: "blue" }}
                    onClick={() => handleVoir(e)}
                  />
                  <FaEdit
                    style={{ cursor: "pointer", marginRight: "10px", color: "orange" }}
                    onClick={() => handleModifier(e)}
                  />
                  <FaTrash
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => handleSupprimer(e)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        selectedClasseId && <p>Aucun élève trouvé pour cette classe.</p>
      )}
    </div>
  );
};

export default ElevesParClasse;
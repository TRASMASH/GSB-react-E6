import React, { useState, useEffect } from "react";
import "./FraisTable.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../services/authService";
import { useNavigate } from 'react-router-dom';

export default function FraisTable() {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [fraisList, setFraisList] = useState([]);
    const [loading, setLoading] = useState(true);


    const [filterNonNull, setFilterNonNull] = useState(false);

    useEffect(() => {
        if (!user || !token) return;
        const fetchFrais = async () => {
            try {
                const response = await axios.get(`${API_URL}frais/liste/${user.id_visiteur}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFraisList(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des frais:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFrais();
    }, [user, token]);


    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce frais ?')) return;

        try {
            await axios.delete(`${API_URL}frais/suppr`, {
                data: { id_frais: id },
                headers: { Authorization: `Bearer ${token}` }
            });
            setFraisList(fraisList.filter((frais) => frais.id_frais !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            alert("Erreur lors de la suppression du frais.");
        }
    };

    const filteredFrais = (fraisList || []).filter((f) => {

        if (filterNonNull) {
            return f.montantvalide !== null;
        }

        return true;
    });

    if (loading) return <div><b>Chargement des frais ...</b></div>;

    return (
        <div className="frais-table-container">
            <h2>Liste des Frais</h2>


            <div className="filter-container">
                <label>
                    <input
                        type="checkbox"
                        checked={filterNonNull}
                        onChange={() => setFilterNonNull(!filterNonNull)}
                    />
                    Afficher uniquement les montants validés
                </label>
            </div>


            <table className="frais-table">
                <thead>
                <tr>
                    <th>nom du praticien</th>
                    <th>Prénom du particien</th>
                    <th>ID du rapport</th>
                    <th>Date du rapport</th>
                    <th>Billan</th>
                    <th>Motif</th>
                    <th>Médicament</th>

                </tr>
                </thead>

                <tbody>
                {filteredFrais.map((rapport) => (
                    <tr key={rapport.nom_praticien}>
                        <td>{rapport.id_frais}</td>
                        <td>{rapport.id_etat}</td>
                        <td>{rapport.anneemois}</td>
                        <td>{rapport.id_visiteur}</td>
                        <td>{rapport.nbjustificatifs}</td>
                        <td>{rapport.datemodification}</td>

                        <td>
                            <button
                                onClick={() => navigate(`/frais/modifier/${frais.id_frais}`)}
                                className="edit-button"
                            >
                                Modifier
                            </button>
                            <button
                                onClick={() => handleDelete(frais.id_frais)}
                                className="delete-button"
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
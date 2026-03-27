import React, { useState, useEffect } from "react";
import "./FraisTable.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../services/authService";
import { useNavigate } from 'react-router-dom';

export default function RapportList() {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [rapportList, setRapportList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filterNonNull, setFilterNonNull] = useState(false);

    useEffect(() => {
        if (!user || !token) return;

        const fetchRapport = async () => {
            try {
                const response = await axios.get(`${API_URL}rapport/liste/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRapportList(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des rapports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRapport();
    }, [user, token]);

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) return;

        try {
            await axios.delete(`${API_URL}rapport/suppr`, {
                data: { id_rapport: id },
                headers: { Authorization: `Bearer ${token}` }
            });

            setRapportList(rapportList.filter((r) => r.id_rapport !== id));

        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            alert("Erreur lors de la suppression du rapport.");
        }
    };

    const filteredRapport = (rapportList || []).filter((r) => {
        if (filterNonNull) {
            return r.montantvalide !== null;
        }
        return true;
    });

    if (loading) return <div><b>Chargement des rapports...</b></div>;

    return (
        <div className="frais-table-container">
            <h2>Liste des Rapports</h2>

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
                    <th>Nom du praticien</th>
                    <th>Prénom du praticien</th>
                    <th>ID du rapport</th>
                    <th>Date du rapport</th>
                    <th>Bilan</th>
                    <th>Motif</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {filteredRapport.map((rapport) => (
                    <tr key={rapport.id_rapport}>
                        <td>{rapport.nom_praticien}</td>
                        <td>{rapport.prenom_praticien}</td>
                        <td>{rapport.id_rapport}</td>
                        <td>{rapport.date_rapport}</td>
                        <td>{rapport.bilan}</td>
                        <td>{rapport.motif}</td>

                        <td>
                            <button
                                onClick={() => navigate(`/rapport/${rapport.id_rapport}/medicaments`)}
                                className="edit-button"
                            >
                                Médicaments
                            </button>

                            <button
                                onClick={() => handleDelete(rapport.id_rapport)}
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

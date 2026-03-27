import React, { useState, useEffect } from "react";
import "./FraisTable.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../services/authService";
import { useNavigate } from 'react-router-dom';

export default function RapportList() {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [RapportList, setRapportList] = useState([]);
    const [loading, setLoading] = useState(true);


    const [filterNonNull, setFilterNonNull] = useState(false);

    useEffect(() => {
        if (!user || !token) return;
        const fetchRapport = async () => {
            try {
                const response = await axios.get(`${API_URL}rapport/liste/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFraisList(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des frais:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRapport();
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
        <div className="rapport-table-container">
            <h2>Liste des Rapport</h2>


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


            <table className="rapport-table">
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
                {filteredRapport.map((rapport) => (
                    <tr>
                        <td>{rapport.nom_praticien}</td>
                        <td>{rapport.prenom_praticien}</td>
                        <td>{rapport.id_rapport}</td>
                        <td>{rapport.date_rapport}</td>
                        <td>{rapport.bilan}</td>
                        <td>{rapport.motif}</td>

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
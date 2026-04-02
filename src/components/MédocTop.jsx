import React, { useState, useEffect } from "react";
import "./FraisTable.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../services/authService";

export default function MédocTop() {
    const { token } = useAuth();
    const [medicaments, setMedicaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) return;

        const fetchMedicaments = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}medicament/liste`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMedicaments(response.data);
            } catch (err) {
                console.error("Erreur lors de la récupération des médicaments:", err);
                setError('Erreur lors du chargement des médicaments');
            } finally {
                setLoading(false);
            }
        };

        fetchMedicaments();
    }, [token]);

    if (loading) {
        return <div><b>Chargement des médicaments...</b></div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="frais-table-container">
            <h1>Le top des médicaments les plus offerts</h1>

            <table className="frais-table table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Classement</th>
                    <th>Médicament</th>
                    <th>Total offert</th>
                </tr>
                </thead>

                <tbody>
                {medicaments && medicaments.length > 0 ? (
                    medicaments.map((med, index) => (
                        <tr key={med.id_medicament}>
                            <td>{index + 1}</td>
                            <td>{med.nom_commercial}</td>
                            <td>{med.total_offert}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="text-center">
                            Aucun médicament disponible
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../services/authService';
import './FraisTable.css';

const MedicamentsOfferts = () => {
    const { id_rapport } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [rapport, setRapport] = useState(null);
    const [offerts, setOfferts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token || !id_rapport) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}rapport/${id_rapport}/medicaments`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRapport(response.data.rapport);
                setOfferts(response.data.offerts);
            } catch (err) {
                console.error('Erreur:', err);
                setError('Erreur lors du chargement des médicaments');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, id_rapport]);

    const handleDelete = async (id_medicament) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce médicament ?')) return;

        try {
            await axios.delete(`${API_URL}rapport/supprimer-offert`, {
                data: { id_rapport: id_rapport, id_medicament: id_medicament },
                headers: { Authorization: `Bearer ${token}` }
            });

            setOfferts(offerts.filter(o => o.id_medicament !== id_medicament));
            alert('Médicament supprimé avec succès');
        } catch (err) {
            console.error('Erreur suppression:', err);
            alert('Erreur lors de la suppression');
        }
    };

    if (loading) return <div><b>Chargement des médicaments...</b></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="frais-table-container">
            <h1>Médicaments offerts pour le rapport n°{rapport?.id_rapport}</h1>

            <table className="frais-table table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Médicament</th>
                    <th>Quantité offerte</th>
                    <th>Modifier</th>
                    <th>Supprimer</th>
                </tr>
                </thead>

                <tbody>
                {offerts && offerts.length > 0 ? (
                    offerts.map((o) => (
                        <tr key={o.id_medicament}>
                            <td>{o.nom_commercial}</td>
                            <td>{o.qte_offerte}</td>

                            <td>
                                <button
                                    className="btn btn-warning"
                                    onClick={() => navigate(`/rapport/${id_rapport}/modifier-offert/${o.id_medicament}`)}
                                >
                                    Modifier
                                </button>
                            </td>

                            <td>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(o.id_medicament)}
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="text-center">
                            Aucun médicament offert
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            <button
                className="btn btn-success mb-3"
                onClick={() => navigate(`/rapport/${id_rapport}/ajouter-offert`)}
            >
                Ajouter un médicament
            </button>
        </div>
    );
};

export default MedicamentsOfferts;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../services/authService';

const ModifierOffert = () => {
    const { id_rapport, id_medicament } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [offert, setOffert] = useState(null);
    const [medicament, setMedicament] = useState(null);
    const [qte_offerte, setQteOfferte] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!token || !id_rapport || !id_medicament) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Récupérer les détails de l'offert
                const response = await axios.get(`${API_URL}rapport/${id_rapport}/medicaments`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const offertData = response.data.offerts.find(o => o.id_medicament == id_medicament);
                if (offertData) {
                    setOffert(offertData);
                    setQteOfferte(offertData.qte_offerte);
                }

                // Récupérer les détails du médicament
                const medResponse = await axios.get(`${API_URL}medicaments`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const medData = medResponse.data.find(m => m.id_medicament == id_medicament);
                setMedicament(medData);

            } catch (err) {
                console.error('Erreur:', err);
                setError('Erreur lors du chargement des données');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, id_rapport, id_medicament]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            const response = await axios.post(`${API_URL}rapport/modifier-offert`, {
                id_rapport: id_rapport,
                id_medicament: id_medicament,
                qte_offerte: qte_offerte
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                alert('Quantité modifiée avec succès');
                navigate(`/rapport/${id_rapport}/medicaments`);
            }
        } catch (err) {
            console.error('Erreur:', err);
            setError('Erreur lors de la modification');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div><b>Chargement...</b></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <h1>Modifier médicament offert</h1>

            <form onSubmit={handleSubmit} className="card card-body bg-light">
                <div className="mb-3">
                    <label>Médicament :</label>
                    <input
                        type="text"
                        className="form-control"
                        value={medicament?.nom_commercial || ''}
                        disabled
                    />
                </div>

                <div className="mb-3">
                    <label>Quantité offerte :</label>
                    <input
                        type="number"
                        className="form-control"
                        value={qte_offerte}
                        onChange={(e) => setQteOfferte(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                >
                    {submitting ? 'Modification...' : 'Valider'}
                </button>
            </form>
        </div>
    );
};

export default ModifierOffert;
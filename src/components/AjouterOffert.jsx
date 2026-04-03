import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../services/authService';

const AjouterOffert = () => {
    const { id_rapport } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [medicaments, setMedicaments] = useState([]);
    const [formData, setFormData] = useState({
        id_medicament: '',
        qte_offerte: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!token) return;

        const fetchMedicaments = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}medicaments`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMedicaments(response.data);
            } catch (err) {
                console.error('Erreur:', err);
                setError('Erreur lors du chargement des médicaments');
            } finally {
                setLoading(false);
            }
        };

        fetchMedicaments();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.id_medicament || !formData.qte_offerte) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        try {
            setSubmitting(true);
            const response = await axios.post(`${API_URL}rapport/ajouter-offert`, {
                id_rapport: id_rapport,
                id_medicament: formData.id_medicament,
                qte_offerte: formData.qte_offerte
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                alert('Médicament ajouté avec succès');
                navigate(`/rapport/${id_rapport}/medicaments`);
            }
        } catch (err) {
            console.error('Erreur:', err);
            setError('Erreur lors de l\'ajout');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div><b>Chargement...</b></div>;

    return (
        <div className="container mt-4">
            <h1>Ajouter un médicament offert</h1>

            <form onSubmit={handleSubmit} className="card card-body bg-light">
                <div className="mb-3">
                    <label>Médicament :</label>
                    <select
                        name="id_medicament"
                        className="form-control"
                        value={formData.id_medicament}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Choisissez un médicament --</option>
                        {medicaments.map((med) => (
                            <option key={med.id_medicament} value={med.id_medicament}>
                                {med.nom_commercial}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label>Quantité offerte :</label>
                    <input
                        type="number"
                        name="qte_offerte"
                        className="form-control"
                        value={formData.qte_offerte}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                >
                    {submitting ? 'Ajout...' : 'Valider'}
                </button>
            </form>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
    );
};

export default AjouterOffert;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../services/authService';
import '../styles/RapportForm.css';

const RapportForm = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        date_rapport: '',
        motif: '',
        bilan: '',
        id_praticien: ''
    });

    const [praticiens, setPraticiens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadInitData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}rapport/ajout`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setPraticiens(response.data.praticiens || []);

                const today = new Date().toISOString().split('T')[0];
                setFormData(prev => ({
                    ...prev,
                    date_rapport: today
                }));
            } catch (err) {
                setError('Erreur lors du chargement des données.');
                console.error('Erreur chargement:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            loadInitData();
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.date_rapport || !formData.motif || !formData.bilan || !formData.id_praticien) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        try {
            setSubmitting(true);
            const dataToSend = {
                date_rapport: formData.date_rapport,
                motif: formData.motif,
                bilan: formData.bilan,
                id_praticien: parseInt(formData.id_praticien)
            };

            console.log('Données envoyées:', dataToSend);

            const response = await axios.post(`${API_URL}rapport/ajout`, dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Réponse du serveur:', response.data);

            if (response.data.success) {
                alert('Rapport ajouté avec succès !');
                navigate('/rapports');
            }
        } catch (err) {
            console.error('Erreur complète:', err);
            console.error('Réponse serveur:', err.response?.data);
            console.error('Statut:', err.response?.status);
            
            setError(err.response?.data?.error || err.response?.data?.message || 'Erreur lors de l\'ajout du rapport.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="loading">Chargement des données...</div>;
    }

    return (
        <div className="rapport-form-container">
            <h1>Ajouter un rapport de visite</h1>

            <form onSubmit={handleSubmit} className="rapport-form card card-body bg-light">

                <div className="form-group row mb-3">
                    <label htmlFor="date_rapport" className="col-md-3 col-form-label">
                        Date de la visite
                    </label>
                    <div className="col-md-6">
                        <input
                            type="date"
                            id="date_rapport"
                            name="date_rapport"
                            className="form-control"
                            value={formData.date_rapport}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group row mb-3">
                    <label htmlFor="motif" className="col-md-3 col-form-label">
                        Motif de la visite
                    </label>
                    <div className="col-md-6">
                        <input
                            type="text"
                            id="motif"
                            name="motif"
                            className="form-control"
                            placeholder="Ex: Présentation nouveauté..."
                            value={formData.motif}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group row mb-3">
                    <label htmlFor="bilan" className="col-md-3 col-form-label">
                        Bilan de la visite
                    </label>
                    <div className="col-md-6">
                        <textarea
                            id="bilan"
                            name="bilan"
                            className="form-control"
                            rows="4"
                            placeholder="Résumé de l'entrevue..."
                            value={formData.bilan}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                </div>

                <div className="form-group row mb-3">
                    <label htmlFor="id_praticien" className="col-md-3 col-form-label">
                        Praticien
                    </label>
                    <div className="col-md-6">
                        <select
                            id="id_praticien"
                            name="id_praticien"
                            className="form-control"
                            value={formData.id_praticien}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Choisissez un praticien --</option>
                            {praticiens && praticiens.length > 0 ? (
                                praticiens.map((praticien) => (
                                    <option key={praticien.id_praticien} value={praticien.id_praticien}>
                                        {praticien.nom_praticien} {praticien.prenom_praticien}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Aucun praticien disponible</option>
                            )}
                        </select>
                    </div>
                </div>

                <hr />

                <div className="form-group row">
                    <div className="col-md-12 offset-md-3">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Valider...' : 'Valider'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/rapports')}
                        >
                            Annuler
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                        <strong>Erreur :</strong> {error}
                    </div>
                )}
            </form>
        </div>
    );
};

export default RapportForm;
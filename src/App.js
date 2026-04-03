import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import FraisAdd from './pages/FraisAdd';
import FraisEdit from './components/FraisEdit'; 
import FraisHorsForfait from './pages/FraisHorsForfait';
import FraisHorsForfaitAdd from './pages/FraisHorsForfaitAdd';
import FraisHorsForfaitEdit from './pages/FraisHorsForfaitEdit';
import RapportAdd from  './pages/RapportAdd';
import TopMédoc from './pages/TopMédoc'
import ListeRapport from './pages/ListeRapport';
import MedicamentOfferts from './components/MedicamentOfferts';
import ModifierOffert from './components/ModifierOffert';
import AjouterOffert from './components/AjouterOffert';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          
          <Route 
            path="/frais/ajouter" 
            element={<PrivateRoute><FraisAdd /></PrivateRoute>} 
          />
          <Route 
            path="/frais/modifier/:id" 
            element={<PrivateRoute><FraisEdit /></PrivateRoute>} 
          />
          <Route 
            path="/frais/:id/hors-forfait" 
            element={<PrivateRoute><FraisHorsForfait /></PrivateRoute>} 
          />
          <Route 
            path="/frais/:id/hors-forfait/ajouter" 
            element={<PrivateRoute><FraisHorsForfaitAdd /></PrivateRoute>} 
          />
          <Route 
            path="/frais/:id/hors-forfait/modifier/:idHF" 
            element={<PrivateRoute><FraisHorsForfaitEdit /></PrivateRoute>} 
          />

          <Route
            path="/dashboard"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />
            <Route
            path="/listeRapport"
            element={<PrivateRoute><ListeRapport/></PrivateRoute>}
            />
            <Route
                path="/RapportAdd"
                element={<PrivateRoute><RapportAdd/></PrivateRoute>}
            />
            <Route
                path="/TopMédoc"
                element={<PrivateRoute><TopMédoc/></PrivateRoute>}
            />

            {/* Nouvelles routes pour les médicaments offerts */}
            <Route
  path="/rapport/:id_rapport/medicaments"
  element={<PrivateRoute><MedicamentOfferts /></PrivateRoute>}
/>
            <Route
                path="/rapport/:id_rapport/modifier-offert/:id_medicament"
                element={<PrivateRoute><ModifierOffert /></PrivateRoute>}
            />
            <Route
                path="/rapport/:id_rapport/ajouter-offert"
                element={<PrivateRoute><AjouterOffert /></PrivateRoute>}
            />
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "../styles/Navbar.css";

function Navbar() {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-links" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>

        
        <div>
          <Link to="/" className="navbar-link">Accueil</Link>

          
          {user && (
            <Link to="/dashboard" className="navbar-link">Tableau de bord</Link>
          )}
          {user && (
            <Link to="/frais/ajouter" className="navbar-link">Ajouter Frais</Link>
          )}
            {user && (
                <Link to="/listeRapport" className="navbar-link">ListeRapport</Link>
            )}
            {user && (
                <Link to="/RapportAdd" className="navbar-link">Ajouter un Rapport</Link>
            )}
            {user && (
                <Link to="/TopMédoc" className="navbar-link">Le top des Médicament</Link>
            )}
        </div>

        
        <div>
         
          {user ? (
            <button onClick={logoutUser} className="navbar-link logout-btn">
              Déconnexion
            </button>
          ) : (
           
            <Link to="/login" className="navbar-link">Connexion</Link>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;

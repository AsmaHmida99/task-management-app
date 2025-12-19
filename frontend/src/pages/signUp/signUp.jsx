import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '../../components/header/header';
import './signUp.css';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign up data:', formData);
  };

  return (
    <div className="signup-container">
      <div className="signup-background"></div>

      <div className="signup-background-effects">
        <div className="signup-blur-circle signup-blur-top"></div>
        <div className="signup-blur-circle signup-blur-bottom"></div>
      </div>

      <Header />

      {/* CONTENU CENTRÉ */}
      <div className="signup-content">
        <div className="signup-form-wrapper">
          <div className="signup-card">
            <div className="signup-card-content">

              <div className="signup-header">
                <h1 className="signup-title">Créer un compte</h1>
                <p className="signup-subtitle">
                  Entrez vos informations pour créer votre compte
                </p>
              </div>

              <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Nom complet</label>
                  <div className="input-wrapper">
                    <input
                      id="name"
                      type="text"
                      placeholder="Jean Dupont"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="input-wrapper">
                    <input
                      id="email"
                      type="email"
                      placeholder="vous@exemple.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">Mot de passe</label>
                  <div className="input-wrapper">
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmer le mot de passe
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="submit-button">
                  Créer mon compte
                  <ArrowRight className="button-icon" />
                </button>
              </form>

              <div className="signup-footer">
                <span className="footer-text">Vous avez déjà un compte ? </span>
                <Link to="/signin" className="footer-link">
                  Se connecter
                </Link>
              </div>
            </div>
          </div>

          <p className="signup-terms">
            En créant un compte, vous acceptez nos{' '}
            <Link to="/terms" className="terms-link">Conditions d'utilisation</Link>{' '}
            et notre{' '}
            <Link to="/privacy" className="terms-link">Politique de confidentialité</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

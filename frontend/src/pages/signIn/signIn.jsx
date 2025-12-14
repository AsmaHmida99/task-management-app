import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Header from '../../components/header/header';
import './signIn.css';

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign in data:', formData);
  };

  return (
    <div className="signin-container">
      <div className="signin-background"></div>
      <div className="signin-background-effects">
        <div className="signin-blur-circle signin-blur-top"></div>
        <div className="signin-blur-circle signin-blur-bottom"></div>
      </div>

      <Header />

      <div className="signin-content">
        <div className="signin-form-wrapper">
          <div className="signin-card">
            <div className="signin-card-content">
              <div className="signin-header">
                <h1 className="signin-title">Connexion</h1>
                <p className="signin-subtitle">Entrez vos informations pour vous connecter</p>
              </div>

              <form onSubmit={handleSubmit} className="signin-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input
                      id="email"
                      type="email"
                      placeholder="vous@exemple.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-label-row">
                    <label htmlFor="password" className="form-label">
                      Mot de passe
                    </label>
                    <Link to="/forgot-password" className="forgot-link">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="submit-button">
                  Se connecter
                  <ArrowRight className="button-icon" />
                </button>
              </form>

              <div className="signin-footer">
                <span className="footer-text">Vous n'avez pas de compte ? </span>
                <Link to="/signup" className="footer-link">
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
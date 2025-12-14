import { Link } from 'react-router-dom';
import { CheckCircle2, Target, BarChart3, ArrowRight } from 'lucide-react';
import Header from '../../components/header/header';
import dashboardImg from '../../assets/homeImage.png';
import './home.css';

export default function HomePage() {
  return (
    <div className="home-container">
      <div className="home-background"></div>
      <div className="home-background-effects">
        <div className="home-blur-circle home-blur-top"></div>
        <div className="home-blur-circle home-blur-bottom"></div>
      </div>

      <Header showSignUp={true} />

      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-text">
            <h1 className="home-title">
              Transformez votre{' '}
              <span className="home-title-gradient">gestion de projet</span>
            </h1>

            <p className="home-description">
              Organisez, suivez et terminez vos projets efficacement. Une plateforme complète pour gérer vos tâches et
              suivre la progression.
            </p>

            <div className="home-stats">
              <div className="home-stat">
                <div className="home-stat-header">
                  <Target className="icon-sm stat-icon" />
                  <span className="home-stat-value">98%</span>
                </div>
                <span className="home-stat-label">Projets livrés</span>
              </div>
              <div className="home-stat">
                <div className="home-stat-header">
                  <CheckCircle2 className="icon-sm stat-icon" />
                  <span className="home-stat-value">2.5k+</span>
                </div>
                <span className="home-stat-label">Tâches gérées</span>
              </div>
            </div>

            <div className="home-cta">
              <Link to="/signin" className="cta-button">
                Commencer
                <ArrowRight className="icon-sm" />
              </Link>
            </div>
          </div>

          <div className="home-hero-image">
            <div className="home-image-wrapper">
              <img src={dashboardImg} alt="Gestion de projet 3D" className="home-dashboard-img" />
            </div>

            <div className="home-card home-card-left">
              <div className="home-card-content">
                <div className="home-card-icon card-icon-purple">
                  <CheckCircle2 className="icon" />
                </div>
                <div>
                  <p className="home-card-title">24 tâches terminées</p>
                </div>
              </div>
            </div>

            <div className="home-card home-card-right">
              <div className="home-card-content">
                <div className="home-card-icon card-icon-blue">
                  <BarChart3 className="icon" />
                </div>
                <div>
                  <p className="home-card-title">85% de progression</p>
                  <p className="home-card-subtitle">Projet actuel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
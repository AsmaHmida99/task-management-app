import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/home/home.jsx';
import SignInPage from './pages/signIn/signIn.jsx';
import SignUpPage from './pages/signUp/signUp.jsx';
import ProjectPage from './pages/project/project.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

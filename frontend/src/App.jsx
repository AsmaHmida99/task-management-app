import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/home/home.jsx';
import SignInPage from './pages/signIn/signIn.jsx';
import SignUpPage from './pages/signUp/signUp.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

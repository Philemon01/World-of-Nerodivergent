import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import UserDashboard from './pages/UserDashboard';
import AdminPage from './pages/AdminPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-rainbow-blue/20 selection:text-brand-dark">
      <Navigation />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

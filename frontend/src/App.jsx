import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Scan from './pages/Scan.jsx';
import History from './pages/History.jsx';
import Admin from './pages/Admin.jsx';
import AppShell from './components/AppShell.jsx';

const isAuthed = () => Boolean(localStorage.getItem('cybershield.access'));

function Protected({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/app"
          element={
            <Protected>
              <AppShell />
            </Protected>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="scan" element={<Scan />} />
          <Route path="history" element={<History />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

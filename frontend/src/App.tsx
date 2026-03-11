import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useAuthStore } from './store/useAuthStore';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { CreateEvent } from './pages/CreateEvent';
import { EventDetails } from './pages/EventDetails';
import { EditEvent } from './pages/EditEvent';
import { MyEvents } from './pages/MyEvents';

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="events/create" element={isAuthenticated ? <CreateEvent /> : <Navigate to="/login" />} />
          <Route path="events/:id/edit" element={isAuthenticated ? <EditEvent /> : <Navigate to="/login" />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="my-events" element={isAuthenticated ? <MyEvents /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, Calendar, Plus, User, LayoutList } from 'lucide-react';
import { AiAssistant } from './ui/AiAssistant';

export const Layout = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          EventHub
        </Link>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                <LayoutList className="w-4 h-4" /> Events
              </Link>
              <Link to="/my-events" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                <Calendar className="w-4 h-4" /> My Events
              </Link>
              <Link to="/events/create" className="flex items-center gap-1.5 text-sm font-medium bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors">
                <Plus className="w-4 h-4" /> Create Event
              </Link>
              <div className="h-8 w-px bg-gray-200 mx-2"></div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
                <button onClick={handleLogout} className="text-gray-400 hover:text-gray-700 transition-colors flex items-center" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Login</Link>
              <Link to="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      {isAuthenticated && <AiAssistant />}
    </div>
  );
};
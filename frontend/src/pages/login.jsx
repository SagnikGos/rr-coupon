import { useState, useEffect } from "react";
import { loginAdmin } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, ShieldCheck, ArrowLeft } from "lucide-react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Check user's preferred color scheme on initial load
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin(username, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header with Back Button and Theme Toggle */}
      <header className={`fixed w-full top-0 z-10 px-6 py-4 flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <div className="flex items-center space-x-2">
          <ShieldCheck className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h1 className="text-xl font-bold">Coupon Portal</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => navigate("/")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-screen pt-16">
        <div className={`w-full max-w-md p-8 rounded-xl shadow-lg transition-all ${
          darkMode ? 'bg-gray-800 shadow-gray-900/30' : 'bg-white shadow-gray-200'
        }`}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Admin Login</h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Access your administration dashboard
            </p>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-lg ${
              darkMode ? 'bg-red-900/20 border border-red-700 text-red-400' : 'bg-red-50 border border-red-100 text-red-600'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                className={`w-full p-3 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-white' 
                    : 'bg-gray-50 border border-gray-300 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className={`w-full p-3 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-white' 
                    : 'bg-gray-50 border border-gray-300 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className={`w-full py-3 px-6 mt-6 rounded-lg font-medium transition-all ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Sign In
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-4 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        © {new Date().getFullYear()} Coupon Portal • All rights reserved
      </footer>
    </div>
  );
}

export default Login;
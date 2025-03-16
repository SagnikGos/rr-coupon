import { useState, useEffect } from "react";
import { claimCoupon } from "../utils/api.jsx";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, ShieldCheck } from "lucide-react";

function User() {
  const [message, setMessage] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const handleClaim = async () => {
    setLoading(true);
    setMessage(null);
    setCoupon(null);

    try {
      const data = await claimCoupon();
      setMessage(data.message);
      setCoupon(data.coupon);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header with Admin Login and Theme Toggle */}
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
            onClick={() => navigate("/login")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            <ShieldCheck size={18} />
            <span>Admin</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-screen pt-16">
        <div className={`w-full max-w-md p-8 rounded-xl shadow-lg transition-all ${
          darkMode ? 'bg-gray-800 shadow-gray-900/30' : 'bg-white shadow-gray-200'
        }`}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Claim Your Coupon</h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Get instant access to exclusive discounts
            </p>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={handleClaim}
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300'
              } disabled:cursor-not-allowed`}
            >
              {loading ? "Processing..." : "Claim Your Coupon"}
            </button>

            {message && (
              <div className={`mt-8 p-4 rounded-lg w-full ${
                coupon 
                  ? (darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-100') 
                  : (darkMode ? 'bg-red-900/20 border border-red-700' : 'bg-red-50 border border-red-100')
              }`}>
                <p className={`text-center ${
                  coupon 
                    ? (darkMode ? 'text-green-400' : 'text-green-700') 
                    : (darkMode ? 'text-red-400' : 'text-red-700')
                }`}>
                  {message}
                </p>
                {coupon && (
                  <div className={`mt-4 p-3 rounded font-mono text-center text-lg font-bold ${
                    darkMode ? 'bg-gray-700 text-blue-300' : 'bg-gray-100 text-blue-700'
                  }`}>
                    {coupon}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-4 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        © {new Date().getFullYear()} Coupon Portal • All rights reserved
      </footer>
    </div>
  );
}

export default User;
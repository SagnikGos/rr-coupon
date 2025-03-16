import { useEffect, useState } from "react";
import { getCoupons, addCoupon, deleteCoupon } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, ShieldCheck, Plus, Trash, RefreshCw } from "lucide-react";

function Dashboard() {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCoupons();
      // Filter only unclaimed coupons (status === "pending")
      const unclaimedCoupons = data.filter((coupon) => coupon.status === "pending");
      setCoupons(unclaimedCoupons);
    } catch (error) {
      setError("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async () => {
    if (!newCoupon.trim()) return;
    try {
      setError(null);
      await addCoupon(newCoupon);
      setNewCoupon("");
      fetchCoupons();
    } catch (error) {
      setError("Error adding coupon");
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      setError(null);
      await deleteCoupon(id);
      fetchCoupons();
    } catch (error) {
      setError("Error deleting coupon");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`fixed w-full top-0 z-10 px-6 py-4 flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <div className="flex items-center space-x-2">
          <ShieldCheck className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
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
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
        <div className={`p-6 rounded-xl shadow-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Manage Coupons</h2>
            <button 
              onClick={fetchCoupons}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              aria-label="Refresh coupons"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-lg ${
              darkMode ? 'bg-red-900/20 border border-red-700 text-red-400' : 'bg-red-50 border border-red-100 text-red-600'
            }`}>
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-grow">
              <label htmlFor="couponCode" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                New Coupon Code
              </label>
              <input
                id="couponCode"
                type="text"
                placeholder="Enter coupon code"
                className={`w-full p-3 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-white' 
                    : 'bg-gray-50 border border-gray-300 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                value={newCoupon}
                onChange={(e) => setNewCoupon(e.target.value)}
              />
            </div>
            <div className="self-end">
              <button
                onClick={handleAddCoupon}
                disabled={!newCoupon.trim()}
                className={`flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-all h-12 ${
                  darkMode 
                    ? 'bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500' 
                    : 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-200 disabled:text-gray-400'
                } disabled:cursor-not-allowed`}
              >
                <Plus size={18} />
                <span>Add Coupon</span>
              </button>
            </div>
          </div>

          <div className={`rounded-lg overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`grid grid-cols-2 ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} font-medium`}>
              <div className="p-4">Coupon Code</div>
              <div className="p-4 text-center">Actions</div>
            </div>
            
            {loading ? (
              <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Loading coupons...
              </div>
            ) : coupons.length > 0 ? (
              coupons.map((coupon, index) => (
                <div 
                  key={coupon._id} 
                  className={`grid grid-cols-2 items-center ${
                    index !== coupons.length - 1 ? (darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200') : ''
                  } ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}
                >
                  <div className={`p-4 font-mono ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    {coupon.code}
                  </div>
                  <div className="p-4 flex justify-center">
                    <button
                      onClick={() => handleDeleteCoupon(coupon._id)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded ${
                        darkMode 
                          ? 'bg-red-900/40 hover:bg-red-900/60 text-red-300' 
                          : 'bg-red-100 hover:bg-red-200 text-red-600'
                      }`}
                      title="Delete this coupon"
                    >
                      <Trash size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No unclaimed coupons available
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`fixed bottom-0 w-full py-4 text-center text-sm ${
        darkMode ? 'bg-gray-800 text-gray-500 border-t border-gray-700' : 'bg-white text-gray-400 border-t border-gray-200'
      }`}>
        © {new Date().getFullYear()} Coupon Portal • All rights reserved
      </footer>
    </div>
  );
}

export default Dashboard;
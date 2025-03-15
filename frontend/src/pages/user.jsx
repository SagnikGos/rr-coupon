import { useState } from "react";
import { claimCoupon } from "../utils/api.jsx"; // Import the API function

function User() {
  const [message, setMessage] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-2xl font-semibold mb-4">Claim Your Coupon</h1>
        <button
          onClick={handleClaim}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Claiming..." : "Claim Coupon"}
        </button>

        {message && (
          <p className="mt-4 text-lg text-gray-700">
            {message} {coupon && <span className="font-bold">{coupon}</span>}
          </p>
        )}
      </div>
    </div>
  );
}

export default User;

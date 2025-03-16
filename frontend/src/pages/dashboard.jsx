import { useEffect, useState } from "react";
import { getCoupons, addCoupon, deleteCoupon } from "../utils/api";
import * as Tooltip from "@radix-ui/react-tooltip";

function Dashboard() {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setError(null);
      const data = await getCoupons();
      // ✅ Filter only unclaimed coupons (status === "pending")
      const unclaimedCoupons = data.filter((coupon) => coupon.status === "pending");
      setCoupons(unclaimedCoupons);
    } catch (error) {
      setError("Failed to fetch coupons");
    }
  };

  const handleAddCoupon = async () => {
    if (!newCoupon.trim()) return;
    try {
      await addCoupon(newCoupon);
      setNewCoupon("");
      fetchCoupons();
    } catch (error) {
      setError("Error adding coupon");
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await deleteCoupon(id);
      fetchCoupons();
    } catch (error) {
      setError("Error deleting coupon");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Coupon Code"
          className="border p-2 rounded"
          value={newCoupon}
          onChange={(e) => setNewCoupon(e.target.value)}
        />
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={handleAddCoupon}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add Coupon
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p className="p-2 bg-gray-800 text-white text-sm rounded-md">
                Click to add a new coupon
              </p>
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>

      <table className="mt-6 w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Coupon Code</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <tr key={coupon._id} className="border">
                <td className="border p-2">{coupon.code}</td>
                <td className="border p-2">
                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          onClick={() => handleDeleteCoupon(coupon._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content>
                        <p className="p-2 bg-gray-800 text-white text-sm rounded-md">
                          Click to delete this coupon
                        </p>
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center p-4">
                No unclaimed coupons available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;

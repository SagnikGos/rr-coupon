const API_URL = "http://localhost:5000"; // Change this to your deployed backend URL

export const claimCoupon = async () => {
  try {
    const response = await fetch(`${API_URL}/claim-coupon`, {
      method: "POST",
      credentials: "include", // Required for session tracking (cookies)
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to claim coupon");

    return data; // { message: "Coupon claimed!", coupon: "DISCOUNT10" }
  } catch (error) {
    throw new Error(error.message || "Server error. Try again later.");
  }
};



export const loginAdmin = async (username, password) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  localStorage.setItem("token", data.token);
  return data;
};

export const getCoupons = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/admin/coupons`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to fetch coupons");
  return response.json();
};

export const addCoupon = async (code) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/admin/coupons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) throw new Error("Failed to add coupon");
  return response.json();
};

export const deleteCoupon = async (id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5000/admin/coupons/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to delete coupon");
};


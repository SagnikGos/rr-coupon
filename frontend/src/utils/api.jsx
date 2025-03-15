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

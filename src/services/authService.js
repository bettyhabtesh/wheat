// services/authService.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

// Set default Authorization header
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login/`, {
      email,
      password,
    });

    return {
      access: response.data.access_token,
      refresh: response.data.refresh_token,
    };
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

// Add try-catch to fetchUsers
export const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token"); // 👈 get token from localStorage
    const response = await axios.get(`${BASE_URL}/users/`, {
      headers: {
        Authorization: `Bearer ${token}`, // 👈 include token here
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchUserStats = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/user-stats/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user stats:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchAverageRating = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/feedback/average-rating/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch average rating:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch pending expert review requests
export const fetchApprovalRequests = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/review/requests/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching approval requests:", error.response?.data || error.message);
    throw error;
  }
};

// Approve expert
export const approveExpertRequest = async (id) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(`${BASE_URL}/verify/approve/${id}/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error approving expert:", error.response?.data || error.message);
    throw error;
  }
};

// Reject expert
export const rejectExpertRequest = async (id) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(`${BASE_URL}/verify/reject/${id}/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error rejecting expert:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchFeedbackList = async (filters = {}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/feedback/list/`, {
      headers: { Authorization: `Bearer ${token}` },
      params: filters,
    });
    return response.data;
  } 
  catch (error) {
    console.error("Failed to fetch feedback:", error.response?.data || error.message);
    throw error;
  }
};
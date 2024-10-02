import axios from "axios";

const API_URL = "https://tubitak-proje.dev.reisetech.io/api/qre/api";

export const register = (username, email, password) => {
  return axios.post(API_URL + "/Auth/register", {
    username,
    email,
    password,
  });
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(API_URL + "/Auth/login", {
      email,
      password,
    });

    if (response.data && response.data.token) {
      localStorage.setItem("token", response.data.token);
      console.log("Login successful, token:", response.data.token);
    }

    return response;
  } catch (error) {
    console.error(
      "Login error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const rateExperience = (userId, hotelId, experienceId, rating) => {
  return axios.post(API_URL + "/UserRating/rate", {
    userId,
    hotelId,
    experienceId,
    rating,
  });
};

export const getHotels = () => {
  return axios.get(API_URL + "/Hotel/hotels");
};

export const getExperiences = () => {
  return axios.get(API_URL + "/Experience");
};

export const submitRating = async (userRating) => {
  const userId = localStorage.getItem("user_id");
  const payload = {
    ...userRating,
    userId,
  };

  console.log("Payload before sending:", payload);

  try {
    const experienceResponse = await getExperiences();
    const validExperienceIds = experienceResponse.data.map(
      (exp) => exp.experienceId
    );

    if (!validExperienceIds.includes(userRating.experienceId)) {
      throw new Error(`Invalid experience ID: ${userRating.experienceId}`);
    }

    const response = await axios.post(API_URL + "/UserRating/rate", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error submitting rating:", error.response?.data);
    throw error;
  }
};

export const getUserId = async (email) => {
  try {
    const response = await axios.post(API_URL + "/Auth/getUserId", {
      email,
    });

    if (response.data && response.data.userId) {
      localStorage.setItem("user_id", response.data.userId);
      console.log("User ID retrieved:", response.data.userId);
    }

    return response.data.userId;
  } catch (error) {
    console.error(
      "Error occurred while retrieving user ID:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getUserRatings = (userId) => {
  return axios.get(`${API_URL}/UserRating/ratings`, {
    params: { userId },
  });
};

const BASE_URL = (process.env.REACT_APP_BASE_URL) || "http://localhost:4000/api/v1"

// CATAGORIES API
export const categories = {
    CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  }

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/resetpasswordtoken",
  RESETPASSWORD_API: BASE_URL + "/auth/resetpassword",
}
const isDevelopment = process.env.NODE_ENV === "development";

export const config = {
    apiURL: isDevelopment ? "http://localhost:4000/api" : "https://asset-manager-backend-x0g4.onrender.com/api",
    nodeENV: process.env.NODE_ENV || "development",
}
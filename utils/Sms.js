const axios = require('axios');
require("dotenv").config()

// Define a function that takes in the necessary parameters
async function sendSMS( to, message) {
  try {
    // Construct the API URL

const apiUrl = `${process.env.smsUrl}?user=${process.env.smsusername}&pass=${process.env.smspassword}&to=${to}&from=${process.env.smsFrom}&msg=${message}`;

    // Make the API call and return the response
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    // Handle errors here
    console.error(error);
    throw error;
  }
}

module.exports = sendSMS
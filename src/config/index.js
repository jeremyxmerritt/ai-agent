require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY
  }
};

module.exports = config;
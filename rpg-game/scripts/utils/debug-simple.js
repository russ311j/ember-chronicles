console.log('Testing Magic Hour API key'); console.log('Key exists:', !!process.env.MAGIC_HOUR_API_KEY); require('dotenv').config(); console.log('After dotenv:', !!process.env.MAGIC_HOUR_API_KEY);

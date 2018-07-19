module.exports = {
  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://test.com/Test',
  },
  token: {
    secret: process.env.TOKEN_SECRET || 'supersecretcode',
    lifetime: process.env.TOKEN_LIFETIME || 86400,
  },

  baseUrl: process.env.BASE_URL || '/api/v1',
};

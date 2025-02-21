// server.js (updated)
const app = require('./api/app');
const PORT = process.env.PORT || 5000;

// Only listen if this file is run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app as well (for flexibility)
module.exports = app;
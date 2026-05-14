import app from "./app.js";
import ENV from "./utils/env.js";
import { checkConnection } from "./config/db.js";

const PORT = ENV.server.port || 5000;

const startServer = async () => {
  try {
    await checkConnection();

    app.listen(PORT, () => {
      console.log(`Server is ready on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

import { db } from "../lib/db.js";
import { logger } from "../lib/logger.js";

(async () => {
  try {
    // Seed
  } catch (error) {
    logger.error(error);
  } finally {
    await db.$disconnect();
  }
})();

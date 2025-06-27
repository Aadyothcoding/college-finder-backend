// backend/test/scraperTest.js
import { scrapeEduRankTopUnis } from "../utils/scraper.js";

const run = async () => {
  try {
    const universities = await scrapeEduRankTopUnis(10); // test with 10
    console.log("✅ Scraped universities:");
    console.log(universities);
  } catch (err) {
    console.error("❌ Scraper Error:", err.message);
  }
};

run();

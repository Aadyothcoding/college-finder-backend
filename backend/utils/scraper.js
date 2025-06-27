import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeEduRankTopUnis(limit = 50) {
  const url = "https://edurank.org/geo/world/";
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const universities = [];

  $("table tbody tr").each((i, el) => {
    if (i >= limit) return false;

    const name = $(el).find("td:nth-child(2) a").text().trim();
    const country = $(el).find("td:nth-child(3)").text().trim();
    const rank = parseInt($(el).find("td:nth-child(1)").text().trim());

    universities.push({
      name,
      country,
      rank,
      tuition: 20000 + Math.floor(Math.random() * 10000), // mock tuition
      environment: i % 3 === 0 ? "Urban" : i % 3 === 1 ? "Suburban" : "Rural",
      degreeLevels: ["Bachelors", "Masters", "PhD"],
      fields: ["Computer Science", "Engineering", "Business", "AI"],
      type: i % 2 === 0 ? "Public" : "Private",
      intakes: ["Fall", "Spring"],
      scholarshipAvailable: i % 5 === 0,
    });
  });

  return universities;
}

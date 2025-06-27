import fs from "fs";
import path from "path";
import csv from "csv-parser";

export const loadQSUniversities = async () => {
  const results = [];

  const filePath = path.join(
    process.cwd(),
    "backend",
    "data",
    "qs-world-rankings-2025.csv"
  );

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push({
          university: data["University"],
          country: data["Country"],
          rank: parseInt(data["Rank"]),
          logo: data["Logo"] || "", // if available
          type: "Public", // mock or improve later
          environment: "Urban" // mock or improve later
        });
      })
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

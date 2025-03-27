"use server";

import { load } from "cheerio";
// Optional: Uncomment the next line if you need to write the raw HTML to a file for debugging.
// import { writeFile } from "fs/promises";

export async function verifyBusinessAction({
  search,
  type = "ALL",
  place = "ALL", // Updated to use "ALL"
  city = "",
  stat = "ALL",
}) {
  // Build the form data as the form expects
  const formData = new URLSearchParams();
  formData.append("search", search);
  formData.append("type", type);
  formData.append("place", place);
  formData.append("city", city);
  formData.append("stat", stat);

  // Submit the form via POST to the Alabama SOS endpoint.
  const res = await fetch(
    "https://arc-sos.state.al.us/cgi/corpname.mbr/output",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (compatible; MyAPISearchBot/1.0; +http://mydomain.com/bot)",
      },
      body: formData.toString(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data from the Alabama SOS website");
  }

  // Retrieve the raw HTML response.
  const html = await res.text();

  // Optional: Write the raw HTML to a file for debugging
  // await writeFile("raw_response.html", html);
  // console.log("Raw HTML written to raw_response.html");

  // Load the HTML into Cheerio for parsing.
  const $ = load(html);
  const results = [];

  // Use a refined selector to target the results table within #block-sos-content.
  $("#block-sos-content table").each((i, table) => {
    $(table)
      .find("tbody tr")
      .each((j, row) => {
        const cells = $(row).find("td");
        // Only include rows with exactly 5 cells (skipping pagination/header rows)
        if (cells.length === 5) {
          results.push({
            entityId: $(cells[0]).text().trim(),
            entityName: $(cells[1]).text().trim(),
            city: $(cells[2]).text().trim(),
            type: $(cells[3]).text().trim(),
            status: $(cells[4]).text().trim(),
          });
        }
      });
  });

  return results;
}

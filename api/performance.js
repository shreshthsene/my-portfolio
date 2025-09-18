export default async function handler(req, res) {
  try {
    const apiKey = process.env.PAGESPEED_API_KEY;
    const url = "https://shreshth-portfolio.vercel.app";

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=mobile&key=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.lighthouseResult) {
      return res.status(500).json({ error: "No lighthouseResult", data });
    }

    const metrics = {
      score: data.lighthouseResult.categories.performance.score * 100,
      fcp: data.lighthouseResult.audits["first-contentful-paint"].displayValue,
      lcp: data.lighthouseResult.audits["largest-contentful-paint"].displayValue,
      cls: data.lighthouseResult.audits["cumulative-layout-shift"].displayValue,
      tbt: data.lighthouseResult.audits["total-blocking-time"].displayValue,
    };

    res.status(200).json(metrics);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Failed to fetch performance data" });
  }
}

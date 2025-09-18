export default async function handler(req, res) {
  try {
    const key = process.env.PAGESPEED_API_KEY;
    const url = "https://www.shreshth-portfolio.vercel.app"; // your site

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${key}&strategy=mobile`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    const metrics = {
      performance: data.lighthouseResult.categories.performance.score * 100,
      fcp: data.lighthouseResult.audits["first-contentful-paint"].displayValue,
      lcp: data.lighthouseResult.audits["largest-contentful-paint"].displayValue,
      cls: data.lighthouseResult.audits["cumulative-layout-shift"].displayValue,
      tti: data.lighthouseResult.audits["interactive"].displayValue,
    };

    res.status(200).json(metrics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch performance data" });
  }
}

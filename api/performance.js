export default async function handler(req, res) {
  const API_KEY = process.env.PAGESPEED_API_KEY;
  const url = req.query.url || "https://shreshth-portfolio.vercel.app/";

  try {
    const resp = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}`
    );
    const data = await resp.json();

    const lighthouse = data.lighthouseResult?.categories?.performance?.score || 0;
    const audits = data.lighthouseResult?.audits;

    res.status(200).json({
      score: Math.round(lighthouse * 100),
      fcp: audits["first-contentful-paint"].numericValue / 1000,
      lcp: audits["largest-contentful-paint"].numericValue / 1000,
      cls: audits["cumulative-layout-shift"].numericValue,
      tbt: audits["total-blocking-time"].numericValue,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch PageSpeed data" });
  }
}

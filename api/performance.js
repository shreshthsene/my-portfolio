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

    const fcp = audits["first-contentful-paint"].numericValue / 1000; // seconds
    const lcp = audits["largest-contentful-paint"].numericValue / 1000; // seconds
    const cls = audits["cumulative-layout-shift"].numericValue;
    const tbt = audits["total-blocking-time"].numericValue; // ms

    res.status(200).json({
      score: Math.round(lighthouse * 100),

      // raw values
      raw: { fcp, lcp, cls, tbt },

      // normalized scores (0 = poor, 100 = excellent)
      norm: {
        fcp: Math.min(100, Math.max(0, Math.round((1 - (fcp / 3)) * 100))),
        lcp: Math.min(100, Math.max(0, Math.round((1 - (lcp / 4)) * 100))),
        cls: Math.min(100, Math.max(0, Math.round((1 - (cls / 0.25)) * 100))),
        tbt: Math.min(100, Math.max(0, Math.round((1 - (tbt / 600)) * 100)))
      },

      // industry benchmark averages (%)
      industry: {
        fcp: 75,  // industry average ~75%
        lcp: 70,  // industry average ~70%
        cls: 85,  // industry average ~85%
        tbt: 65   // industry average ~65%
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch PageSpeed data" });
  }
}

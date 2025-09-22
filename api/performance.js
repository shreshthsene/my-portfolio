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

      // normalized scores
norm: {
  fcp: Math.min(100, Math.round((3 / fcp) * 100)),   // good ≤ 1.8s, poor ≥ 3s
  lcp: Math.min(100, Math.round((4 / lcp) * 100)),   // good ≤ 2.5s, poor ≥ 4s
  cls: Math.min(100, Math.round((0.25 / (cls || 0.001)) * 100)), // good ≤ 0.1, poor ≥ 0.25
  tbt: Math.min(100, Math.round((600 / tbt) * 100))  // good ≤ 200ms, poor ≥ 600ms
},

// add industry benchmark % values
industry: {
  fcp: 75,  // 75% avg score
  lcp: 70,  // 70% avg score
  cls: 85,  // 85% avg score
  tbt: 65   // 65% avg score
}
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch PageSpeed data" });
  }
}

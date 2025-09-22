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

    // --- Normalization helper ---
    function normalize(value, good, poor) {
      if (value <= good) return 100;
      if (value >= poor) return 0;
      return Math.round(((poor - value) / (poor - good)) * 100);
    }

    res.status(200).json({
      score: Math.round(lighthouse * 100),

      // raw values (for optional debugging / display)
      raw: { fcp, lcp, cls, tbt },

      // normalized scores (%) using thresholds
      norm: {
        fcp: normalize(fcp, 1.8, 3.0),   // good ≤ 1.8s, poor ≥ 3.0s
        lcp: normalize(lcp, 2.5, 4.0),   // good ≤ 2.5s, poor ≥ 4.0s
        cls: normalize(cls, 0.1, 0.25),  // good ≤ 0.1,  poor ≥ 0.25
        tbt: normalize(tbt, 200, 600)    // good ≤ 200ms, poor ≥ 600ms
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

export default async function handler(req, res) {
  const apiKey = process.env.PAGESPEED_API_KEY; // env variable from Vercel
  const url = req.query.url || "https://yourdomain.com"; // default: your site

  try {
    const response = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=mobile&key=${apiKey}`
    );
    const data = await response.json();

    // extract core metrics
    const lighthouse = data.lighthouseResult?.categories?.performance?.score || 0;
    const fcp = data.lighthouseResult?.audits["first-contentful-paint"]?.displayValue || "N/A";
    const lcp = data.lighthouseResult?.audits["largest-contentful-paint"]?.displayValue || "N/A";
    const cls = data.lighthouseResult?.audits["cumulative-layout-shift"]?.displayValue || "N/A";
    const tbt = data.lighthouseResult?.audits["total-blocking-time"]?.displayValue || "N/A";

    res.status(200).json({ score: lighthouse * 100, fcp, lcp, cls, tbt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch performance data" });
  }
}

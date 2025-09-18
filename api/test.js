export default function handler(req, res) {
  res.status(200).json({ key: process.env.PAGESPEED_API_KEY || "Not found" });
}

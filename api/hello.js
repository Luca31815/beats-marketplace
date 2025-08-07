// pages/api/hello.js
export default function handler(req, res) {
  console.log("✅ hello API invoked");
  res.status(200).json({ ok: true });
}
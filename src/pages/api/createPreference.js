// pages/api/createPreference.js
const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res
      .status(200)
      .json({ ok: true, msg: "Aquí llamaste con GET; usa POST con { items, email }" });
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", ["GET","POST"]);
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { items, email } = req.body;
  if (!Array.isArray(items) || !email) {
    return res.status(400).json({ error: "Payload inválido" });
  }

  try {
    const response = await mercadopago.preferences.create({
      items,
      payer: { email },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/pending`,
      },
      auto_return: "approved",
    });
    return res.status(200).json({ preferenceId: response.body.id });
  } catch (error) {
    console.error("createPreference error:", error);
    return res.status(500).json({ error: error.message });
  }
}

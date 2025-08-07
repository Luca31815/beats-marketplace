// pages/api/createPreference.js
import mercadopago from "mercadopago";

// Configura tu access token (guárdalo en .env: MP_ACCESS_TOKEN)
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { items, email } = req.body;
  try {
    const preferenceData = {
      items,
      payer: { email },
      back_urls: {
        success: `${req.headers.origin}/success`,
        failure: `${req.headers.origin}/failure`,
        pending: `${req.headers.origin}/pending`
      },
      auto_return: "approved"
    };
    const { body } = await mercadopago.preferences.create(preferenceData);
    return res.status(200).json({ preferenceId: body.id });
  } catch (error) {
    console.error("MercadoPago error:", error);
    return res.status(500).json({ error: error.message });
  }
}

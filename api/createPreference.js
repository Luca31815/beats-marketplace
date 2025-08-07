// api/createPreference.js
import mercadopago from "mercadopago";

// Configura tu access token (defínelo en Vercel o en .env.local como MP_ACCESS_TOKEN)
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Método no permitido" });
  }
  try {
    const { items, email } = req.body;
    const preferenceData = {
      items,
      payer: { email },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/failure`,
      },
      auto_return: "approved",
    };
    // Crea la preferencia en Mercado Pago
    const response = await mercadopago.preferences.create(preferenceData);
    // response.body.id es el preferenceId
    return res.status(200).json({ preferenceId: response.body.id });
  } catch (error) {
    console.error("createPreference error:", error);
    return res.status(500).json({ error: error.message });
  }
}

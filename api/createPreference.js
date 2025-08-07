// pages/api/createPreference.js
import mercadopago from "mercadopago";


export default async function handler(req, res) {
  console.log("🚀 createPreference invoked");
  console.log("ENV MP_ACCESS_TOKEN:", process.env.MP_ACCESS_TOKEN);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 1) Verificar que el token exista
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    console.error("⚠️ MP_ACCESS_TOKEN no está definido");
    return res
      .status(500)
      .json({ error: "Configuración de servidor errónea: falta MP_ACCESS_TOKEN" });
  }
  mercadopago.configure({ access_token: token });

  try {
    const { items, email } = req.body;

    // 2) Validar entrada
    if (!Array.isArray(items) || !email) {
      return res.status(400).json({ error: "Payload inválido" });
    }

    const preference = {
      items,
      payer: { email },
      back_urls: {
        success: `${req.headers.origin}/success`,
        failure: `${req.headers.origin}/failure`,
        pending: `${req.headers.origin}/pending`,
      },
      auto_return: "approved",
    };

    const { body } = await mercadopago.preferences.create(preference);
    return res.status(200).json({ preferenceId: body.id });
  } catch (e) {
    console.error("🛑 Error de Mercado Pago:", e);
    return res.status(500).json({ error: e.message || "Error desconocido" });
  }
}

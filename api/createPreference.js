// api/createPreference.js
import mercadopago from "mercadopago";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { beatId, userEmail } = req.body;
    if (!beatId || !userEmail) {
      return res
        .status(400)
        .json({ error: "beatId and userEmail are required" });
    }

    // Inicializa Supabase con service_role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1) Obtén datos del beat
    const { data: beat, error: beatError } = await supabase
      .from("beats")
      .select("title,price")
      .eq("id", beatId)
      .single();
    if (beatError || !beat) {
      throw new Error(beatError?.message || "Beat not found");
    }

    // 2) Configura MercadoPago
    mercadopago.configure({
      access_token: process.env.MP_ACCESS_TOKEN,
    });

    // 3) Crea la preferencia
    const preferenceResponse = await mercadopago.preferences.create({
      items: [
        {
          title: beat.title,
          quantity: 1,
          currency_id: "ARS",
          unit_price: Number(beat.price),
        },
      ],
      payer: { email: userEmail },
      back_urls: {
        success: `https://${req.headers.host}/checkout/success`,
        failure: `https://${req.headers.host}/checkout/failure`,
        pending: `https://${req.headers.host}/checkout/pending`,
      },
    });

    return res
      .status(200)
      .json({ preferenceId: preferenceResponse.body.id });
  } catch (err) {
    console.error("createPreference error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
}

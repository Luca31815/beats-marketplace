// api/createPreference.js
import mercadopago from "mercadopago";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { beatId, userEmail } = req.body;
  if (!beatId || !userEmail) {
    return res.status(400).json({ error: "beatId and userEmail are required" });
  }

  // Inicializa Supabase con service_role (necesitas la KEY con privilegios)
  const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // 1) Trae datos del beat
  const { data: beat, error: beatError } = await supabase
    .from("beats")
    .select("title,price")
    .eq("id", beatId)
    .single();

  if (beatError || !beat) {
    return res.status(500).json({ error: beatError?.message || "Beat not found" });
  }

  // 2) Configura MercadoPago
  mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN,
  });

  // 3) Crea preferencia
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
      success: "https://TU-DOMINIO/vercel.app/checkout/success",
      failure: "https://TU-DOMINIO/vercel.app/checkout/failure",
      pending: "https://TU-DOMINIO/vercel.app/checkout/pending",
    },
  });

  res.status(200).json({ preferenceId: preferenceResponse.body.id });
}

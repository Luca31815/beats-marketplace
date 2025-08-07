import mercadopago from "mercadopago";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST")
      return res.status(405).json({ error: "Method not allowed" });

    const { beatId, userEmail } = req.body;
    if (!beatId || !userEmail)
      return res.status(400).json({ error: "beatId and userEmail required" });

    // Inicializa Supabase SERVER
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1) Trae el beat
    const { data: beat, error: bErr } = await supabase
      .from("beats")
      .select("title,price")
      .eq("id", beatId)
      .single();
    if (bErr || !beat)
      return res.status(404).json({ error: bErr?.message || "Beat not found" });

    // 2) Configura MP
    mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN });

    // 3) Crea preference
    const { body } = await mercadopago.preferences.create({
      items: [{
        title: beat.title,
        quantity: 1,
        currency_id: "ARS",
        unit_price: Number(beat.price),
      }],
      payer: { email: userEmail },
      back_urls: { success: "/", failure: "/", pending: "/" },
    });

    return res.status(200).json({ preferenceId: body.id });
  } catch (err) {
    console.error("createPreference error:", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}

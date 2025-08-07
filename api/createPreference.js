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
      return res.status(400).json({ error: "beatId and userEmail are required" });
    }
    // Lee las vars de entorno que acabas de definir
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
    }

    // Inicializa el cliente con la URL correcta
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // ... resto de tu lógica (fetch beat, crear preferencia, etc.)
    // Siempre devolviendo JSON en try/catch
  } catch (err) {
    console.error("createPreference error:", err);
    res.status(500).json({ error: err.message });
  }
}

// api/createPreference.js
import mercadopago from 'mercadopago';

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  // Habilita CORS para la respuesta real
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { beatId, userEmail } = req.body;
    if (!beatId || !userEmail) {
      return res.status(400).json({ error: 'beatId and userEmail required' });
    }

    // Inicializa Supabase con service role
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Consulta el beat
    const { data: beat, error: bErr } = await supabase
      .from('beats')
      .select('title,price')
      .eq('id', beatId)
      .single();
    if (bErr || !beat) {
      return res.status(404).json({ error: bErr?.message || 'Beat not found' });
    }

    // Configura SDK MercadoPago
    mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

    // Crea la preferencia
    const { body } = await mercadopago.preferences.create({
      items: [
        {
          title: beat.title,
          quantity: 1,
          currency_id: 'ARS',
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

    return res.status(200).json({ preferenceId: body.id });
  } catch (err) {
    console.error('createPreference error:', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}

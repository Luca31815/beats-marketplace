import { serve } from 'https://deno.land/x/sift/mod.ts';
import mercadopago from 'mercadopago';

// Configura tu ACCESS_TOKEN en las variables de entorno del proyecto Supabase
mercadopago.configure({ access_token: Deno.env.get('TEST-6562685693789267-080515-fe977a5f62b7ed6748918dd3323ab93c-467495113') });

serve(async (req) => {
  const { beatId, userEmail } = await req.json();
  // 1) Lee el beat de la tabla
  const { data: beat } = await SOME_DB_CLIENT.from('beats').select('*').eq('id', beatId).single();

  // 2) Crea la preferencia
  const preference = await mercadopago.preferences.create({
    items: [
      { title: beat.title, quantity: 1, currency_id: 'ARS', unit_price: beat.price },
    ],
    payer: { email: userEmail },
    back_urls: {
      success: 'https://tusitio.com/checkout/success',
      failure: 'https://tusitio.com/checkout/failure',
      pending: 'https://tusitio.com/checkout/pending',
    },
  });

  return new Response(JSON.stringify({ preferenceId: preference.body.id }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

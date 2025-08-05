// src/components/MercadoPagoButton.jsx
import React, { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function MercadoPagoButton({ beat }) {
  useEffect(() => {
    const mp = new window.MercadoPago('TEST-089fc864-a563-4503-a629-2fce511d9fc8', { locale: 'es-AR' });
    mp.checkout({
      preference: { id: beat.preferenceId }, // generas esta preferencia antes
      render: { container: '#mp-button', label: 'Pagar con MercadoPago' },
    });
  }, [beat]);

  return <div id="mp-button" />;
}

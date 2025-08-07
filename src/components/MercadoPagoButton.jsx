import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function MercadoPagoButton({ beat }) {
  const [preferenceId, setPreferenceId] = useState(null);
  const user = useAuth();

  useEffect(() => {
    if (!user) return;
    // Llama a tu función serverless
    fetch('/api/createPreference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ beatId: beat.id, userEmail: user.email }),
    })
      .then(r => r.json())
      .then(data => setPreferenceId(data.preferenceId));
  }, [beat.id, user]);

  useEffect(() => {
    if (!preferenceId) return;
    const mp = new window.MercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY, { locale: 'es-AR' });
    mp.checkout({
      preference: { id: preferenceId },
      render: { container: '#mp-button', label: `Pagar AR$ ${beat.price}` },
    });
  }, [preferenceId, beat.price]);

  return <div id="mp-button" style={{ marginTop: '1rem' }} />;
}

// src/components/MercadoPagoButton.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { loadMercadoPago } from '@mercadopago/sdk-js';

export default function MercadoPagoButton({ beat }) {
  const user = useAuth();
  const [preferenceId, setPreferenceId] = useState(null);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(true);

  // 1) Crear la preference en tu API
  useEffect(() => {
    if (!user) return;
    setError('');
    setLoading(true);
    fetch('https://beats-marketplace-six.vercel.app/api/createPreference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ beatId: beat.id, userEmail: user.email }),
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || res.statusText);
        }
        return res.json();
      })
      .then(data => {
        setPreferenceId(data.preferenceId);
      })
      .catch(err => {
        console.error('Error creating preference:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [beat.id, user]);

  // 2) Cargar el SDK y renderizar el botón cuando tengamos la preferenceId
  useEffect(() => {
    if (error || loading || !preferenceId) return;

    const mp = loadMercadoPago(
      process.env.REACT_APP_MP_PUBLIC_KEY,
      { locale: 'es-AR' }
    );

    mp.checkout({
      preference: {
        id: preferenceId
      },
      render: {
        container: `#mp-button-${beat.id}`,
        label: `Pagar AR$ ${beat.price}`
      }
    });
  }, [preferenceId, error, loading, beat.id, beat.price]);

  if (error) {
    return <p className="text-red-500 mt-2">Error: {error}</p>;
  }
  if (loading) {
    return <p className="text-gray-500 mt-2">Cargando pago…</p>;
  }

  return (
    <div id={`mp-button-${beat.id}`} className="mt-4"></div>
  );
}

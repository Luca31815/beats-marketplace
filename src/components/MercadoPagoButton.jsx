// src/components/MercadoPagoButton.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function MercadoPagoButton({ beat }) {
  const user = useAuth();
  const [preferenceId, setPreferenceId] = useState(null);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(true);

  // 1) Crear la preferencia en tu API
  useEffect(() => {
    if (!user) return;
    console.log('[MP] creating preference for beat', beat.id, 'user', user.email);
    fetch('/api/createPreference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ beatId: beat.id, userEmail: user.email }),
    })
      .then(async (res) => {
        console.log('[MP] response status:', res.status);
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || 'Unknown error');
        }
        return payload;
      })
      .then(({ preferenceId }) => {
        console.log('[MP] got preferenceId:', preferenceId);
        setPreferenceId(preferenceId);
      })
      .catch((err) => {
        console.error('[MP] Error creating preference:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [beat.id, user]);

  // 2) Renderizar el botón cuando tengamos preferenceId
  useEffect(() => {
    if (error || loading) return;
    if (!preferenceId) return;
    if (typeof window.MercadoPago === 'undefined') {
      console.error('[MP] MercadoPago SDK not loaded');
      setError('No se cargó el SDK de MercadoPago');
      return;
    }
    const mp = new window.MercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY, { locale: 'es-AR' });
    mp.checkout({
      preference: { id: preferenceId },
      render: {
        container: `#mp-button-${beat.id}`,
        label: `Pagar AR$ ${beat.price}`,
      },
    });
  }, [preferenceId, error, loading, beat.id, beat.price]);

  // 3) UI de estados
  if (error) {
    return <p className="text-red-500 mt-2">Error: {error}</p>;
  }
  if (loading || !preferenceId) {
    return <p className="text-gray-500 mt-2">Cargando pago…</p>;
  }

  // Contenedor con ID único
  return <div id={`mp-button-${beat.id}`} className="mt-4" />;
}

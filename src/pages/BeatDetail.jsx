// src/pages/BeatDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import PreviewPlayer from '../components/PreviewPlayer';
import MercadoPagoButton from '../components/MercadoPagoButton';

export default function BeatDetail() {
  const { id } = useParams();
  const [beat, setBeat]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    supabase
      .from('beats')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
        } else {
          setBeat(data);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-8">Cargando...</p>;
  if (error)   return <p className="p-8 text-red-500">Error: {error}</p>;
  if (!beat)  return <Navigate to="/" replace />;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{beat.title}</h1>
      <p className="mb-2">
        <span className="font-semibold">Género:</span> {beat.genre}
      </p>
      <p className="mb-2">
        <span className="font-semibold">BPM:</span> {beat.bpm}
      </p>
      <p className="mb-4">
        <span className="font-semibold">Precio:</span> AR${beat.price}
      </p>
      <p className="mb-4">
        <span className="font-semibold">Etiquetas:</span> {beat.etiquetas.join(', ')}
      </p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Preview</h2>
        <PreviewPlayer url={beat.preview_path} />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Compra</h2>
        <MercadoPagoButton beat={beat} />
      </div>
    </div>
  );
}

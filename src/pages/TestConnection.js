// src/pages/TestConnection.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import PreviewPlayer from '../components/PreviewPlayer';
import { Link } from 'react-router-dom';

export default function TestConnection() {
  const [beats, setBeats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from('beats')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error al cargar beats:', error);
          setError(error.message);
        } else {
          setBeats(data);
        }
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Test de conexión a Beats</h1>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      {!error && beats.length === 0 && <p>No hay beats disponibles.</p>}

      <ul className="space-y-6">
        {beats.map(beat => (
          <li
            key={beat.id}
            className="border border-gray-200 p-4 rounded-md shadow-sm"
          >
            <h2 className="text-xl font-bold mb-2">
              <Link to={`/beats/${beat.id}`} className="hover:underline text-blue-600">
                {beat.title}
              </Link>
            </h2>
            <p className="mb-2">
              {beat.genre} — {beat.bpm} BPM — AR${beat.price}
            </p>
            <p className="mb-4">Etiquetas: {beat.etiquetas.join(', ')}</p>

            <PreviewPlayer url={beat.preview_path} />
          </li>
        ))}
      </ul>
    </div>
  );
}

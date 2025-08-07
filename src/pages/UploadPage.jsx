import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function UploadPage() {
  const user = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [bpm, setBpm] = useState(70);
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) return setError('Debes iniciar sesión.');
    if (!file) return setError('Selecciona un archivo de audio.');

    const userId = user.id;
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;

    // 1) Subir archivo a Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('beats')
      .upload(fileName, file);
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return setError('Error al subir archivo.');
    }

    // 2) Generar URL firmada (válida 1 hora)
    const { data: signedData, error: signError } = await supabase
      .storage
      .from('beats')
      .createSignedUrl(uploadData.path, 60 * 60);
    if (signError) {
      console.error('Signed URL error:', signError);
      return setError('Error al generar URL de preview.');
    }
    const previewUrl = signedData.signedUrl;

    // 3) Convertir tags a array
    const etiquetasArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    // 4) Insertar metadata en tabla
    const { error: dbError } = await supabase
      .from('beats')
      .insert([{
        user_id:      userId,
        title,
        genre,
        bpm,
        price,
        file_path:    uploadData.path,
        preview_path: previewUrl,
        etiquetas:    etiquetasArray
      }]);
    if (dbError) {
      console.error('DB insert error:', dbError);
      return setError('Error al guardar metadata.');
    }

    // 5) Redirigir
    navigate('/test');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sube tu Beat</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Género</label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={genre}
              onChange={e => setGenre(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">BPM (70–190)</label>
            <input
              type="number"
              min="70"
              max="190"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={bpm}
              onChange={e => setBpm(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio (AR$)</label>
            <input
              type="number"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Etiquetas (separadas por coma)</label>
            <input
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Artista1, Artista2"
              value={tags}
              onChange={e => setTags(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Archivo de audio</label>
            <input
              type="file"
              accept="audio/*"
              className="mt-1 block w-full"
              onChange={e => setFile(e.target.files[0])}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Subir Beat
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
}

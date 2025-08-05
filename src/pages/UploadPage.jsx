// src/pages/UploadPage.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [bpm, setBpm] = useState(70);
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError('Selecciona un archivo de audio.');

    // 1) Subir archivo a Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage.from('beats')
      .upload(fileName, file);

    if (uploadError) return setError(uploadError.message);

    // 2) Convertir tags a array
    const etiquetasArray = tags.split(',').map(t => t.trim()).filter(Boolean);

    // 3) Insertar metadata en tabla
    const { error: dbError } = await supabase
      .from('beats')
      .insert([{
        title,
        genre,
        bpm,
        price,
        file_path: uploadData.path,
        preview_path: uploadData.path, // luego ajustas para preview distinto
        etiquetas: etiquetasArray
      }]);

    if (dbError) return setError(dbError.message);

    // 4) Redirigir o notificar
    navigate('/test');
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>Sube tu Beat</h2>
      <form onSubmit={handleUpload}>
        <label>Título</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required />
        <label>Género</label>
        <input value={genre} onChange={e => setGenre(e.target.value)} required />
        <label>BPM</label>
        <input type="number" min="70" max="190" value={bpm} onChange={e => setBpm(Number(e.target.value))} />
        <label>Precio (AR$)</label>
        <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
        <label>Etiquetas (separadas por coma)</label>
        <input value={tags} onChange={e => setTags(e.target.value)} />
        <label>Archivo de audio</label>
        <input type="file" accept="audio/*" onChange={e => setFile(e.target.files[0])} required />
        <button type="submit">Subir Beat</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

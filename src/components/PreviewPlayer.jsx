// src/components/PreviewPlayer.jsx
import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export default function PreviewPlayer({ url }) {
  return (
    <div style={{ margin: '1rem 0' }}>
      <AudioPlayer
        src={url}
        showJumpControls={false}
        customAdditionalControls={[]}
        layout="stacked-reverse"
        // permite sólo un fragmento si tu backend lo sirve así
      />
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';

const API_BASE_URL = "https://sign-server-app-1.onrender.com";

function SignPage() {
  const { fileId } = useParams();
  const [signerName, setSignerName] = useState('');
  const sigCanvas = useRef(null);

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const handleSign = async () => {
    if (!signerName) {
      alert("אנא הכנס שם חתימה");
      return;
    }
    if (sigCanvas.current.isEmpty()) {
      alert("אנא חתום בתוך הקופסה");
      return;
    }

    const signatureImage = sigCanvas.current.getCanvas().toDataURL('image/png');

    try {
      const res = await fetch(`${API_BASE_URL}/sign/${fileId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signerName, signatureImage }),
      });

      if (!res.ok) throw new Error("שגיאה בשליחת החתימה");

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      alert("שגיאה בשליחת החתימה, נסה שוב");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>חתום על המסמך</h1>
      <input
        type="text"
        placeholder="שם החותם"
        value={signerName}
        onChange={(e) => setSignerName(e.target.value)}
        style={{ marginBottom: '10px', width: '100%', padding: '8px' }}
      />

      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{ width: 400, height: 150, className: 'sigCanvas', style: { border: '1px solid #000' } }}
      />

      <div style={{ marginTop: '10px' }}>
        <button onClick={clearSignature}>נקה חתימה</button>
        <button onClick={handleSign} style={{ marginLeft: '10px' }}>חתום ושלח</button>
      </div>
    </div>
  );
}

export default SignPage;

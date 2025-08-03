import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("אנא בחר קובץ");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("שגיאה בהעלאת הקובץ");

      const data = await res.json();
      setLink(data.shareLink);
    } catch (error) {
      alert("אירעה שגיאה בהעלאת הקובץ, נסה שוב");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>העלאת מסמך וורד לחתימה</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">שלח</button>
      </form>

      {link && (
        <div style={{ marginTop: '20px' }}>
          <p>המסמך הועלה! ניתן לשתף את הקישור:</p>
          <a href={link} target="_blank" rel="noreferrer">{link}</a>
        </div>
      )}
    </div>
  );
}

export default App;

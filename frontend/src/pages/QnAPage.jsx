import { useState } from 'react';
import api from '../api/axios';

export default function QnAPage() {
  const [text, setText] = useState('');
  const handleSend = async () => { await api.post('/questions', { description: text }); alert('Sent'); setText(''); };
  return (
    <div>
      <h2>Contact Us</h2>
      <textarea value={text} onChange={e=>setText(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI } from '@google/genai';
import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom/client';

const VIBES = [
  { id: 'friendly', label: '😊 Friendly', prompt: 'a friendly and warm greeting' },
  { id: 'scifi', label: '🚀 Sci-Fi', prompt: 'a futuristic, space-themed greeting' },
  { id: 'poetic', label: '📜 Poetic', prompt: 'a beautiful, short poem' },
  { id: 'code', label: '💻 Hacker', prompt: 'a nerdy, terminal-style greeting' },
];

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeVibe, setActiveVibe] = useState(VIBES[0]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateGreeting = async (vibe = activeVibe) => {
    setLoading(true);
    setMessage('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: `Generate a creative greeting that says "Hello World" (or a fun variation like "Hello Orld") in ${vibe.prompt}. Keep it concise and engaging.`,
      });

      let fullText = '';
      for await (const chunk of response) {
        fullText += chunk.text;
        setMessage(fullText);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setMessage('Failed to connect to the universe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateGreeting();
  }, []);

  return (
    <div className="container">
      <div className="glass-card">
        <header>
          <div className="badge">Gemini Powered</div>
          <h1>World Generator</h1>
          <p className="subtitle">Say hello to the world in any dimension.</p>
        </header>

        <div className="vibe-selector">
          {VIBES.map((v) => (
            <button
              key={v.id}
              className={`vibe-btn ${activeVibe.id === v.id ? 'active' : ''}`}
              onClick={() => setActiveVibe(v)}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="output-area">
          {message ? (
            <div className="message-content">{message}</div>
          ) : (
            <div className="placeholder">Initialising greeting...</div>
          )}
        </div>

        <button 
          className={`generate-btn ${loading ? 'loading' : ''}`} 
          onClick={() => generateGreeting()}
          disabled={loading}
        >
          {loading ? 'Transmitting...' : 'Generate New World'}
        </button>
      </div>
      
      <div className="footer">
        Built with Gemini 3 Flash • React 19
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
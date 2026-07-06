import { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

export function ScrambleIn({ text, delay = 0, triggered = false, style = {}, className = '' }) {
  const [display, setDisplay] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!triggered) { setDisplay('\u00A0'.repeat(text.length)); return; }
    const timer = setTimeout(() => {
      let pos = 0;
      intervalRef.current = setInterval(() => {
        pos += 0.5;
        const revealed = Math.floor(pos);
        let result = '';
        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ') { result += ' '; }
          else if (i < revealed) { result += text[i]; }
          else if (i < revealed + 3) { result += CHARS[Math.floor(Math.random() * CHARS.length)]; }
          else { result += '\u00A0'; }
        }
        setDisplay(result);
        if (revealed >= text.length) clearInterval(intervalRef.current);
      }, 25);
    }, delay);
    return () => { clearTimeout(timer); clearInterval(intervalRef.current); };
  }, [triggered, text, delay]);

  return <span style={style} className={className}>{display || '\u00A0'}</span>;
}

export function ScrambleHover({ text, className = '', style = {} }) {
  const [hovered, setHovered] = useState(false);
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!hovered) { setDisplay(text); clearInterval(intervalRef.current); return; }
    let pos = 0;
    intervalRef.current = setInterval(() => {
      pos += 0.25;
      const revealed = Math.floor(pos);
      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') result += ' ';
        else if (i < revealed) result += text[i];
        else result += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setDisplay(result);
      if (revealed >= text.length) clearInterval(intervalRef.current);
    }, 25);
    return () => clearInterval(intervalRef.current);
  }, [hovered, text]);

  return (
    <span
      className={className} style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >{display}</span>
  );
}

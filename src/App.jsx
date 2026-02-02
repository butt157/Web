import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const FighterJet = ({ isMoving }) => (
  <div style={{ width: '70px', position: 'relative', filter: 'drop-shadow(0 0 8px #00f2ff)' }}>
    {isMoving && <div className="thruster" />}
    <svg viewBox="0 0 100 50">
      <path d="M5,25 L35,5 L85,20 L95,25 L85,30 L35,45 Z" fill="#0a0a0a" stroke="#00f2ff" strokeWidth="2"/>
      <path d="M40,15 L60,25 L40,35" fill="#00f2ff" fillOpacity="0.3"/>
    </svg>
  </div>
);

const App = () => {
  const WHATSAPP_NUMBER = "5521987890183"; 
  const skills = [
    { name: "REACT", level: "95%" }, { name: "NODE.JS", level: "88%" },
    { name: "TS", level: "90%" }, { name: "AWS", level: "75%" }
  ];

  const sections = [
    { tag: "PILOTO: MATHEUS", title: "MISSION_START", desc: "Engenheiro Fullstack tático.", btnText: "INICIAR" },
    { tag: "ARSENAL", title: "TECH_STACK", desc: "React, Node.js, TypeScript e Cloud.", btnText: "REVISAR" },
    { tag: "LOGS", title: "MISSIONS", desc: "Sistemas de alta performance e Clean Code.", btnText: "PROJETOS" },
    { tag: "BASE", title: "CONTACT", desc: "Aguardando conexão via WhatsApp.", btnText: "SINAL" }
  ];

  const [pos, setPos] = useState({ x: 100, y: 300 });
  const [cameraX, setCameraX] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const pressedKeys = useRef(new Set());
  const touchActive = useRef(false);
  const targetTouch = useRef({ x: 0, y: 0 });
  const requestRef = useRef();

  const handleAction = (title) => {
    if (title === "MISSION_START") setShowModal(true);
    else if (title === "BASE_CONTACT" || title === "CONTACT") window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
  };

  useEffect(() => {
    const update = () => {
      setPos(prev => {
        let nX = prev.x; let nY = prev.y;
        const speed = 12;

        // Teclado
        if (pressedKeys.current.has('w')) nY -= speed;
        if (pressedKeys.current.has('s')) nY += speed;
        if (pressedKeys.current.has('a')) nX -= speed;
        if (pressedKeys.current.has('d')) nX += speed;

        // Touch (Suavizado)
        if (touchActive.current) {
          nX += (targetTouch.current.x - nX) * 0.15;
          nY += (targetTouch.current.y - nY) * 0.15;
        }

        const maxBoundary = (sections.length - 1) * window.innerWidth + 400;
        setIsMoving(pressedKeys.current.size > 0 || touchActive.current);

        return { 
          x: Math.max(50, Math.min(nX, maxBoundary)), 
          y: Math.max(50, Math.min(nY, window.innerHeight - 80)) 
        };
      });
      requestRef.current = requestAnimationFrame(update);
    };

    // Listeners Teclado
    const hD = e => pressedKeys.current.add(e.key.toLowerCase());
    const hU = e => pressedKeys.current.delete(e.key.toLowerCase());
    
    // Listeners Touch
    const hTS = e => { touchActive.current = true; updateT(e); };
    const hTM = e => { if(touchActive.current) updateT(e); };
    const hTE = () => { touchActive.current = false; };
    const updateT = (e) => {
      const t = e.touches[0];
      targetTouch.current = { x: t.clientX + cameraX, y: t.clientY };
    };

    window.addEventListener('keydown', hD); window.addEventListener('keyup', hU);
    window.addEventListener('touchstart', hTS, {passive: false});
    window.addEventListener('touchmove', hTM, {passive: false});
    window.addEventListener('touchend', hTE);

    requestRef.current = requestAnimationFrame(update);
    return () => {
      window.removeEventListener('keydown', hD); window.removeEventListener('keyup', hU);
      window.removeEventListener('touchstart', hTS); window.removeEventListener('touchmove', hTM);
      window.removeEventListener('touchend', hTE);
      cancelAnimationFrame(requestRef.current);
    };
  }, [cameraX]);

  useEffect(() => {
    const half = window.innerWidth / 2;
    if (pos.x > half) setCameraX(pos.x - half);
    else if (pos.x < half) setCameraX(0);
  }, [pos.x]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#030305', overflow: 'hidden' }}>
      <div className="scanlines" />

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content">
            <h3 style={{color: '#00f2ff'}}>SISTEMAS ONLINE</h3>
            <p>Use <b>WASD</b> ou <b>ARRASTE</b> na tela.</p>
            <button className="action-btn" onClick={() => setShowModal(false)}>DECOLAR</button>
          </div>
        </div>
      )}

      <div className="hud-vitals">
        ALT: {Math.floor(((window.innerHeight - pos.y) / window.innerHeight) * 30000)} FT <br/>
        SEC_X: {Math.floor(pos.x)}
      </div>

      <div className="hud-skills">
        {skills.map((s, i) => (
          <div key={i} className="skill-bar">
            <span>{s.name}</span>
            <div className="bar-bg"><div className="bar-fill" style={{ width: s.level }}></div></div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', transform: `translate3d(${-cameraX}px, 0, 0)`, willChange: 'transform' }}>
        {sections.map((s, i) => (
          <section key={i} className="section">
            <span style={{color: '#00f2ff', fontSize: '10px'}}>// {s.tag}</span>
            <h1 className="glitch-title">{s.title}</h1>
            <p>{s.desc}</p>
            <button className="action-btn" onClick={() => handleAction(s.title)}>{s.btnText}</button>
          </section>
        ))}
      </div>

      <div style={{ 
        position: 'fixed', left: 0, top: 0, 
        transform: `translate3d(${pos.x - cameraX}px, ${pos.y}px, 0)`, 
        zIndex: 1000, pointerEvents: 'none' 
      }}>
        <FighterJet isMoving={isMoving} />
      </div>
    </div>
  );
};

export default App;

import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const FighterJet = ({ isMoving }) => (
  <div style={{ width: '90px', position: 'relative', filter: 'drop-shadow(0 0 8px #00f2ff)' }}>
    {/* Turbina aparece apenas quando em movimento ou avançando */}
    {isMoving && <div className="thruster" />}
    <svg viewBox="0 0 100 50">
      <path d="M5,25 L35,5 L85,20 L95,25 L85,30 L35,45 Z" fill="#0a0a0a" stroke="#00f2ff" strokeWidth="2"/>
      <path d="M40,15 L60,25 L40,35" fill="#00f2ff" fillOpacity="0.3"/>
    </svg>
  </div>
);

const App = () => {
  const WHATSAPP_NUMBER = "55XXXXXXXXXXX"; // Troque pelo seu número
  const skills = [
    { name: "REACT", level: "95%" },
    { name: "NODE.JS", level: "88%" },
    { name: "TYPESCRIPT", level: "90%" },
    { name: "AWS/CLOUD", level: "75%" }
  ];

  const sections = [
    { tag: "PILOTO: MATHEUS LOURENÇO", title: "MISSION_START", desc: "Engenheiro Fullstack focado em alta performance e sistemas de missão crítica.", btnText: "INICIAR NAVEGAÇÃO" },
    { tag: "ESPECIFICAÇÕES", title: "TECH_STACK", desc: "Especialista em React e Node.js. Desenvolvendo soluções escaláveis e resilientes.", btnText: "REVISAR ARSENAL" },
    { tag: "REGISTRO", title: "PAST_MISSIONS", desc: "Histórico de entregas de alto impacto com foco em Clean Code.", btnText: "ABRIR RELATÓRIOS" },
    { tag: "COMANDO", title: "BASE_CONTACT", desc: "Disponível para novas missões e parcerias via WhatsApp.", btnText: "ENVIAR SINAL" }
  ];

  const [pos, setPos] = useState({ x: 200, y: 300 });
  const [cameraX, setCameraX] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isAtBase, setIsAtBase] = useState(false);
  
  const pressedKeys = useRef(new Set());
  const requestRef = useRef();

  const handleAction = (title) => {
    if (title === "MISSION_START") setShowModal(true);
    else if (title === "BASE_CONTACT") window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
  };

  useEffect(() => {
    const update = () => {
      setPos(prev => {
        const keys = pressedKeys.current;
        let nX = prev.x; let nY = prev.y;
        const speed = 15;

        if (keys.has('w')) nY -= speed;
        if (keys.has('s')) nY += speed;
        if (keys.has('a')) nX -= speed;
        if (keys.has('d')) nX += speed;

        const maxBoundary = (sections.length - 1) * window.innerWidth + 500;
        setIsAtBase(nX >= (sections.length - 1) * window.innerWidth);
        setIsMoving(keys.size > 0);
        
        return { 
          x: Math.max(100, Math.min(nX, maxBoundary)), 
          y: Math.max(50, Math.min(nY, window.innerHeight - 100)) 
        };
      });
      requestRef.current = requestAnimationFrame(update);
    };

    const hD = e => pressedKeys.current.add(e.key.toLowerCase());
    const hU = e => pressedKeys.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', hD); window.addEventListener('keyup', hU);
    requestRef.current = requestAnimationFrame(update);
    return () => {
      window.removeEventListener('keydown', hD); window.removeEventListener('keyup', hU);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    const half = window.innerWidth / 3;
    if (pos.x > half) setCameraX(pos.x - half);
  }, [pos.x]);

  const altitude = Math.floor(((window.innerHeight - pos.y) / window.innerHeight) * 45000);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#030305', overflow: 'hidden' }}>
      <div className="scanlines" />

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content">
            <h3 style={{color: '#00f2ff', margin: '0 0 10px 0'}}>SISTEMAS ONLINE</h3>
            <p style={{fontSize: '13px'}}>Pilote com <b>W, A, S, D</b>.</p>
            <button className="action-btn" onClick={() => setShowModal(false)}>DECOLAR</button>
          </div>
        </div>
      )}

      <div className="hud-vitals">
        {isAtBase ? <span style={{color: '#ff0055'}}>BASE_ATINGIDA</span> : <span>STATUS: EM VOO</span>} <br/>
        ALTITUDE: {altitude} FT
      </div>

      <div className="hud-skills">
        DIAGNOSTIC_SKILLS: <br/><br/>
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
            <span style={{color: '#00f2ff', fontSize: '11px'}}>// {s.tag}</span>
            <h1 className="glitch-title">{s.title}</h1>
            <p style={{maxWidth: '500px'}}>{s.desc}</p>
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
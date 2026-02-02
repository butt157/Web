import FighterJet from './FighterJet';

function App() {
  return (
    <div style={{ width: '500vw', height: '100vh', position: 'relative', overflowY: 'hidden', background: '#0a0a0c' }}>
      
      {/* HUD de Instruções */}
      <div style={{ position: 'fixed', top: 20, left: 20, color: '#00ff00', fontFamily: 'monospace', zIndex: 1000 }}>
        [ RADAR ATIVO ] <br />
        USE WASD PARA PILOTAR
      </div>

      <FighterJet />

      {/* Seções do Currículo */}
      <section style={sectionStyle('100vw', 'Home')}>
        <h1>SEU NOME</h1>
        <p>Fullstack Developer - Pilotando Código</p>
      </section>

      <section style={sectionStyle('200vw', 'Sobre')}>
        <h2>SISTEMAS DE BORDO (SKILLS)</h2>
        <ul>
          <li>React / Next.js</li>
          <li>Node.js / Express</li>
          <li>PostgreSQL</li>
        </ul>
      </section>

      <section style={sectionStyle('350vw', 'Projetos')}>
        <h2>MISSÕES CUMPRIDAS (PROJETOS)</h2>
        <div style={{ display: 'flex', gap: '50px' }}>
          <div className="card">Projeto Alpha</div>
          <div className="card">Projeto Bravo</div>
        </div>
      </section>

    </div>
  );
}

const sectionStyle = (left, title) => ({
  position: 'absolute',
  left: left,
  top: '20%',
  color: 'white',
  width: '600px',
  borderLeft: '4px solid #00ff00',
  padding: '20px',
  background: 'rgba(0, 255, 0, 0.05)'
});

export default App;
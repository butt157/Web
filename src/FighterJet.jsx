const update = () => {
  setPos((prev) => {
    let { x, y } = prev;
    const speed = 10; // Aumentei um pouco a velocidade

    if (pressedKeys.current.has('w')) y -= speed;
    if (pressedKeys.current.has('s')) y += speed;
    if (pressedKeys.current.has('a')) x -= speed;
    if (pressedKeys.current.has('d')) x += speed;

    // --- LÓGICA DE CÂMERA ---
    // Faz a página rolar horizontalmente para manter o avião centralizado
    // quando ele passa da metade da tela
    const scrollTarget = x - window.innerWidth / 2;
    
    if (x > window.innerWidth / 2) {
      window.scrollTo({
        left: scrollTarget,
        behavior: 'auto' // 'auto' é mais rápido que 'smooth' para jogos
      });
    }

    return { x, y };
  });
  requestRef.current = requestAnimationFrame(update);
};
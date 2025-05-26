import { useEffect, useRef } from 'react';

export default function useColisaoTiroAsteroide(tiros, setTiros, asteroides, setAsteroides, pontuacao, setPontuacao) {
  const rafId = useRef(null);

  const tirosRef = useRef(tiros);
  const asteroidesRef = useRef(asteroides);
  const pontosRef = useRef(pontuacao);

  // Atualiza os refs sempre que tiros, asteroides ou pontuação mudarem
  useEffect(() => {
    tirosRef.current = tiros;
  }, [tiros]);

  useEffect(() => {
    asteroidesRef.current = asteroides;
  }, [asteroides]);

  useEffect(() => {
    pontosRef.current = pontuacao;
  }, [pontuacao]);

  useEffect(() => {
    const COLISAO_TIRO_ASTEROIDE = 30;

    const checarColisoes = () => {
      const tirosAtuais = tirosRef.current;
      const asteroidesAtuais = asteroidesRef.current;

      const tirosParaRemover = new Set();
      const asteroidesParaRemover = new Set();
      let pontosGanhos = 0;

      tirosAtuais.forEach((tiro) => {
        const tiroY = tiro.y?.__getValue?.() ?? 0;

        asteroidesAtuais.forEach((asteroide) => {
          const asteroideY = asteroide.y?.__getValue?.() ?? 0;

          const distanciaX = Math.abs(tiro.x - asteroide.x - asteroide.size / 2);
          const distanciaY = Math.abs(tiroY - asteroideY);

          if (distanciaX < asteroide.size / 2 && distanciaY < COLISAO_TIRO_ASTEROIDE) {
            tirosParaRemover.add(tiro.id);
            asteroidesParaRemover.add(asteroide.id);
            pontosGanhos += 1;
          }
        });
      });

      if (tirosParaRemover.size > 0 || asteroidesParaRemover.size > 0) {
        setTiros((prev) => prev.filter((t) => !tirosParaRemover.has(t.id)));
        setAsteroides((prev) => prev.filter((a) => !asteroidesParaRemover.has(a.id)));
        if (pontosGanhos > 0) {
          setPontuacao((prev) => prev + pontosGanhos);
        }
      }

      rafId.current = requestAnimationFrame(checarColisoes);
    };

    rafId.current = requestAnimationFrame(checarColisoes);

    return () => cancelAnimationFrame(rafId.current);
  }, [setTiros, setAsteroides, setPontuacao]);
}

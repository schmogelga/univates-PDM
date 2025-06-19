import { useEffect, useRef } from 'react';

export default function useColisaoTiroAsteroideForte(
  tiros,
  setTiros,
  asteroidesFortes,
  setAsteroidesFortes,
  pontuacao,
  setPontuacao
) {
  const rafId = useRef(null);

  const tirosRef = useRef(tiros);
  const asteroidesRef = useRef(asteroidesFortes);
  const pontosRef = useRef(pontuacao);

  useEffect(() => {
    tirosRef.current = tiros;
  }, [tiros]);

  useEffect(() => {
    asteroidesRef.current = asteroidesFortes;
  }, [asteroidesFortes]);

  useEffect(() => {
    pontosRef.current = pontuacao;
  }, [pontuacao]);

  useEffect(() => {
    const COLISAO_TIRO_ASTEROIDE = 30;

    const checarColisoes = () => {
      const tirosAtuais = tirosRef.current;
      const asteroidesAtuais = asteroidesRef.current;

      const tirosParaRemover = new Set();
      const novosAsteroides = [];
      let pontosGanhos = 0;

      tirosAtuais.forEach((tiro) => {
        const tiroY = tiro.y?.__getValue?.() ?? 0;

        asteroidesAtuais.forEach((asteroide) => {
          const asteroideY = asteroide.y?.__getValue?.() ?? 0;

          const distanciaX = Math.abs(tiro.x - asteroide.x - asteroide.size / 2);
          const distanciaY = Math.abs(tiroY - asteroideY);

          if (distanciaX < asteroide.size / 2 && distanciaY < COLISAO_TIRO_ASTEROIDE) {
            tirosParaRemover.add(tiro.id);

            if (asteroide.hp > 1) {
              novosAsteroides.push({ ...asteroide, hp: asteroide.hp - 1 });
            } else {
              pontosGanhos += 30;
            }
          } else {
            novosAsteroides.push(asteroide);
          }
        });
      });

      if (tirosParaRemover.size > 0) {
        setTiros((prev) => prev.filter((t) => !tirosParaRemover.has(t.id)));
        setAsteroidesFortes(novosAsteroides);
        if (pontosGanhos > 0) {
          setPontuacao((prev) => prev + pontosGanhos);
        }
      }

      rafId.current = requestAnimationFrame(checarColisoes);
    };

    rafId.current = requestAnimationFrame(checarColisoes);

    return () => cancelAnimationFrame(rafId.current);
  }, [setTiros, setAsteroidesFortes, setPontuacao]);
}

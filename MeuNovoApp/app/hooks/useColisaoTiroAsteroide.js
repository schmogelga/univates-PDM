import { useEffect, useRef } from 'react';

export default function useColisaoTiroAsteroide(tiros, setTiros, asteroides, setAsteroides) {
  const rafId = useRef(null);

  const tirosRef = useRef(tiros);
  const asteroidesRef = useRef(asteroides);

  // Atualiza os refs sempre que tiros ou asteroides mudarem
  useEffect(() => {
    tirosRef.current = tiros;
  }, [tiros]);

  useEffect(() => {
    asteroidesRef.current = asteroides;
  }, [asteroides]);

  useEffect(() => {
    const COLISAO_TIRO_ASTEROIDE = 30;

    const checarColisoes = () => {
      const tirosAtuais = tirosRef.current;
      const asteroidesAtuais = asteroidesRef.current;

      const tirosParaRemover = new Set();
      const asteroidesParaRemover = new Set();

      tirosAtuais.forEach((tiro) => {
        const tiroY = tiro.y?.__getValue?.() ?? 0;

        asteroidesAtuais.forEach((asteroide) => {
          const asteroideY = asteroide.y?.__getValue?.() ?? 0;

          const distanciaX = Math.abs(tiro.x - asteroide.x - asteroide.size / 2);
          const distanciaY = Math.abs(tiroY - asteroideY);

          if (distanciaX < asteroide.size / 2 && distanciaY < COLISAO_TIRO_ASTEROIDE) {
            tirosParaRemover.add(tiro.id);
            asteroidesParaRemover.add(asteroide.id);
          }
        });
      });

      if (tirosParaRemover.size > 0 || asteroidesParaRemover.size > 0) {
        // Isso agora é seguro, pois não está dentro de um hook reativo com dependências que mudam sempre
        setTiros((prev) => prev.filter((t) => !tirosParaRemover.has(t.id)));
        setAsteroides((prev) => prev.filter((a) => !asteroidesParaRemover.has(a.id)));
      }

      rafId.current = requestAnimationFrame(checarColisoes);
    };

    rafId.current = requestAnimationFrame(checarColisoes);

    return () => cancelAnimationFrame(rafId.current);
  }, []); // <-- Importante: não depende mais de tiros/asteroides
}

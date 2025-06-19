import { useEffect, useRef } from 'react';

export default function useColisaoTiroInvasor(
  tiros,
  setTiros,
  invasores,
  setInvasores,
  pontuacao,
  setPontuacao
) {
  const rafId = useRef(null);

  const tirosRef = useRef(tiros);
  const invasoresRef = useRef(invasores);
  const pontosRef = useRef(pontuacao);

  useEffect(() => { tirosRef.current = tiros }, [tiros]);
  useEffect(() => { invasoresRef.current = invasores }, [invasores]);
  useEffect(() => { pontosRef.current = pontuacao }, [pontuacao]);

  useEffect(() => {
    const COLISAO_TIRO_INVASOR = 30;

    const checarColisoes = () => {

        const invasorDanoMap = new Map();       // Para aplicar dano acumulado
        const invasoresParaAtualizar = new Map();
      const tirosAtuais = tirosRef.current;
      const invasoresAtuais = invasoresRef.current;

      const tirosParaRemover = new Set();
      const invasoresParaRemover = new Set();
      let pontosGanhos = 0;

      tirosAtuais.forEach((tiro) => {
        const tiroY = tiro.y?.__getValue?.() ?? 0;

        invasoresAtuais.forEach((invasor) => {
          const invasorY = invasor.y?.__getValue?.() ?? 0;
          const invasorX = invasor.x?.__getValue?.() ?? invasor.x;
          const size = invasor.size;

          const distanciaX = Math.abs(tiro.x - (invasorX + size / 2));
          const distanciaY = Math.abs(tiroY - (invasorY + size / 2));

          if (distanciaX < size / 2 && distanciaY < COLISAO_TIRO_INVASOR) {
            tirosParaRemover.add(tiro.id);

            // Marca invasor para dano
            const atual = invasorDanoMap.get(invasor.id) || invasor;
            atual.hp = atual.hp - 1;

            if (atual.hp <= 0) {
              invasoresParaRemover.add(invasor.id);
              pontosGanhos += 50;
            } else {
              invasoresParaAtualizar.set(invasor.id, atual);
            }
          }
        });
      });

      if (tirosParaRemover.size > 0 || invasoresParaRemover.size > 0) {
        setTiros((prev) => prev.filter((t) => !tirosParaRemover.has(t.id)));
        setInvasores((prev) => prev.filter((i) => !invasoresParaRemover.has(i.id)));
        if (invasoresParaAtualizar.size > 0) {
          setInvasores((prev) =>
            prev.map((i) => invasoresParaAtualizar.get(i.id) || i)
          );
        }
        if (pontosGanhos > 0) {
          setPontuacao((prev) => prev + pontosGanhos);
        }
      }

      rafId.current = requestAnimationFrame(checarColisoes);
    };

    rafId.current = requestAnimationFrame(checarColisoes);
    return () => cancelAnimationFrame(rafId.current);
  }, [setTiros, setInvasores, setPontuacao]);
}

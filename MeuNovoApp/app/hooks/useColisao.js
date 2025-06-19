import { useEffect, useRef } from 'react';
import { NAVE_SIZE, NAVE_Y } from '../utils/constants';
import Sound from 'react-native-sound';

const deathSound = new Sound(require('../assets/death.mp3'), (error) => {
  if (error) {
    console.log('Erro ao carregar som', error);
  }
});

export default function useColisao(
    asteroidesFortes,
    setAsteroidesFortes,
    asteroides,
    setAsteroides,
    invasores,
    setInvasores,
    escudos,
    setEscudos,
    xRef,
    vidas,
    setVidas,
    setMostrarExplosao,
    escudoAtivo,
    setEscudoAtivo
) {
  const cooldownRef = useRef(false);

  useEffect(() => {
    if (vidas <= 0) return;

    const listeners = [];

    [...asteroidesFortes, ...asteroides, ...invasores].forEach(({ y }) => {
      const id = y.addListener(() => {});
      listeners.push({ anim: y, id });
    });

    const interval = setInterval(() => {
      if (cooldownRef.current) return;

      // Colisão com escudos — ativa proteção
      for (const { id, x, y, size } of escudos) {
        //const posX = x.__getValue?.() ?? 0;
        const posX = x;
        const posY = y.__getValue?.() ?? 0;

        const colisaoVertical = posY + size >= NAVE_Y && posY <= NAVE_Y + NAVE_SIZE;
        const colisaoHorizontal = posX + size >= xRef.current && posX <= xRef.current + NAVE_SIZE;

        if (colisaoVertical && colisaoHorizontal) {
          setEscudos((prev) => prev.filter((e) => e.id !== id));
          setEscudoAtivo(true);

          setTimeout(() => {
            setEscudoAtivo(false);
          }, 20000);

          return;
        }
      }

      // Colisão com asteroides
        for (const { id, x: astX, y: animY, size } of asteroides) {
          const posY = animY.__getValue();
          const colisaoVertical = posY + size >= NAVE_Y && posY <= NAVE_Y + NAVE_SIZE;
          const colisaoHorizontal = astX + size >= xRef.current && astX <= xRef.current + NAVE_SIZE;

          if (colisaoVertical && colisaoHorizontal) {
            if (escudoAtivo) {
              setAsteroides((prev) => prev.filter((ast) => ast.id !== id));
              setEscudoAtivo(false);
              return;
            }

            cooldownRef.current = true;
            deathSound.play();
            setVidas((v) => Math.max(v - 1, 0));
            setMostrarExplosao(true);

            setTimeout(() => {
              setMostrarExplosao(false);
              cooldownRef.current = false;
            }, 1000);

            return;
          }
        }

      // Colisão com asteroides fortes
        for (const { id, x: astX, y: animY, size } of asteroidesFortes) {
          const posY = animY.__getValue();
          const colisaoVertical = posY + size >= NAVE_Y && posY <= NAVE_Y + NAVE_SIZE;
          const colisaoHorizontal = astX + size >= xRef.current && astX <= xRef.current + NAVE_SIZE;

          if (colisaoVertical && colisaoHorizontal) {
            if (escudoAtivo) {
              setAsteroidesFortes((prev) => prev.filter((ast) => ast.id !== id));
              setEscudoAtivo(false);
              return;
            }

            cooldownRef.current = true;
            deathSound.play();
            setVidas((v) => Math.max(v - 1, 0));
            setMostrarExplosao(true);

            setTimeout(() => {
              setMostrarExplosao(false);
              cooldownRef.current = false;
            }, 1000);

            return;
          }
        }

      // Colisão com invasores — zera vidas
      for (const {id, x, y: invY, size } of invasores) {
        const invX = x.__getValue();
        const posY = invY.__getValue();
        const colisaoVertical = posY + size >= NAVE_Y && posY <= NAVE_Y + NAVE_SIZE;
        const colisaoHorizontal = invX + size >= xRef.current && invX <= xRef.current + NAVE_SIZE;

        if (colisaoVertical && colisaoHorizontal) {
          if (escudoAtivo) {
              setInvasores((prev) => prev.filter((inv) => inv.id !== id));
            setEscudoAtivo(false);
            return;
          }

          cooldownRef.current = true;
          deathSound.play();
          setVidas(0);
          setMostrarExplosao(true);

          setTimeout(() => {
            setMostrarExplosao(false);
            cooldownRef.current = false;
          }, 1000);

          return;
        }
      }
    }, 100);

    return () => {
      clearInterval(interval);
      listeners.forEach(({ anim, id }) => anim.removeListener(id));
    };
  }, [asteroides, invasores, escudos, vidas, escudoAtivo]);
}

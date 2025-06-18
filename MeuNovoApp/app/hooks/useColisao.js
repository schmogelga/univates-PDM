import { useEffect, useRef } from 'react';
import { Dimensions } from 'react-native';
import { NAVE_SIZE, NAVE_Y } from '../utils/constants';
import Sound from 'react-native-sound';

const deathSound = new Sound(require('../assets/death.mp3'), (error) => {
  if (error) {
    console.log('Erro ao carregar som', error);
  }
});

export default function useColisao(asteroides, xRef, vidas, setVidas, setMostrarExplosao) {
  const cooldownRef = useRef(false);

useEffect(() => {
  if (vidas <= 0) {
    return;
  }

  // Guardar listeners para remover depois
  const listeners = [];

  asteroides.forEach(({ y }) => {
    const id = y.addListener(({ value }) => {
      // Só para atualizar a posição se quiser, mas não estritamente necessário
    });
    listeners.push({ anim: y, id });
  });

  const interval = setInterval(() => {
    if (cooldownRef.current) return;
    for (const { x: astX, y: animY, size } of asteroides) {
      const posY = animY.__getValue(); // pega valor atual da animação
      const colisaoVertical = posY + size >= NAVE_Y && posY <= NAVE_Y + NAVE_SIZE;
      const colisaoHorizontal = astX + size >= xRef.current && astX <= xRef.current + NAVE_SIZE;

      if (colisaoVertical && colisaoHorizontal) {
        cooldownRef.current = true;
        deathSound.play();
        setVidas(v => Math.max(v - 1, 0));
        setMostrarExplosao(true);

        setTimeout(() => {
          setMostrarExplosao(false);
          cooldownRef.current = false;
        }, 1000);

        break;
      }
    }
  }, 100);

  return () => {
    clearInterval(interval);
    listeners.forEach(({ anim, id }) => anim.removeListener(id));
  };
}, [asteroides, vidas]);
}

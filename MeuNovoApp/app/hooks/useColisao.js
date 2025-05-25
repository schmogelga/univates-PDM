import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { NAVE_SIZE, NAVE_Y } from '../utils/constants';


export default function useColisao(asteroides, xRef, perdeu, setPerdeu, setMostrarExplosao) {
  useEffect(() => {
    if (perdeu) return;

    const interval = setInterval(() => {
      asteroides.forEach(({ x: astX, y: animY, size }) => {
        animY.addListener(({ value }) => {
          const colisaoVertical = value + size >= NAVE_Y && value <= NAVE_Y + NAVE_SIZE;
          const colisaoHorizontal = astX + size >= xRef.current && astX <= xRef.current + NAVE_SIZE;

          if (colisaoVertical && colisaoHorizontal) {
            setPerdeu(true);
            setMostrarExplosao(true);

            setTimeout(() => {
              setMostrarExplosao(false);
            }, 1000);
            clearInterval(interval);
          }
        });
      });
    }, 100);

    return () => clearInterval(interval);
  }, [asteroides, perdeu]);
}

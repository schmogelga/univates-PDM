import { useState, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';
import Sound from 'react-native-sound';

const { height } = Dimensions.get('window');
const NAVE_SIZE = 60;
const NAVE_Y = height - 40 - NAVE_SIZE;

const tiroSound = new Sound(require('../assets/tiro.mp3'), (error) => {
  if (error) {
    console.log('Erro ao carregar som', error);
  }
});

export default function useTiros(perdeu, xRef, intervaloTiro = 500) {
  const [tiros, setTiros] = useState([]);
  const podeAtirar = useRef(true); // controle do intervalo

  const dispararTiro = () => {
    if (perdeu || !podeAtirar.current) return;

    podeAtirar.current = false;
    setTimeout(() => {
      podeAtirar.current = true;
    }, intervaloTiro);

    const tiroAnim = new Animated.Value(NAVE_Y);
    const id = Date.now() + Math.random();
    const tiroX = xRef.current + NAVE_SIZE / 2 - 2;

      tiroSound.stop(() => {
        tiroSound.play();
      });

    setTiros(prev => [...prev, { id, x: tiroX, y: tiroAnim }]);

    Animated.timing(tiroAnim, {
      toValue: -10,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      setTiros(prev => prev.filter(t => t.id !== id));
    });
  };

  return { tiros, dispararTiro, setTiros };
}

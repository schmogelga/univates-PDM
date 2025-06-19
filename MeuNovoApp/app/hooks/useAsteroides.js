import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const SPAWN_INTERVAL = 1500;

export default function useAsteroides(perdeu) {
  const [asteroides, setAsteroides] = useState([]);
  const intervaloRef = useRef(null);

  useEffect(() => {
    if (perdeu) return;

    intervaloRef.current = setInterval(() => {
      const size = 30 + Math.random() * 40;
      const startX = Math.random() * (width - size);
      const animY = new Animated.Value(0);
      const id = Date.now() + Math.random();
      const duration = 4000 + Math.random() * 2000; // agora aqui

      setAsteroides(prev => [...prev, { id, x: startX, y: animY, size }]);

      Animated.timing(animY, {
        toValue: height,
        duration,
        useNativeDriver: true,
      }).start(() => {
        setAsteroides(prev => prev.filter(a => a.id !== id));
      });
    }, SPAWN_INTERVAL);

    return () => clearInterval(intervaloRef.current);
  }, [perdeu]);

  return { asteroides, setAsteroides };
}

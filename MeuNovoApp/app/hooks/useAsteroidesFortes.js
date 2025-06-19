import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const SPAWN_INTERVAL = 5000;

export default function useAsteroidesFortes(perdeu) {
  const [asteroidesFortes, setAsteroidesFortes] = useState([]);
  const intervaloRef = useRef(null);

const idRef = useRef(0);

useEffect(() => {
  if (perdeu) return;

  intervaloRef.current = setInterval(() => {
    const size = 30 + Math.random() * 40;
    //const startX = Math.random() * (width - size);
    const startX = (Dimensions.get('window').width - size) / 2;
    const animY = new Animated.Value(0);
    const id = idRef.current++; // Garante unicidade
    const duration = 2000 + Math.random() * 2000; // aqui dentro

    setAsteroidesFortes(prev => [...prev, { id, x: startX, y: animY, size, hp: 2 }]);

    Animated.timing(animY, {
      toValue: height,
      duration,
      useNativeDriver: true,
    }).start(() => {
      setAsteroidesFortes(prev => prev.filter(a => a.id !== id));
    });
  }, SPAWN_INTERVAL);

  return () => clearInterval(intervaloRef.current);
}, [perdeu]);

  return { asteroidesFortes, setAsteroidesFortes };
}

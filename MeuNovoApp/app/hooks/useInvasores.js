import { useEffect, useState } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function useInvasores(perdeu) {
  const [invasores, setInvasores] = useState([]);

  useEffect(() => {
    if (perdeu) return;

    const interval = setInterval(() => {
      const id = Date.now();
      const y = new Animated.Value(0);
      const x = new Animated.Value(Math.random() * width);

      const startTime = Date.now();
      const amplitudeX = 40 + Math.random() * 60; // varia de 40 a 100 px
      const freq = 0.001 + Math.random() * 0.0015; // frequência pequena para suavidade

      // Loop de movimento vertical (sempre descendo)
      Animated.timing(y, {
        toValue: height,
        duration: 15000,
        useNativeDriver: false,
      }).start();

      // Loop de movimento horizontal com seno
        const updateX = () => {
          const elapsed = Date.now() - startTime;
          const newX = x.__getValue() + Math.sin(elapsed * freq) * amplitudeX * 0.1;
          const limitedX = Math.min(Math.max(newX, 0), width - 60);
          x.setValue(limitedX);

          if (elapsed < 15000) {
            requestAnimationFrame(updateX);
          }
        };
      requestAnimationFrame(updateX);

      setInvasores((prev) => [
        ...prev,
        { id, x, y, size: 60, hp: 5},
      ]);
    }, 7000);

    return () => clearInterval(interval);
  }, [perdeu]);

  return { invasores, setInvasores };
}

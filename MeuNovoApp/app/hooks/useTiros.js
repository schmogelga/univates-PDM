import { useState } from 'react';
import { Animated, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');
const NAVE_SIZE = 60;
const NAVE_Y = height - 40 - NAVE_SIZE;

export default function useTiros(perdeu, xRef) {
  const [tiros, setTiros] = useState([]);

  const dispararTiro = () => {
    if (perdeu) return;

    const tiroAnim = new Animated.Value(NAVE_Y);
    const id = Date.now() + Math.random();
    const tiroX = xRef.current + NAVE_SIZE / 2 - 2;

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

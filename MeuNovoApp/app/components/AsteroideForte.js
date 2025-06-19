import { Animated, Image } from 'react-native';

import asteroide2 from '../assets/asteroideForte.png'; // hp = 2
import asteroide1 from '../assets/asteroideForte2.png'; // hp = 1

const imagens = {
  2: asteroide2,
  1: asteroide1,
};

const AsteroideForte = ({ x, y, size, hp }) => {
  const imagem = imagens[hp] ?? asteroide1;

  return (
    <Animated.Image
      source={imagem}
      style={{
        position: 'absolute',
        left: x,
        transform: [{ translateY: y }],
        width: size,
        height: size,
      }}
      resizeMode="contain"
    />
  );
};

export default AsteroideForte;

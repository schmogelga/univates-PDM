import { Animated, Image } from 'react-native';

import invasor5 from '../assets/invasor1.png';
import invasor4 from '../assets/invasor2.png';
import invasor3 from '../assets/invasor3.png';
import invasor2 from '../assets/invasor4.png';
import invasor1 from '../assets/invasor5.png';

const imagens = {
  5: invasor5,
  4: invasor4,
  3: invasor3,
  2: invasor2,
  1: invasor1,
};

const Invasor = ({ x, y, size, hp, maxHp }) => {
  const imagem = imagens[hp] ?? invasor1;

  return (
    <Animated.Image
      source={imagem}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
      }}
    />
  );
};

export default Invasor;

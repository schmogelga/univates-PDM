import { Image } from 'react-native';

const Explosao = ({ x, y, size }) => (
  <Image
    source={require('../assets/explosao.png')}
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: size / 2,
    }}
  />
);

export default Explosao;
import { Animated, Image } from 'react-native';

const Invasor = ({ x, y, size }) => {
  return (
    <Animated.Image
      source={require('../assets/invasor.png')}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        resizeMode: 'contain',
      }}
    />
  );
};

export default Invasor;

import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Explosao = ({ x, y, size }) => {
  return (
    <Image
      source={require('../assets/explosion.jpg')}
      style={[styles.explosao, { left: x, top: y, width: size, height: size }]}
    />
  );
};

const styles = StyleSheet.create({
  explosao: {
    position: 'absolute',
  },
});

export default Explosao;

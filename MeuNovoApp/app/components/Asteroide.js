import React from 'react';
import { Animated, StyleSheet, Image } from 'react-native';

const Asteroide = ({ x, y, size }) => {
  return (
    <Animated.Image
      source={require('../assets/asteroide.png')} // caminho para sua imagem
      style={[
        styles.asteroide,
        {
          width: size,
          height: size,
          left: x,
          transform: [{ translateY: y }],
        },
      ]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  asteroide: {
    position: 'absolute',
  },
});

export default Asteroide;

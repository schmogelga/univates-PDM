import React from 'react';
import { Image, StyleSheet, Animated } from 'react-native';

const Asteroide = ({ x, y }) => {
  return (
    <Animated.Image
      source={require('../assets/asteroide.png')} // substitua pela sua imagem
      style={[
        styles.asteroide,
        {
          left: x,
          top: y,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  asteroide: {
    position: 'absolute',
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default Asteroide;

import React from 'react';
import { Animated, StyleSheet, Image } from 'react-native';

const Escudo = ({ x, y, size }) => {
  return (
    <Animated.Image
      source={require('../assets/escudo.png')} // você precisa adicionar essa imagem na pasta assets
      style={[
        styles.escudo,
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
  escudo: {
    position: 'absolute',
  },
});

export default Escudo;

import React from 'react';
import { Image, StyleSheet, Animated } from 'react-native';
import { NAVE_Y } from '../utils/constants';

const Nave = ({ x, nave }) => {
  return (
    <Animated.Image
      source={nave.imagem}
      style={[
        styles.nave,
        {
          width: nave.size,
          height: nave.size,
          left: x,
          top: NAVE_Y,
        },
      ]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  nave: {
    position: 'absolute',
  },
});

export default Nave;

// components/Explosao.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Explosao = ({ x, y, size }) => (
  <View
    style={[
      styles.explosao,
      {
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2,
      },
    ]}
  />
);

const styles = StyleSheet.create({
  explosao: {
    position: 'absolute',
    backgroundColor: 'orange',
    opacity: 0.8,
  },
});

export default Explosao;

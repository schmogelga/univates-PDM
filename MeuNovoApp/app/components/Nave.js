import React from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Nave = ({ x }) => {
  return (
    <Image
      source={require('../assets/nave.png')}
      style={[
        styles.nave,
        { left: x },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  nave: {
    position: 'absolute',
    bottom: 40,
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});

export default Nave;

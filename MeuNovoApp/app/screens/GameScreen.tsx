import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import StarMap from '../components/StarMap';
import Nave from '../components/Nave';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { map } from 'rxjs/operators';

const { width } = Dimensions.get('window');
const MAX_X = width - 60; // largura da nave

const GameScreen = () => {
  const [x, setX] = useState(width / 2 - 30);
  const xRef = useRef(x);

  useEffect(() => {
    xRef.current = x;
  }, [x]);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 16); // 60fps aprox

    const subscription = accelerometer
      .pipe(
        map(({ x }) => {
          // Ajusta o movimento da nave
          let newX = xRef.current - x * 5; // controla sensibilidade

          // Limita dentro da tela
          if (newX < 0) newX = 0;
          if (newX > MAX_X) newX = MAX_X;

          return newX;
        })
      )
      .subscribe(setX);

    return () => subscription.unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <StarMap />
      <Nave x={x} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default GameScreen;

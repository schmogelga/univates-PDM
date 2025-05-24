import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { map } from 'rxjs/operators';

import Nave from './Nave';

const { width } = Dimensions.get('window');
const MAX_X = width - 60;

export default function Game() {
  const [posX, setPosX] = useState(width / 2 - 30);
  const posXRef = useRef(posX);

  useEffect(() => {
    posXRef.current = posX;
  }, [posX]);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 16);

    const subscription = accelerometer
      .pipe(
        map(({ x }) => {
          let newX = posXRef.current - x * 20;
          if (newX < 0) newX = 0;
          if (newX > MAX_X) newX = MAX_X;
          return newX;
        })
      )
      .subscribe(setPosX);

    return () => subscription.unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Nave x={posX} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

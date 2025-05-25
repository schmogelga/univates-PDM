import { useEffect, useState, useRef } from 'react';
import { Dimensions } from 'react-native';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { map } from 'rxjs/operators';

const { width } = Dimensions.get('window');
const NAVE_SIZE = 60;
const MAX_X = width - NAVE_SIZE;

export default function useAcelerometro() {
  const [x, setX] = useState(width / 2 - NAVE_SIZE / 2);
  const xRef = useRef(x);

  useEffect(() => {
    xRef.current = x;
  }, [x]);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 16);
    const subscription = accelerometer
      .pipe(map(({ x }) => {
        let newX = xRef.current - x * 5;
        if (newX < 0) newX = 0;
        if (newX > MAX_X) newX = MAX_X;
        return newX;
      }))
      .subscribe(setX);

    return () => subscription.unsubscribe();
  }, []);

  return { x, xRef };
}

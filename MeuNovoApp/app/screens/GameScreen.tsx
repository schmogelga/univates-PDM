import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Modal, Text, Button } from 'react-native';
import StarMap from '../components/StarMap';
import Nave from '../components/Nave';
import Asteroide from '../components/Asteroide';
import Explosao from '../components/Explosao';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { map } from 'rxjs/operators';

import { TouchableWithoutFeedback } from 'react-native';


const { width, height } = Dimensions.get('window');
const NAVE_SIZE = 60;
const MAX_X = width - NAVE_SIZE;

const ASTEROIDE_SPAWN_INTERVAL = 1500;
const ASTEROIDE_FALL_DURATION = 4000;

const NAVE_Y = height - 40 - NAVE_SIZE; // 40 é uma margem fixa (se quiser pode ajustar)


const GameScreen = ({ navigation }) => {

    const [perdeu, setPerdeu] = useState(false);
  const [x, setX] = useState(width / 2 - NAVE_SIZE / 2);
  const [asteroides, setAsteroides] = useState([]);
  const xRef = useRef(x);
  const intervaloRef = useRef(null);

const [tiros, setTiros] = useState([]);


  useEffect(() => {
    xRef.current = x;
  }, [x]);

  // Movimento da nave com acelerômetro
  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 16);

    const subscription = accelerometer
      .pipe(
        map(({ x }) => {
          let newX = xRef.current - x * 5;
          if (newX < 0) newX = 0;
          if (newX > MAX_X) newX = MAX_X;
          return newX;
        })
      )
      .subscribe(setX);

    return () => subscription.unsubscribe();
  }, []);

  // Spawn dos asteroides
  useEffect(() => {
    intervaloRef.current = setInterval(() => {
      const size = 30 + Math.random() * 40; // tamanho aleatório entre 30 e 70
      const startX = Math.random() * (width - size);
      const animY = new Animated.Value(0);
      const id = Date.now() + Math.random();

      // Adiciona novo asteroide
      setAsteroides(prev => [...prev, { id, x: startX, y: animY, size }]);

      // Anima queda do asteroide
      Animated.timing(animY, {
        toValue: height,
        duration: ASTEROIDE_FALL_DURATION,
        useNativeDriver: true,
      }).start(() => {
        // Remove asteroide ao final da animação
        setAsteroides(prev => prev.filter(a => a.id !== id));
      });
    }, ASTEROIDE_SPAWN_INTERVAL);

    return () => clearInterval(intervaloRef.current);
  }, []);

useEffect(() => {
  if (perdeu) return;

  const intervaloColisao = setInterval(() => {
    asteroides.forEach(({ x: astX, y: animY, size }) => {
      animY.addListener(({ value }) => {
        const colisaoVertical = value + size >= NAVE_Y && value <= NAVE_Y + NAVE_SIZE;
        const colisaoHorizontal = astX + size >= xRef.current && astX <= xRef.current + NAVE_SIZE;

        if (colisaoVertical && colisaoHorizontal) {
          setPerdeu(true);
          clearInterval(intervaloColisao);
        }
      });
    });
  }, 100);

  return () => clearInterval(intervaloColisao);
}, [asteroides, perdeu]);

const dispararTiro = () => {
  if (perdeu) return;

  const tiroAnim = new Animated.Value(NAVE_Y);
  const id = Date.now() + Math.random();
  const tiroX = xRef.current + NAVE_SIZE / 2 - 2; // centraliza o tiro (linha fina)

  setTiros(prev => [...prev, { id, x: tiroX, y: tiroAnim }]);

  Animated.timing(tiroAnim, {
    toValue: -10, // sai da tela por cima
    duration: 800,
    useNativeDriver: true,
  }).start(() => {
    setTiros(prev => prev.filter(t => t.id !== id));
  });
};


  return (
      <TouchableWithoutFeedback onPress={dispararTiro}>
    <View style={styles.container}>
      <StarMap />

      {/* Fundo opaco quando perdeu */}
      {perdeu && <View style={styles.fundoEscuro} />}

      {/* Nave ou explosão */}
      {perdeu ? (
        <Explosao x={x} y={NAVE_Y} size={NAVE_SIZE} />
      ) : (
        <Nave x={x} />
      )}

      {asteroides.map(({ id, x, y, size }) => (
        <Asteroide key={id} x={x} y={y} size={size} />
      ))}

      <Modal visible={perdeu} transparent animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.textoModal}>Você perdeu!</Text>
          <Button title="Sair" onPress={() => navigation.navigate('Home')} />
        </View>
      </Modal>
      {tiros.map(({ id, x, y }) => (
        <Animated.View
          key={id}
          style={{
            position: 'absolute',
            left: x,
            transform: [{ translateY: y }],
            width: 4,
            height: 20,
            backgroundColor: 'white',
          }}
        />
      ))}
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  fundoEscuro: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoModal: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
});

export default GameScreen;

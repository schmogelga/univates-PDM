import React, { useState } from 'react';
import { View, StyleSheet, Modal, Text, Button, TouchableWithoutFeedback, Animated, Dimensions } from 'react-native';
import StarMap from '../components/StarMap';
import Nave from '../components/Nave';
import Asteroide from '../components/Asteroide';
import Explosao from '../components/Explosao';
import useAcelerometro from '../hooks/useAcelerometro';
import useAsteroides from '../hooks/useAsteroides';
import useColisao from '../hooks/useColisao';
import useColisaoTiroAsteroide from '../hooks/useColisaoTiroAsteroide';
import useTiros from '../hooks/useTiros';
import { NAVE_SIZE, NAVE_Y } from '../utils/constants';


const GameScreen = ({ navigation }) => {

  const [perdeu, setPerdeu] = useState(false);
  const { x, xRef } = useAcelerometro();
const { asteroides, setAsteroides } = useAsteroides(perdeu);
const { tiros, dispararTiro, setTiros } = useTiros(perdeu, xRef);
const [mostrarExplosao, setMostrarExplosao] = useState(false);

    useColisaoTiroAsteroide(tiros, setTiros, asteroides, setAsteroides);
    useColisao(asteroides, xRef, perdeu, setPerdeu, setMostrarExplosao);

  return (
    <TouchableWithoutFeedback onPress={dispararTiro}>
      <View style={styles.container}>
        <StarMap />
        {perdeu && <View style={styles.fundoEscuro} />}
        {!perdeu && <Nave x={x} />}
        {mostrarExplosao && <Explosao x={x} y={NAVE_Y} size={NAVE_SIZE} />}
            {asteroides.map(({ id, x, y, size }) => (
          <Asteroide key={id} x={x} y={y} size={size} />
        ))}
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
        <Modal visible={perdeu} transparent animationType="slide">
          <View style={styles.modal}>
            <Text style={styles.textoModal}>Você perdeu!</Text>
            <Button title="Sair" onPress={() => navigation.navigate('Home')} />
          </View>
        </Modal>
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

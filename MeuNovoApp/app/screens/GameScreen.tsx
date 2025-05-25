import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  Button,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import StarMap from '../components/StarMap';
import Nave from '../components/Nave';
import Asteroide from '../components/Asteroide';
import Explosao from '../components/Explosao';
import useAcelerometro from '../hooks/useAcelerometro';
import useAsteroides from '../hooks/useAsteroides';
import useColisao from '../hooks/useColisao';
import useColisaoTiroAsteroide from '../hooks/useColisaoTiroAsteroide';
import useTiros from '../hooks/useTiros';
import { NAVE_Y } from '../utils/constants';
import { NAVES } from '../utils/constants'; // Certifique-se que o caminho esteja correto

const GameScreen = ({ navigation }) => {
  const [perdeu, setPerdeu] = useState(false);
  const [naveAtual, setNaveAtual] = useState(NAVES.padrao);
  const { x, xRef } = useAcelerometro(naveAtual.velocidade);
  const { asteroides, setAsteroides } = useAsteroides(perdeu);
  const { tiros, dispararTiro, setTiros } = useTiros(perdeu, xRef, naveAtual.intervaloTiro);
  const [mostrarExplosao, setMostrarExplosao] = useState(false);

  useColisaoTiroAsteroide(tiros, setTiros, asteroides, setAsteroides);
  useColisao(asteroides, xRef, perdeu, setPerdeu, setMostrarExplosao);

  const trocarNave = () => {
    setNaveAtual((prev) => (prev.id === 'padrao' ? NAVES.leve : NAVES.padrao));
  };

  return (
    <TouchableWithoutFeedback onPress={dispararTiro}>
      <View style={styles.container}>
        <StarMap />

        {/* Botão de troca no canto superior direito */}
        {!perdeu && (
          <Pressable onPress={trocarNave} style={styles.botaoTroca}>
            <Text style={styles.textoBotao}>Trocar Nave</Text>
          </Pressable>
        )}

        {perdeu && <View style={styles.fundoEscuro} />}
        {!perdeu && <Nave x={x} nave={naveAtual} />}

        {mostrarExplosao && (
          <Explosao x={x} y={NAVE_Y} size={naveAtual.size} />
        )}

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
    zIndex: 2,
  },
  textoModal: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  botaoTroca: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  textoBotao: {
    color: 'white',
    fontSize: 12,
  },
});

export default GameScreen;

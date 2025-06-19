import React, { useState, useRef, useEffect } from 'react';
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
import Explosao  from '../components/Explosao';
import useAcelerometro from '../hooks/useAcelerometro';
import useAsteroides from '../hooks/useAsteroides';
import useColisao from '../hooks/useColisao';
import useTiros from '../hooks/useTiros';
import useColisaoTiroAsteroide from '../hooks/useColisaoTiroAsteroide';
import useColisaoTiroInvasor from '../hooks/useColisaoTiroInvasor';
import { NAVE_Y } from '../utils/constants';
import { NAVES } from '../utils/constants';
import Sound from 'react-native-sound';
import Invasor from '../components/Invasor';
import useInvasores from '../hooks/useInvasores';

const GameScreen = ({ navigation }) => {
  const [perdeu, setPerdeu] = useState(false);
  const [naveAtual, setNaveAtual] = useState(NAVES.padrao);
  const [mostrarExplosao, setMostrarExplosao] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);

  const { x, xRef } = useAcelerometro(naveAtual.velocidade);
  const { asteroides, setAsteroides } = useAsteroides(perdeu);
  const { tiros, dispararTiro, setTiros } = useTiros(perdeu, xRef, naveAtual.intervaloTiro);
  const [vidas, setVidas] = useState(3);
  const musicaFundo = useRef(null);
  const { invasores, setInvasores } = useInvasores(perdeu);


    useColisao(asteroides, xRef, vidas, setVidas, setMostrarExplosao);
  useColisaoTiroAsteroide( tiros, setTiros, asteroides, setAsteroides, pontuacao, setPontuacao );
  useColisaoTiroInvasor(tiros, setTiros, invasores, setInvasores, pontuacao, setPontuacao);


  useEffect(() => {
    if(vidas === 0) setPerdeu(true);

    musicaFundo.current = new Sound(require('../assets/musica-fundo.mp3'), (error) => {
      if (error) {
        console.log('Erro ao carregar música de fundo', error);
        return;
      }
      musicaFundo.current.setNumberOfLoops(-1); // Loop infinito
      musicaFundo.current.play();
    });

    return () => {
      musicaFundo.current.stop(() => {
        musicaFundo.current.release();
      });
    };
}, [vidas]);

  const trocarNave = () => {
    setNaveAtual((prev) => (prev.id === 'padrao' ? NAVES.leve : NAVES.padrao));
  };

  return (
    <TouchableWithoutFeedback onPress={dispararTiro}>
      <View style={styles.container}>
        <StarMap />

        {/* Pontuação no canto superior esquerdo */}
        <View style={styles.pontuacaoContainer}>
          <Text style={styles.pontuacaoTexto}>Pontos: {pontuacao}</Text>
        </View>

        <View style={styles.vidasContainer}>
          {[...Array(vidas)].map((_, i) => (
            <Text key={i} style={styles.vida}>❤️</Text>
          ))}
        </View>

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
        {invasores.map(({ id, x, y, size, hp }) => (
          <Invasor key={id} x={x} y={y} size={size} hp={hp} />
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
            <Text style={styles.textoModal}>Pontuação: {pontuacao}</Text>
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
  vidasContainer: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    zIndex: 1,
  },
  vida: {
    fontSize: 18,
    marginHorizontal: 2,
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
  pontuacaoContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  pontuacaoTexto: {
    color: 'white',
    fontSize: 16,
  },
});

export default GameScreen;

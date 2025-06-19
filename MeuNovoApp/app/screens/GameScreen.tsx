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
import AsteroideForte from '../components/AsteroideForte';
import Explosao  from '../components/Explosao';
import useAcelerometro from '../hooks/useAcelerometro';
import useAsteroides from '../hooks/useAsteroides';
import useAsteroidesFortes from '../hooks/useAsteroidesFortes';
import useColisao from '../hooks/useColisao';
import useTiros from '../hooks/useTiros';
import useColisaoTiroAsteroide from '../hooks/useColisaoTiroAsteroide';
import useColisaoTiroAsteroideForte from '../hooks/useColisaoTiroAsteroideForte';
import useColisaoTiroInvasor from '../hooks/useColisaoTiroInvasor';
import { NAVE_Y } from '../utils/constants';
import { NAVES } from '../utils/constants';
import Sound from 'react-native-sound';
import Invasor from '../components/Invasor';
import useInvasores from '../hooks/useInvasores';
import Escudo from '../components/Escudo';

const GameScreen = ({ navigation }) => {
const [perdeu, setPerdeu] = useState(false);
const [escudoAtivo, setEscudoAtivo] = useState(false);
const [naveAtual, setNaveAtual] = useState(NAVES.padrao);
const [mostrarExplosao, setMostrarExplosao] = useState(false);
const [pontuacao, setPontuacao] = useState(0);

const {x, xRef} = useAcelerometro(naveAtual.velocidade);
const {asteroides, setAsteroides} = useAsteroides(perdeu);
const {asteroidesFortes, setAsteroidesFortes} = useAsteroidesFortes(perdeu);
const {tiros, dispararTiro, setTiros} = useTiros(perdeu, xRef, naveAtual.intervaloTiro);
const [vidas, setVidas] = useState(3);
const musicaFundo = useRef(null);
const {invasores, setInvasores} = useInvasores(perdeu, pontuacao);
const [escudos, setEscudos] = useState([]);
const [proxPontuacaoEscudo, setProxPontuacaoEscudo] = useState(20);
const escudoOpacity = useRef(new Animated.Value(0.2)).current;

useColisao(asteroidesFortes, setAsteroidesFortes, asteroides, setAsteroides, invasores, setInvasores, escudos, setEscudos, xRef, vidas, setVidas, setMostrarExplosao, escudoAtivo, setEscudoAtivo);
useColisaoTiroAsteroide( tiros, setTiros, asteroides, setAsteroides, pontuacao, setPontuacao );
useColisaoTiroAsteroideForte( tiros, setTiros, asteroidesFortes, setAsteroidesFortes, pontuacao, setPontuacao );
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

    useEffect(() => {
      if (escudoAtivo) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(escudoOpacity, {
              toValue: 0.6,
              duration: 800,
              useNativeDriver: false,
            }),
            Animated.timing(escudoOpacity, {
              toValue: 0.2,
              duration: 800,
              useNativeDriver: false,
            }),
          ])
        ).start();
      } else {
        escudoOpacity.setValue(0.2);
      }
    }, [escudoAtivo]);

    useEffect(() => {
      if (pontuacao >= proxPontuacaoEscudo) {
        const size = 40;
        //const startX = Math.random() * (Dimensions.get('window').width - size);
        const startX = (Dimensions.get('window').width - size) / 2;
        const animY = new Animated.Value(0);
        const id = Date.now() + Math.random();

        setEscudos((prev) => [
          ...prev,
          { id, x: startX, y: animY, size }
        ]);

        Animated.timing(animY, {
          toValue: Dimensions.get('window').height,
          duration: 6000,
          useNativeDriver: true,
        }).start(() => {
          setEscudos((prev) => prev.filter((e) => e.id !== id));
        });

        setProxPontuacaoEscudo((prev) => prev + 200); // próxima meta
      }
    }, [pontuacao]);

  return (
    <TouchableWithoutFeedback onPress={dispararTiro}>
      <View style={styles.container}>
        <StarMap />

        <View style={styles.pontuacaoContainer}>
          <Text style={styles.pontuacaoTexto}>Pontos: {pontuacao}</Text>
        </View>
        <View style={styles.vidasContainer}>
          {[...Array(vidas)].map((_, i) => (
            <Text key={i} style={styles.vida}>❤️</Text>
          ))}
        </View>

        {escudoAtivo && (
          <Animated.View
            style={{
                position: 'absolute',
                top: NAVE_Y - 10,
                left: Animated.add(x, new Animated.Value(-10)),
                width: naveAtual.size + 20,
                height: naveAtual.size + 20,
                borderRadius: (naveAtual.size + 20) / 2,
                backgroundColor: escudoOpacity.interpolate({
                    inputRange: [0.2, 0.6],
                    outputRange: ['rgba(173, 216, 230, 0.2)', 'rgba(135, 206, 250, 0.6)'],
                }),
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 0, 0.9)',
                zIndex: 2,
            }}
          />
        )}

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
        {asteroidesFortes.map(({ id, x, y, size, hp }) => (
          <AsteroideForte key={id} x={x} y={y} size={size} hp={hp} />
        ))}
        {invasores.map(({ id, x, y, size, hp }) => (
          <Invasor key={id} x={x} y={y} size={size} hp={hp} />
        ))}
        {escudos.map(({ id, x, y, size }) => (
          <Escudo key={id} x={x} y={y} size={size} />
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

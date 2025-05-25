import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const NAVE_SIZE = 60;
export const NAVE_Y = height - 40 - NAVE_SIZE;

export const NAVES = {
  padrao: {
    id: 'padrao',
    size: 80,
    velocidade: 1,
    intervaloTiro: 200,
    imagem: require('../assets/nave.png'),
  },
  leve: {
    id: 'leve',
    size: 40,
    velocidade: 0.7,
    intervaloTiro: 1000,
    imagem: require('../assets/nave2.png'),
  },
};

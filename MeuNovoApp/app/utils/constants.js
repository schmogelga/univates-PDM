import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const NAVE_SIZE = 60;
export const NAVE_Y = height - 40 - NAVE_SIZE;

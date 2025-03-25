import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationData } from '../types';

const LOCATIONS_STORAGE_KEY = 'savedLocations';

export async function saveLocations(locations: LocationData[]): Promise<void> {
  try {
    await AsyncStorage.setItem(LOCATIONS_STORAGE_KEY, JSON.stringify(locations));
  } catch (error) {
    console.error('Erro ao salvar localizações:', error);
    throw error;
  }
}

export async function getLocations(): Promise<LocationData[]> {
  try {
    const savedLocations = await AsyncStorage.getItem(LOCATIONS_STORAGE_KEY);
    return savedLocations ? JSON.parse(savedLocations) : [];
  } catch (error) {
    console.error('Erro ao carregar localizações:', error);
    throw error;
  }
}

export async function clearAllLocations(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LOCATIONS_STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar localizações:', error);
    throw error;
  }
}
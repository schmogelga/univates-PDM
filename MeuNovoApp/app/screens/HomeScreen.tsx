import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import Header from '../components/Header';
import LocationItem from '../components/LocationItem';
import { requestLocationPermission, getCurrentLocation } from '../services/location';
import { initDB, saveLocation, getLocations, clearLocations } from '../storage/sqliteStorage';
import { LocationData } from '../types';
import RNFS from 'react-native-fs';
import { requestStoragePermission } from '../services/permissions';


export default function HomeScreen() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {

      const checkPermission = async () => {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
          console.log("Permissão negada! O app não pode salvar arquivos.");
        } else {
          console.log("Permissão concedida!");
        }
      };

      checkPermission();

    initDB();
    loadSavedLocations();
    setupLocation();
  }, []);

  const setupLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setErrorMsg('Permissão para acessar a localização foi negada');
        return;
      }
      refreshLocation();
    } catch (error) {
      console.error('Erro ao configurar localização:', error);
      setErrorMsg('Erro ao configurar serviços de localização');
    }
  };

const loadSavedLocations = async () => {
  try {
    const savedLocations = await getLocations();
    console.log('Localizações salvas:', savedLocations);
    if (savedLocations) {
      setLocations(savedLocations);
    } else {
      console.log('Nenhuma localização encontrada.');
    }
  } catch (error) {
    console.error('Erro ao carregar localizações salvas:', error);
    Alert.alert('Erro', 'Não foi possível carregar as localizações salvas');
  }
};

  const refreshLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter sua localização atual');
    }
  };

  const handleSaveLocation = async () => {
    if (currentLocation) {
      try {
        const timestamp = new Date().toISOString();
        const newLocation: LocationData = {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          timestamp,
        };

          const id = `${newLocation.latitude}-${newLocation.longitude}-${timestamp}`;
          await saveLocation(id, newLocation.latitude, newLocation.longitude, newLocation.timestamp);

        setLocations([...locations, newLocation]);
        Alert.alert('Sucesso', 'Localização salva com sucesso!');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar a localização');
      }
    } else {
      Alert.alert('Erro', 'Nenhuma localização disponível para salvar');
    }
  };

  const handleClearLocations = async () => {
    try {
      await clearLocations();
      setLocations([]);
      Alert.alert('Sucesso', 'Todas as localizações foram removidas!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível limpar as localizações');
    }
  };

const saveLocationsToJSON = async () => {
  try {
    const savedLocations = await getLocations();
    console.log('Localizações carregadas:', savedLocations);

    if (!savedLocations || savedLocations.length === 0) {
      throw new Error('Nenhuma localização salva encontrada.');
    }

    const jsonData = JSON.stringify(savedLocations, null, 2);
    const path = `${RNFS.ExternalDirectoryPath}/locations.json`;

    await RNFS.writeFile(path, jsonData, 'utf8');

    console.log('Arquivo JSON salvo em:', path);
    Alert.alert('Sucesso', 'Localizações salvas em arquivo JSON!');
  } catch (error) {
    console.error('Erro ao salvar localizações em arquivo JSON:', error);
    Alert.alert('Erro', 'Não foi possível salvar as localizações em JSON');
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <Header title="Captura de Coordenadas Geográficas" />

      <View style={styles.currentLocationContainer}>
        <Text style={styles.sectionTitle}>Localização Atual:</Text>
        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : currentLocation ? (
          <Text style={styles.locationText}>
            {currentLocation.longitude}, {currentLocation.latitude}
          </Text>
        ) : (
          <Text style={styles.locationText}>Carregando localização...</Text>
        )}

        <View style={styles.buttonContainer}>
          <Button title="Atualizar" onPress={refreshLocation} />
          <Button title="Salvar" onPress={handleSaveLocation} />
        </View>
      </View>

      <View style={styles.savedLocationsContainer}>
        <View style={styles.savedHeaderRow}>
          <Text style={styles.sectionTitle}>Localizações Salvas:</Text>
          <Button title="Limpar" color="red" onPress={handleClearLocations} />
        </View>

        <ScrollView style={styles.scrollView}>
          {locations && locations.length > 0 ? (
            locations.map((location, index) => (
              <LocationItem key={index} location={location} />
            ))
          ) : (
            <Text style={styles.noLocationsText}>Nenhuma localização salva ainda.</Text>
          )}
        </ScrollView>

        <Button title="Salvar em JSON" onPress={saveLocationsToJSON} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  currentLocationContainer: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  savedLocationsContainer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  savedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  noLocationsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

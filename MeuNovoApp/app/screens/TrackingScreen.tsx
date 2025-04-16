import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, TextInput, Alert, Image } from 'react-native';
import { getCurrentLocation } from '../services/location';
import { saveRoute, initDB, checkTableStructure } from '../storage/sqliteStorage';
import { launchImageLibrary } from 'react-native-image-picker';


export default function TrakingScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [route, setRoute] = useState([]);
    const [routeName, setRouteName] = useState(''); // Estado para armazenar o nome da rota
    const [imageUri, setImageUri] = useState<string | null>(null); // Estado para imagem
  const trackingInterval = useRef<any>(null);

  useEffect(() => {
    initDB();
    checkTableStructure('routes');
    checkTableStructure('route_points');
  }, []);

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('Seleção de imagem cancelada');
      } else if (response.errorMessage) {
        console.error('Erro ao selecionar imagem:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        console.log('Imagem selecionada:', uri);
        setImageUri(uri || null);
      }
    });
  };

  const startTracking = () => {
    setRoute([]);  // Limpa a rota anterior
    setIsTracking(true);
    trackingInterval.current = setInterval(async () => {
      try {
        const location = await getCurrentLocation();

        const timestamp = new Date().toISOString(); // ou Date.now() para timestamp em milissegundos
        const locationWithTimestamp = { ...location, timestamp };
        console.log('Localização coletada:', locationWithTimestamp);

        setRoute((prevRoute) => [...prevRoute, locationWithTimestamp]); // Adiciona a nova localização ao array de pontos
      } catch (error) {
        console.error('Erro ao obter localização:', error);
      }
    }, 1000); // Coleta a localização a cada 5 segundos
  };

const stopTracking = async () => {
    setIsTracking(false);  // Interrompe o rastreamento
    if (trackingInterval.current) {
      clearInterval(trackingInterval.current);  // Limpa o intervalo
      trackingInterval.current = null;
    }

    // Verifica se há pontos de localização antes de salvar
    if (route.length > 0) {
      try {
        const startTime = new Date().toISOString();
        const endTime = new Date().toISOString();
        const routeId = `route-${startTime}`;  // Usando o tempo de início como identificador de rota

        // Salva a rota com os pontos no banco
      await saveRoute(routeId, routeName || 'Rota sem nome', startTime, endTime, route, imageUri);

        Alert.alert('Sucesso', 'Rota salva com sucesso!');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar a rota');
      }
    } else {
      Alert.alert('Aviso', 'Nenhuma localização registrada para esta rota');
    }
  };


  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>{isTracking ? 'Gravando rota...' : 'Pressione para iniciar'}</Text>

      {!isTracking && (
        <>
          <TextInput
            placeholder="Digite o nome da rota"
            value={routeName}
            onChangeText={setRouteName}
            style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
          />
          <Button title="Selecionar Imagem" onPress={selectImage} />
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{ width: '100%', height: 200, marginTop: 10, borderRadius: 10 }}
              resizeMode="cover"
            />
          )}
        </>
      )}

      <Button title="Iniciar Rota" onPress={startTracking} disabled={isTracking} />
      <Button title="Finalizar Rota" onPress={stopTracking} disabled={!isTracking} />
    </View>
  );
}


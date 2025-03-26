import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, TextInput, Alert } from 'react-native';
import { getCurrentLocation } from '../services/location';
import { saveRoute, initDB, checkTableStructure } from '../storage/sqliteStorage';


export default function TrakingScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [route, setRoute] = useState([]);
    const [routeName, setRouteName] = useState(''); // Estado para armazenar o nome da rota
  const trackingInterval = useRef<any>(null);

  useEffect(() => {
    initDB();
    checkTableStructure('routes');
    checkTableStructure('route_points');
  }, []);

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
    }, 5000); // Coleta a localização a cada 5 segundos
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
      await saveRoute(routeId, routeName || 'Rota sem nome', startTime, endTime, route);

        Alert.alert('Sucesso', 'Rota salva com sucesso!');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar a rota');
      }
    } else {
      Alert.alert('Aviso', 'Nenhuma localização registrada para esta rota');
    }
  };


  return (
  <View style={{ paddingTop: 40 }}>
      <Text>{isTracking ? 'Gravando rota...' : 'Pressione para iniciar'}</Text>
      {!isTracking && (
        <TextInput
          placeholder="Digite o nome da rota"
          value={routeName}
          onChangeText={setRouteName} // Atualiza o nome da rota
          style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
        />
      )}
      <Button title="Iniciar Rota" onPress={startTracking} disabled={isTracking} />
      <Button title="Finalizar Rota" onPress={stopTracking} disabled={!isTracking} />
    </View>
  );
}


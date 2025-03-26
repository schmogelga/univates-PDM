import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import { getCurrentLocation } from '../services/location';
import { saveRoute, initDB, checkTableStructure } from '../storage/sqliteStorage';


export default function HomeScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [route, setRoute] = useState([]);
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
        await saveRoute(routeId, 'Rota de Teste', startTime, endTime, route);

        Alert.alert('Sucesso', 'Rota salva com sucesso!');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar a rota');
      }
    } else {
      Alert.alert('Aviso', 'Nenhuma localização registrada para esta rota');
    }
  };


  return (
    <View>
      <Text>{isTracking ? 'Gravando rota...' : 'Pressione para iniciar'}</Text>
      <Button title="Iniciar Rota" onPress={startTracking} disabled={isTracking} />
      <Button title="Finalizar Rota" onPress={stopTracking} disabled={!isTracking} />
    </View>
  );
}


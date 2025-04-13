import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getRoutes } from '../storage/sqliteStorage';

const RoutesScreen = ({ navigation }) => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routesData = await getRoutes();
        setRoutes(routesData);
      } catch (error) {
        console.error('Erro ao carregar rotas:', error);
      }
    };

    fetchRoutes();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.routeItem}
      onPress={() => navigation.navigate('RouteMap', { routeId: item.id })} // Navega para a tela do mapa
    >
      <Text style={styles.routeName}>{item.name}</Text>
      <Text>{`Início: ${item.startTime}`}</Text>
      <Text>{`Fim: ${item.endTime}`}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rotas Registradas</Text>
      <FlatList
        data={routes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  routeItem: {
    padding: 12,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    borderRadius: 8,
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RoutesScreen;

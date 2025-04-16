import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Ou qualquer outra lib de ícones que você usa
import { getRoutes, deleteRoutesByIds } from '../storage/sqliteStorage';

const RoutesScreen = ({ navigation }) => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
const fetchRoutes = async () => {
  try {
    const routesData = await getRoutes();
    const routesWithSelection = routesData.map((route) => ({
      ...route,
      selected: false,
    }));
    setRoutes(routesWithSelection);
  } catch (error) {
    console.error('Erro ao carregar rotas:', error);
  }
};

    fetchRoutes();
  }, []);

const toggleSelection = (id) => {
  setRoutes((prevRoutes) =>
    prevRoutes.map((route) =>
      route.id === id ? { ...route, selected: !route.selected } : route
    )
  );
};

const handleDeleteSelected = async () => {
  const selectedRoutes = routes.filter((route) => route.selected);
  const idsToDelete = selectedRoutes.map((r) => r.id);

  try {
    await deleteRoutesByIds(idsToDelete);
    setRoutes((prevRoutes) =>
      prevRoutes.filter((route) => !route.selected)
    );
  } catch (error) {
    console.error('Erro ao deletar rotas:', error);
  }
};

const renderItem = ({ item }) => (
  <View style={styles.routeItem}>
    <Image
      source={
        item.imageUri
          ? { uri: item.imageUri }
          : require('../assets/map-thumbnail.jpg')
      }
      style={styles.image}
    />

    <TouchableOpacity
      style={styles.textContainer}
      onPress={() => navigation.navigate('RouteMap', { routeId: item.id })}
    >
      <Text style={styles.routeName}>{item.name}</Text>
      <Text style={styles.detailText}>Início: {item.startTime}</Text>
      <Text style={styles.detailText}>Fim: {item.endTime}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => toggleSelection(item.id)}
      style={styles.iconContainer}
    >
      <Icon
        name={item.selected ? 'check-square' : 'square'}
        size={24}
        color={item.selected ? '#4CAF50' : '#aaa'}
      />
    </TouchableOpacity>
  </View>
);


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rotas Registradas</Text>
      {routes.some((route) => route.selected) && (
        <TouchableOpacity onPress={handleDeleteSelected} style={styles.trashButton}>
          <Icon name="trash-2" size={24} color="#D32F2F" />
        </TouchableOpacity>
      )}
      <FlatList
        data={routes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
  trashButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  routeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 14,
    color: '#555',
  },
  iconContainer: {
    paddingLeft: 10,
  },
});

export default RoutesScreen;

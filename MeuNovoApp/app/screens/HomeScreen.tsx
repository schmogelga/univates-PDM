import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Bem-vindo ao aplicativo!</Text>
      <Button
        title="Ir para Rastreamento"
        onPress={() => navigation.navigate('Tracking')}
      />
      <Button
        title="Ir para Listagem de Rotas"
        onPress={() => navigation.navigate('Routes')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default HomeScreen;
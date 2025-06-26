import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';

interface Props {
  navigation: any;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');

  const iniciarJogo = () => {
    if (nome.trim().length === 0) return;
    setModalVisible(false);
    navigation.navigate('Game', { nome });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Jogo!</Text>

      <Button title="Iniciar Jogo" onPress={() => setModalVisible(true)} />
      <Button title="Leaderboard" onPress={() => navigation.navigate('Ranking')} />

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Digite seu nome:</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#aaa"
              onChangeText={setNome}
              value={nome}
            />
            <TouchableOpacity style={styles.botao} onPress={iniciarJogo}>
              <Text style={styles.botaoTexto}>Começar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    marginBottom: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#000a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  botao: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelar: {
    marginTop: 10,
    color: '#bbb',
    textAlign: 'center',
  },
});

export default HomeScreen;

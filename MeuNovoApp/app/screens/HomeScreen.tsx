import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import StarMap from '../components/StarMap';

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
    <View style={styles.starMapWrapper}>
    <StarMap />
    </View>
      <Text style={styles.title}>Bem-vindo ao Jogo!</Text>

      <TouchableOpacity style={styles.arcadeButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.arcadeButtonText}>Iniciar Jogo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.arcadeButton} onPress={() => navigation.navigate('Ranking')}>
        <Text style={styles.arcadeButtonText}>Leaderboard</Text>
      </TouchableOpacity>

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
            <TouchableOpacity style={styles.arcadeButton} onPress={iniciarJogo}>
              <Text style={styles.arcadeButtonText}>Começar</Text>
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
  position: 'relative', // garante empilhamento correto
},

starMapWrapper: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -999,
},

  title: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  arcadeButton: {
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 8,
  },
  arcadeButtonText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    textAlign: 'center',
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
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontFamily: 'PressStart2P-Regular',
    fontSize: 10,
  },
  cancelar: {
    marginTop: 10,
    color: '#bbb',
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
  },
});

export default HomeScreen;

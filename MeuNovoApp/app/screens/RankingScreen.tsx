import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { buscarRanking } from '../storage/LeaderboardStorage';

interface Pontuacao {
  id: number;
  nome: string;
  pontos: number;
}

interface Props {
  navigation: any;
}

const RankingScreen: React.FC<Props> = ({ navigation }) => {
  const [ranking, setRanking] = useState<Pontuacao[]>([]);

  useEffect(() => {
    const carregarRanking = async () => {
      const dados = await buscarRanking();
      console.log(dados);
      setRanking(dados);
    };

    carregarRanking();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RANKING</Text>
      <FlatList
        data={ranking}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <Text style={styles.item}>
            {index + 1}. {item.nome} - {item.pontos} pts
          </Text>
        )}
      />

      <TouchableOpacity style={styles.arcadeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.arcadeButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'PressStart2P-Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    marginVertical: 6,
  },
  arcadeButton: {
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 24,
    alignItems: 'center',
  },
  arcadeButtonText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'PressStart2P-Regular',
    textAlign: 'center',
  },
});

export default RankingScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { buscarRanking } from '../storage/LeaderboardStorage';

interface Pontuacao {
  id: number;
  nome: string;
  pontuacao: number;
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
      <Text style={styles.title}>Ranking</Text>
      <FlatList
        data={ranking}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <Text style={styles.item}>
            {index + 1}. {item.nome} - {item.pontos} pts
          </Text>
        )}
      />
      <Button title="Voltar" onPress={() => navigation.goBack()} />
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
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    color: '#fff',
    fontSize: 18,
    marginVertical: 6,
  },
});

export default RankingScreen;

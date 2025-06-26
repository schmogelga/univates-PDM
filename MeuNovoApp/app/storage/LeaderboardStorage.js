import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db: SQLiteDatabase | null = null;

export const initDB = async (): Promise<void> => {
  if (db !== null) return;

  try {
    db = await SQLite.openDatabase({ name: 'leaderboard.db', location: 'default' });
    console.log('Banco de dados aberto com sucesso!');

    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        pontos INTEGER NOT NULL
      );`
    );

    console.log('Tabela "leaderboard" pronta.');
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
    throw error;
  }
};

export const salvarPontuacao = async (nome: string, pontos: number): Promise<void> => {
  if (!db) await initDB();

  try {
    await db.executeSql(
      'INSERT INTO leaderboard (nome, pontos) VALUES (?, ?);',
      [nome, pontos]
    );
    console.log(`Pontuação salva: ${nome} - ${pontos}`);
  } catch (error) {
    console.error('Erro ao salvar pontuação:', error);
    throw error;
  }
};

export interface RankingItem {
  id: number;
  nome: string;
  pontos: number;
}

export const buscarRanking = async (limit = 10): Promise<RankingItem[]> => {
  if (!db) await initDB();

  try {
    const [results] = await db.executeSql(
      'SELECT * FROM leaderboard ORDER BY pontos DESC LIMIT ?;',
      [limit]
    );
    const ranking: RankingItem[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      ranking.push(results.rows.item(i));
    }
    return ranking;
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    throw error;
  }
};

export const limparRanking = async (): Promise<void> => {
  if (!db) await initDB();

  try {
    await db.executeSql('DELETE FROM leaderboard;');
    console.log('Ranking limpo com sucesso.');
  } catch (error) {
    console.error('Erro ao limpar ranking:', error);
    throw error;
  }
};

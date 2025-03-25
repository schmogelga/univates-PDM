import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'locations.db', location: 'default' },
  () => console.log('Banco de dados aberto com sucesso!'),
  error => console.error('Erro ao abrir banco de dados:', error)
);

export const initDB = () => {
  return new Promise<void>((resolve, reject) => {
    console.log('🔹 Iniciando Banco de Dados SQLite...');
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS locations (
          id TEXT PRIMARY KEY NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          timestamp TEXT NOT NULL
        );`,
        [],
        () => {
          console.log('Banco de dados inicializado');
          resolve();
        },
        (_, error) => {
          console.error('Erro ao criar tabela:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const saveLocation = (id: string, latitude: number, longitude: number, timestamp: string) => {
  return new Promise<void>((resolve, reject) => {
    console.log('Tentando salvar localização com os seguintes dados:');
    console.log('ID:', id);
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);
    console.log('Timestamp:', timestamp);

    db.transaction(tx => {
      console.log('Executando SQL: INSERT INTO locations (id, latitude, longitude, timestamp) VALUES (?, ?, ?, ?);');

      tx.executeSql(
        'INSERT INTO locations (id, latitude, longitude, timestamp) VALUES (?, ?, ?, ?);',
        [id, latitude, longitude, timestamp],
        () => {
          console.log('Localização salva com sucesso!');
          resolve();
        },
        (_, error) => {
          console.error('Erro ao executar SQL:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};


export const getLocations = () => {
  return new Promise<{ id: string; latitude: number; longitude: number; timestamp: string }[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM locations;',
        [],
        (_, result) => {
          const rows = result.rows;
          console.log('Resultado da consulta:', rows);

          if (rows && rows.length > 0) {
            resolve(rows.raw());
          } else {
            console.error('Não há dados na consulta');
            reject('Sem dados');
          }
        },
        (_, error) => {
          console.error('Erro ao buscar localizações:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const clearLocations = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM locations;',
        [],
        () => resolve(),
        (_, error) => {
          console.error('Erro ao limpar localizações:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

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
      // Verifica a existência e estrutura da tabela 'routes'
      tx.executeSql(
        `PRAGMA table_info(routes);`,
        [],
        (_, result) => {
          if (result.rows.length === 0) {
            // Tabela não existe ainda: cria com a coluna imageUri
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS routes (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                startTime TEXT NOT NULL,
                endTime TEXT NOT NULL,
                imageUri TEXT
              );`,
              [],
              () => {
                console.log('Tabela "routes" criada com sucesso.');
              },
              (_, error) => {
                console.error('Erro ao criar tabela "routes":', error);
                reject(error);
                return false;
              }
            );
          } else {
            console.log('Tabela "routes" já existe, verificando coluna "imageUri"...');

            const hasImageUri = Array.from({ length: result.rows.length }).some((_, i) => {
              return result.rows.item(i).name === 'imageUri';
            });

            if (!hasImageUri) {
              tx.executeSql(
                `ALTER TABLE routes ADD COLUMN imageUri TEXT;`,
                [],
                () => {
                  console.log('Coluna "imageUri" adicionada com sucesso à tabela "routes".');
                },
                (_, error) => {
                  console.error('Erro ao adicionar coluna "imageUri":', error);
                  reject(error);
                  return false;
                }
              );
            } else {
              console.log('Coluna "imageUri" já existe.');
            }
          }

          // Verifica a existência e estrutura da tabela 'route_points'
          tx.executeSql(
            `PRAGMA table_info(route_points);`,
            [],
            (_, result) => {
              if (result.rows.length === 0) {
                tx.executeSql(
                  `CREATE TABLE IF NOT EXISTS route_points (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    routeId TEXT NOT NULL,
                    latitude REAL NOT NULL,
                    longitude REAL NOT NULL,
                    timestamp TEXT NOT NULL,
                    FOREIGN KEY (routeId) REFERENCES routes(id) ON DELETE CASCADE
                  );`,
                  [],
                  () => {
                    console.log('Tabela "route_points" criada com sucesso.');
                    resolve();
                  },
                  (_, error) => {
                    console.error('Erro ao criar tabela "route_points":', error);
                    reject(error);
                    return false;
                  }
                );
              } else {
                console.log('Tabela "route_points" já existe e sua estrutura foi verificada.');
                resolve();
              }
            },
            (_, error) => {
              console.error('Erro ao verificar a tabela "route_points":', error);
              reject(error);
              return false;
            }
          );
        },
        (_, error) => {
          console.error('Erro ao verificar a tabela "routes":', error);
          reject(error);
          return false;
        }
      );
    });
  });
};



export const checkTableStructure = (tableName: string) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `PRAGMA table_info(${tableName});`, // Comando para obter a estrutura da tabela
        [],
        (_, result) => {
          if (result.rows.length === 0) {
            console.log(`A tabela "${tableName}" não existe.`);
            resolve(); // Tabela não existe, mas não há erro
          } else {
            console.log(`Estrutura da tabela "${tableName}":`);
            // Itera sobre as colunas e imprime os detalhes
            for (let i = 0; i < result.rows.length; i++) {
              const column = result.rows.item(i);
              console.log(`Nome: ${column.name}, Tipo: ${column.type}, Pode ser Nulo: ${column.notnull ? 'Não' : 'Sim'}`);
            }
            resolve(); // Tabela existe e estrutura foi verificada
          }
        },
        (_, error) => {
          console.error(`Erro ao verificar a tabela "${tableName}":`, error);
          reject(error); // Rejeita se houver erro na execução da consulta
        }
      );
    });
  });
};

export const deleteRoutesByIds = (ids: string[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (ids.length === 0) {
      resolve();
      return;
    }

    const placeholders = ids.map(() => '?').join(','); // ?, ?, ?
    const query = `DELETE FROM routes WHERE id IN (${placeholders});`;

    db.transaction(tx => {
      tx.executeSql(
        query,
        ids,
        () => {
          console.log(`Rotas deletadas com sucesso: ${ids.join(', ')}`);
          resolve();
        },
        (_, error) => {
          console.error('Erro ao deletar rotas:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};


export const saveRoute = (routeId: string, name: string, startTime: string, endTime: string, points: any[], imageUri?: string | null) => {
  return new Promise((resolve, reject) => {
    console.log('Iniciando o salvamento da rota...');
    console.log(`Dados da rota: ID: ${routeId}, Nome: ${name}, Início: ${startTime}, Fim: ${endTime}, Imagem: ${imageUri}`);

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO routes (id, name, startTime, endTime, imageUri) VALUES (?, ?, ?, ?, ?);',
        [routeId, name, startTime, endTime, imageUri || null],
        (_, result) => {
          console.log('Rota inserida com sucesso na tabela routes!');
          console.log('Resultado da inserção da rota:', result);

          // Para cada ponto da rota, insere os dados na tabela de pontos da rota
          points.forEach((point, index) => {
            console.log(point);
            console.log(`Inserindo ponto ${index + 1}: Latitude: ${point.latitude}, Longitude: ${point.longitude}, Timestamp: ${point.timestamp}`);
            tx.executeSql(
              'INSERT INTO route_points (routeId, latitude, longitude, timestamp) VALUES (?, ?, ?, ?);',
              [routeId, point.latitude, point.longitude, point.timestamp],
              (_, pointResult) => {
                console.log(`Ponto ${index + 1} salvo com sucesso: Latitude: ${point.latitude}, Longitude: ${point.longitude}`);
              },
              (_, pointError) => {
                console.error(`Erro ao salvar ponto ${index + 1}:`, pointError);
                reject(pointError); // Falha ao salvar ponto
              }
            );
          });

          resolve(result); // Rota salva com sucesso
        },
        (_, error) => {
          console.error('Erro ao inserir rota na tabela routes:', error);
          reject(error); // Falha ao salvar a rota
        }
      );
    });
  });
};

export const getRoutes = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    console.log('Buscando rotas registradas...');

    db.transaction(tx => {
      // Busca todas as rotas da tabela 'routes'
      tx.executeSql(
        'SELECT * FROM routes;',
        [],
        (_, result) => {
          const routesList: any[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            routesList.push(result.rows.item(i));
          }
          console.log('Rotas encontradas:', routesList);
          resolve(routesList); // Retorna a lista de rotas
        },
        (_, error) => {
          console.error('Erro ao buscar rotas:', error);
          reject(error); // Rejeita em caso de erro
        }
      );
    });
  });
};

export const getRoutePoints = (routeId: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    console.log(`Buscando pontos da rota com ID: ${routeId}...`);

    db.transaction(tx => {
      // Busca os pontos da rota com base no ID da rota
      tx.executeSql(
        'SELECT * FROM route_points WHERE routeId = ?;',
        [routeId],
        (_, result) => {
          const pointsList: any[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            pointsList.push(result.rows.item(i));
          }
          console.log('Pontos encontrados:', pointsList);
          resolve(pointsList); // Retorna os pontos da rota
        },
        (_, error) => {
          console.error('Erro ao buscar pontos da rota:', error);
          reject(error); // Rejeita em caso de erro
        }
      );
    });
  });
};




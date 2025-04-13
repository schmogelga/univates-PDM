import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import AppNavigator from './navigation';

const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permissão para acessar armazenamento',
          message: 'Precisamos de acesso ao armazenamento para salvar os dados da rota.',
          buttonNeutral: 'Perguntar depois',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Ok',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permissão concedida.');
      } else {
        console.log('Permissão negada.');
      }
    } catch (err) {
      console.warn(err);
    }
  }
};


const App = () => {
  useEffect(() => {
    requestStoragePermission();
  }, []);

  return <AppNavigator />;
};

export default App;

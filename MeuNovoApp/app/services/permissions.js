import { PermissionsAndroid, Platform } from 'react-native';

export async function requestStoragePermission() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Permissão de Armazenamento",
          message: "O app precisa de permissão para salvar arquivos no dispositivo.",
          buttonNeutral: "Perguntar depois",
          buttonNegative: "Cancelar",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn("Erro ao solicitar permissão:", err);
      return false;
    }
  }
  return true;
}

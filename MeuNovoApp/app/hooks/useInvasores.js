import { useEffect, useState, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function useInvasores(perdeu, pontuacao) {
  const [invasores, setInvasores] = useState([]);
  const intervaloRef = useRef(null);
  const pontuacaoRef = useRef(pontuacao);

  useEffect(() => {
    pontuacaoRef.current = pontuacao;
  }, [pontuacao]);

  useEffect(() => {
    if (perdeu) return;

    const calcularSpawnInterval = (pontos) => {
      const minInterval = 4000;  // 4s
      const maxInterval = 10000; // 10s
      const maxPontos = 500;     // pontos max para efeito completo
      const pontosVal = pontos ?? 0;
      const intervalo = maxInterval - (maxInterval - minInterval) * Math.min(pontosVal, maxPontos) / maxPontos;
      return intervalo;
    };

    const calcularHP = (pontos) => {
      const minHP = 1;
      const maxHP = 5;
      const maxPontosHP = 400;
      const pontosVal = pontos ?? 0;
      const hp = Math.floor(minHP + (maxHP - minHP) * Math.min(pontosVal, maxPontosHP) / maxPontosHP);
      return hp;
    };

    const spawnInvasor = () => {
      if (perdeu) return;

      const id = Date.now();
      const y = new Animated.Value(0);
      const x = new Animated.Value(Math.random() * width);
      const duration = 4000 + Math.random() * 4000; // 4 a 8 segundos
      const hp = calcularHP(pontuacaoRef.current);

      const startTime = Date.now();
      const amplitudeX = 40 + Math.random() * 60;
      const freq = 0.001 + Math.random() * 0.0015;

        Animated.timing(y, {
          toValue: height + 100, // garante que saia completamente da tela
          duration,
          useNativeDriver: false,
        }).start(() => {
          setInvasores((prev) => prev.filter((inv) => inv.id !== id));
        });

      const updateX = () => {
        const elapsed = Date.now() - startTime;
        const newX = x.__getValue() + Math.sin(elapsed * freq) * amplitudeX * 0.1;
        const limitedX = Math.min(Math.max(newX, 0), width - 60);
        x.setValue(limitedX);

        if (elapsed < duration) {
          requestAnimationFrame(updateX);
        }
      };
      requestAnimationFrame(updateX);

      setInvasores((prev) => [
        ...prev,
        { id, x, y, size: 60, hp, maxHp: hp },
      ]);

      const proximoIntervalo = calcularSpawnInterval(pontuacaoRef.current);
      intervaloRef.current = setTimeout(spawnInvasor, proximoIntervalo);
    };

    spawnInvasor();

    return () => clearTimeout(intervaloRef.current);
  }, [perdeu]);

  return { invasores, setInvasores };
}

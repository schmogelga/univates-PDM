import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');
const TILE_SIZE = 30;
const COLS = Math.floor(width / TILE_SIZE);
const ROWS = Math.floor(height / TILE_SIZE);

const StarTile = ({ size, backgroundColor }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor,
    }}
  />
);

const generateStarsLayer = () => {
  const tiles = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (Math.random() > 0.7) {
        const size = Math.floor(Math.random() * 4) + 2;
        const opacity = Math.random() * 0.4 + 0.1;
        const colorChoices = [
          `rgba(255, 255, 255, ${opacity})`,
          `rgba(255, 255, 200, ${opacity})`,
          `rgba(200, 200, 255, ${opacity})`,
        ];
        const backgroundColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];

        tiles.push(
          <View
            key={`${row}-${col}`}
            style={{
              position: 'absolute',
              top: row * TILE_SIZE,
              left: col * TILE_SIZE,
              width: TILE_SIZE,
              height: TILE_SIZE,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <StarTile size={size} backgroundColor={backgroundColor} />
          </View>
        );
      }
    }
  }
  return tiles;
};

const StarMap = () => {
  const [starsLayer, setStarsLayer] = useState([]);
  const scrollAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setStarsLayer(generateStarsLayer());
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: height,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [scrollAnim]);

  // O primeiro fundo começa em translateY = 0 e desce até height
  const translateY = scrollAnim.interpolate({
    inputRange: [0, height],
    outputRange: [0, height],
  });

  return (
    <View style={styles.wrapper}>
      {/* Primeiro mapa de estrelas */}
      <Animated.View
        style={[
          styles.container,
          {
            height,
            transform: [{ translateY }],
          },
        ]}
      >
        {starsLayer}
      </Animated.View>

      {/* Segundo mapa de estrelas, posicionado acima do primeiro */}
      <Animated.View
        style={[
          styles.container,
          {
            height,
            position: 'absolute',
            top: -height,
            transform: [{ translateY }],
          },
        ]}
      >
        {starsLayer}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width,
    height,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  container: {
    width,
    position: 'absolute',
  },
});

export default StarMap;

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

const speedometerHand = `<svg width="20" height="95" viewBox="0 0 20 95" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.7246 84.7216L14.2377 7.08582C14.0346 3.57195 11.1198 0.82997 7.60004 0.841799C3.94041 0.854098 0.983654 3.83078 0.995953 7.49042L1.25731 85.2553C1.27353 90.0828 5.20013 93.9831 10.0276 93.9669C15.0417 93.95 19.014 89.7274 18.7246 84.7216Z" fill="url(#paint0_linear_2019_688)"/>
<circle cx="10.4192" cy="85.1045" r="8.64804" transform="rotate(-0.19256 10.4192 85.1045)" fill="url(#paint1_radial_2019_688)"/>
<defs>
<linearGradient id="paint0_linear_2019_688" x1="4.28424" y1="1.4181" x2="5.30849" y2="81.0091" gradientUnits="userSpaceOnUse">
<stop stop-color="#030303"/>
<stop offset="1" stop-opacity="0"/>
</linearGradient>
<radialGradient id="paint1_radial_2019_688" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(10.4192 85.1045) rotate(90) scale(8.64804)">
<stop stop-color="#D9D9D9"/>
<stop offset="1" stop-color="white"/>
</radialGradient>
</defs>
</svg>`;

interface SpeedometerHandProps {
  value: number; // 0 to 100
}

const SpeedometerHand: React.FC<SpeedometerHandProps> = ({ value }) => {
  // Convert value to angle (0-180 degrees)
  const angle = (value / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <View style={styles.container}>
      <View style={[
        styles.hand,
        {
          transform: [
            { translateX: -10 }, // Half of SVG width
            { translateY: -85 }, // Most of SVG height to position pivot point
            { rotate: `${angle}deg` },
            { translateX: 10 }, // Restore position
            { translateY: 85 },
          ]
        }
      ]}>
        <SvgXml xml={speedometerHand} width={20} height={95} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '50%',
    bottom: '50%',
    width: 20,
    height: 95,
  },
  hand: {
    position: 'absolute',
    width: 20,
    height: 95,
  },
});

export default SpeedometerHand; 
import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { SvgXml } from 'react-native-svg';

const speedometerBase = `<svg width="190" height="148" viewBox="0 0 190 148" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M186.265 117.004C186.265 92.3035 176.453 68.6148 158.987 51.149C141.522 33.6833 117.833 23.8711 93.1327 23.8711C68.4324 23.8711 44.7437 33.6833 27.2779 51.149C9.81217 68.6148 3.72965e-06 92.3035 0 117.004L93.1327 117.004H186.265Z" fill="url(#paint0_linear_1_2923)"/>
<path d="M87.8104 117.668L1.33008 117.003L49.2269 42.4971L87.8104 117.668Z" fill="url(#paint1_linear_1_2923)" fill-opacity="0.34"/>
<path d="M91.8017 115.008L185.6 117.004L135.042 44.4932L91.8017 115.008Z" fill="url(#paint2_linear_1_2923)" fill-opacity="0.34"/>
<path d="M89.1414 119.665L47.2322 39.1715L137.038 41.1669L89.1414 119.665Z" fill="url(#paint3_linear_1_2923)" fill-opacity="0.34"/>
<path d="M0.000206506 117.004C0.000208666 92.3037 9.81238 68.615 27.2782 51.1493C44.7439 33.6835 68.4326 23.8713 93.1329 23.8713C117.833 23.8713 141.522 33.6835 158.988 51.1493C176.453 68.615 186.266 92.3037 186.266 117.004L169.245 117.004C169.245 96.8178 161.226 77.4584 146.952 63.1846C132.679 48.9108 113.319 40.8918 93.1329 40.8918C72.9467 40.8918 53.5873 48.9108 39.3135 63.1846C25.0397 77.4584 17.0207 96.8178 17.0207 117.004L0.000206506 117.004Z" fill="#FF284C"/>
<path d="M0.000206506 117.004C0.000207933 100.678 4.29171 84.6394 12.4445 70.4951C20.5973 56.3508 32.325 44.5981 46.4518 36.4151C60.5787 28.2321 76.6084 23.9064 92.9341 23.8715C109.26 23.8367 125.308 28.0939 139.47 36.2165L131.001 50.9809C119.428 44.3427 106.313 40.8635 92.9704 40.892C79.6284 40.9205 66.5282 44.4557 54.983 51.1432C43.4379 57.8306 33.8536 67.4355 27.1908 78.9948C20.5279 90.5542 17.0207 103.662 17.0207 117.004L0.000206506 117.004Z" fill="#FFC72C"/>
<path d="M0.000206506 117.004C0.000207918 100.85 4.20187 84.9741 12.1925 70.935C20.1832 56.8959 31.688 45.1766 45.5772 36.9281L54.2683 51.5624C42.9174 58.3035 33.5151 67.881 26.9848 79.3544C20.4545 90.8277 17.0207 103.802 17.0207 117.004L0.000206506 117.004Z" fill="#00FFA6"/>
<defs>
<linearGradient id="paint0_linear_1_2923" x1="93.1327" y1="23.8711" x2="93.1327" y2="103.699" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint1_linear_1_2923" x1="29.2699" y1="76.424" x2="83.1538" y2="112.347" gradientUnits="userSpaceOnUse">
<stop stop-color="#03BF69"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint2_linear_1_2923" x1="153.003" y1="79.0853" x2="99.1193" y2="115.008" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF284C"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
<linearGradient id="paint3_linear_1_2923" x1="96.2555" y1="43.7434" x2="92.0876" y2="108.37" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFC72C"/>
<stop offset="1" stop-color="white" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>`;

const speedometerHand = `<svg width="19" height="94" viewBox="0 0 19 94" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.469 83.9167L14.243 6.2663C14.0517 2.75176 11.1461 0 7.6264 0C3.96674 0 1 2.96673 1 6.62639V84.3917C1 89.2192 4.91347 93.1327 9.74097 93.1327C14.7551 93.1327 18.7415 88.9235 18.469 83.9167Z" fill="#D9D9D9"/>
<path d="M18.469 83.9167L14.243 6.2663C14.0517 2.75176 11.1461 0 7.6264 0C3.96674 0 1 2.96673 1 6.62639V84.3917C1 89.2192 4.91347 93.1327 9.74097 93.1327C14.7551 93.1327 18.7415 88.9235 18.469 83.9167Z" fill="url(#paint0_linear_2021_777)"/>
<circle cx="9.64804" cy="84.648" r="8.64804" fill="url(#paint1_radial_2021_777)"/>
<defs>
<linearGradient id="paint0_linear_2021_777" x1="-13.7332" y1="-7.11114" x2="-13.2008" y2="163.553" gradientUnits="userSpaceOnUse">
<stop stop-color="#030303"/>
<stop offset="1" stop-opacity="0"/>
</linearGradient>
<radialGradient id="paint1_radial_2021_777" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(9.64804 84.648) rotate(90) scale(8.64804)">
<stop stop-color="#D9D9D9"/>
<stop offset="1" stop-color="white"/>
</radialGradient>
</defs>
</svg>`;

interface SpeedometerProps {
  value: number; // 0 to 100
  size?: number;
  label?: string;
}

const Speedometer: React.FC<SpeedometerProps> = ({ value, size = 190, label }) => {
  const rotationAnim = new Animated.Value(0);

  useEffect(() => {
    // Map 0-100 to angles: 90 (left/green) to 0 (middle/yellow) to -90 (right/red)
    const targetRotation = 90 - (value * 180) / 100;

    Animated.spring(rotationAnim, {
      toValue: targetRotation,
      useNativeDriver: true,
      tension: 20,
      friction: 7,
    }).start();
  }, [value]);

  const scale = size / 190; // Calculate scale based on desired size

  return (
    <View style={[styles.container, { width: size, height: size * 0.8 }]}>
      {/* Base speedometer */}
      <SvgXml 
        xml={speedometerBase} 
        width={size} 
        height={size * 0.8} 
        style={styles.base}
      />
      
      {/* Hand */}
      <View style={styles.handWrapper}>
        <Animated.View style={[
          styles.handContainer,
          {
            transform: [
              { rotate: rotationAnim.interpolate({
                  inputRange: [-90, 90],
                  outputRange: ['-90deg', '90deg']
                })
              },
            ]
          }
        ]}>
          <SvgXml 
            xml={speedometerHand} 
            width={19 * scale} 
            height={94 * scale} 
          />
        </Animated.View>
      </View>
      
      {/* Label (if provided) */}
      {label && (
        <View style={styles.labelContainer}>
          <Animated.Text style={[
            styles.label,
            {
              fontSize: 28 * scale,
              color: value <= 33 ? '#00D087' : value <= 66 ? '#FFC72C' : '#FF284C'
            }
          ]}>
            {label}
          </Animated.Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  base: {
    position: 'absolute',
    bottom: 0,
  },
  handWrapper: {
    position: 'absolute',
    bottom: 31, // Adjust this to match the center point of the arc
    left: '50%',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handContainer: {
    position: 'absolute',
    bottom: 0,
    left: -9.5, // Half of the hand width to center it
    transformOrigin: '50% 100%', // Rotate from bottom center
  },
  labelContainer: {
    position: 'absolute',
    bottom: '25%',
    alignItems: 'center',
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Speedometer; 
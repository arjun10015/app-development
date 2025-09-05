import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Keyboard,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const conversions = {
  'Kilometers to Miles': {
    func: val => val * 0.621371,
    fromUnit: 'km',
    toUnit: 'mi',
  },
  'Miles to Kilometers': {
    func: val => val / 0.621371,
    fromUnit: 'mi',
    toUnit: 'km',
  },
  'Meters to Yards': {
    func: val => val * 1.09361,
    fromUnit: 'm',
    toUnit: 'yd',
  },
  'Yards to Meters': {
    func: val => val / 1.09361,
    fromUnit: 'yd',
    toUnit: 'm',
  },
  'Feet to Meters': {
    func: val => val * 0.3048,
    fromUnit: 'ft',
    toUnit: 'm',
  },
  'Meters to Feet': {
    func: val => val / 0.3048,
    fromUnit: 'm',
    toUnit: 'ft',
  },
  'Centimeters to Inches': {
    func: val => val * 0.393701,
    fromUnit: 'cm',
    toUnit: 'in',
  },
  'Inches to Centimeters': {
    func: val => val / 0.393701,
    fromUnit: 'in',
    toUnit: 'cm',
  },
  'Kilograms to Pounds': {
    func: val => val * 2.20462,
    fromUnit: 'kg',
    toUnit: 'lbs',
  },
  'Pounds to Kilograms': {
    func: val => val / 2.20462,
    fromUnit: 'lbs',
    toUnit: 'kg',
  },
  'Grams to Ounces': {
    func: val => val * 0.035274,
    fromUnit: 'g',
    toUnit: 'oz',
  },
  'Ounces to Grams': {
    func: val => val / 0.035274,
    fromUnit: 'oz',
    toUnit: 'g',
  },
  'Celsius to Fahrenheit': {
    func: val => (val * 9) / 5 + 32,
    fromUnit: '°C',
    toUnit: '°F',
  },
  'Fahrenheit to Celsius': {
    func: val => ((val - 32) * 5) / 9,
    fromUnit: '°F',
    toUnit: '°C',
  },
  'Liters to Gallons': {
    func: val => val * 0.264172,
    fromUnit: 'L',
    toUnit: 'gal',
  },
  'Gallons to Liters': {
    func: val => val / 0.264172,
    fromUnit: 'gal',
    toUnit: 'L',
  },
};

const units = Object.keys(conversions);

const { width } = Dimensions.get('window');

export default function StylishUnitConverter() {
  const [input, setInput] = useState('');
  const [selectedConversion, setSelectedConversion] = useState(units[0]);
  const [result, setResult] = useState(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onConvertPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 130,
        useNativeDriver: true,
      }),
    ]).start();

    const val = parseFloat(input);
    if (isNaN(val)) {
      setResult('Invalid input');
      return;
    }
    const { func, fromUnit, toUnit } = conversions[selectedConversion];
    const converted = func(val);
    setResult(
      `${val} ${fromUnit} = ${converted.toFixed(5)} ${toUnit}`
    );
    Keyboard.dismiss();
  };

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.appTitle}>Ultimate Unit Converter</Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Enter value…"
          placeholderTextColor="#a0abb8"
          keyboardType="decimal-pad"
          value={input}
          onChangeText={setInput}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedConversion}
            onValueChange={setSelectedConversion}
            style={styles.picker}
            dropdownIconColor="#00587a"
          >
            {units.map(unit => (
              <Picker.Item key={unit} label={unit} value={unit} />
            ))}
          </Picker>
        </View>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.convertBtn}
            activeOpacity={0.85}
            onPress={onConvertPress}
          >
            <Text style={styles.convertBtnText}>Convert Now</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      {result !== null && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Conversion Result</Text>
          <Text style={styles.resultValue}>{result}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#d6f0f6',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: width > 350 ? 34 : 28,
    fontWeight: '900',
    color: '#004e89',
    alignSelf: 'center',
    marginBottom: 30,
    fontFamily: 'AvenirNext-DemiBold',
    textShadowColor: 'rgba(0, 78, 137, 0.33)',
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 3,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 22,
    shadowColor: '#0075a3',
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 15,
  },
  input: {
    borderWidth: 2,
    borderColor: '#66bbe9',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 20,
    color: '#004e89',
    fontWeight: '600',
    marginBottom: 22,
    backgroundColor: '#e6f7ff',
    letterSpacing: 1.1,
  },
  pickerContainer: {
    overflow: 'hidden',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#66bbe9',
    marginBottom: 28,
  },
  picker: {
    height: 55,
    color: '#004e89',
    fontWeight: '600',
  },
  convertBtn: {
    backgroundColor: '#0081af',
    borderRadius: 14,
    paddingVertical: 18,
    shadowColor: '#2799d9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 12,
    elevation: 12,
  },
  convertBtnText: {
    color: '#c6def8',
    fontWeight: '900',
    fontSize: 22,
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  resultBox: {
    marginTop: 42,
    backgroundColor: '#b5dcf2',
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 20,
    shadowColor: '#33a4ff',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 13,
  },
  resultLabel: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#004e89',
    fontSize: 20,
    marginBottom: 12,
    letterSpacing: 1.5,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#003057',
    textAlign: 'center',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 78, 137, 0.3)',
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 5,
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const { width } = Dimensions.get("window");

// scaling helpers
const isSmall = width < 360;
const isTablet = width > 768;

// ✅ conversions object
const conversions = {
  "Kilometers to Miles": { func: (val) => val * 0.621371, fromUnit: "km", toUnit: "mi" },
  "Miles to Kilometers": { func: (val) => val / 0.621371, fromUnit: "mi", toUnit: "km" },
  "Meters to Yards": { func: (val) => val * 1.09361, fromUnit: "m", toUnit: "yd" },
  "Yards to Meters": { func: (val) => val / 1.09361, fromUnit: "yd", toUnit: "m" },
  "Feet to Meters": { func: (val) => val * 0.3048, fromUnit: "ft", toUnit: "m" },
  "Meters to Feet": { func: (val) => val / 0.3048, fromUnit: "m", toUnit: "ft" },
  "Centimeters to Inches": { func: (val) => val * 0.393701, fromUnit: "cm", toUnit: "in" },
  "Inches to Centimeters": { func: (val) => val / 0.393701, fromUnit: "in", toUnit: "cm" },
  "Kilograms to Pounds": { func: (val) => val * 2.20462, fromUnit: "kg", toUnit: "lbs" },
  "Pounds to Kilograms": { func: (val) => val / 2.20462, fromUnit: "lbs", toUnit: "kg" },
  "Grams to Ounces": { func: (val) => val * 0.035274, fromUnit: "g", toUnit: "oz" },
  "Ounces to Grams": { func: (val) => val / 0.035274, fromUnit: "oz", toUnit: "g" },
  "Celsius to Fahrenheit": { func: (val) => (val * 9) / 5 + 32, fromUnit: "°C", toUnit: "°F" },
  "Fahrenheit to Celsius": { func: (val) => ((val - 32) * 5) / 9, fromUnit: "°F", toUnit: "°C" },
  "Liters to Gallons": { func: (val) => val * 0.264172, fromUnit: "L", toUnit: "gal" },
  "Gallons to Liters": { func: (val) => val / 0.264172, fromUnit: "gal", toUnit: "L" },
};

export default function App() {
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("Kilometers to Miles");
  const [result, setResult] = useState(null);

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setResult("Please enter a valid number");
      return;
    }

    const conversion = conversions[unit];
    const converted = conversion.func(num);
    const label = `${num} ${conversion.fromUnit} = ${converted.toFixed(2)} ${conversion.toUnit}`;

    setResult(label);
  };

  return (
    <KeyboardAvoidingView
      style={styles.outerContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.appTitle}>Ultimate Unit Converter</Text>

      <View style={styles.card}>
        {/* Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter value..."
          placeholderTextColor="#8ca4af"
          keyboardType="numeric"
          value={value}
          onChangeText={setValue}
        />

        {/* Picker */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={unit}
            style={styles.picker}
            onValueChange={(itemValue) => setUnit(itemValue)}
          >
            {Object.keys(conversions).map((key) => (
              <Picker.Item key={key} label={key} value={key} />
            ))}
          </Picker>
        </View>

        {/* Convert Button */}
        <TouchableOpacity style={styles.convertBtn} onPress={convert}>
          <Text style={styles.convertBtnText}>Convert Now</Text>
        </TouchableOpacity>
      </View>

      {/* Result */}
      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Result</Text>
          <Text style={styles.resultValue}>{result}</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#d6f0f6",
    paddingHorizontal: isTablet ? 60 : isSmall ? 16 : 24,
    justifyContent: "center",
  },
  appTitle: {
    fontSize: isTablet ? 42 : isSmall ? 24 : 32,
    fontWeight: "900",
    color: "#004e89",
    alignSelf: "center",
    marginBottom: isSmall ? 20 : 30,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: isTablet ? 30 : isSmall ? 18 : 22,
    alignSelf: "center",
    width: isTablet ? "70%" : "100%",
    elevation: 15,
  },
  input: {
    borderWidth: 2,
    borderColor: "#66bbe9",
    borderRadius: 14,
    paddingVertical: isTablet ? 18 : isSmall ? 10 : 14,
    paddingHorizontal: 20,
    fontSize: isTablet ? 24 : isSmall ? 16 : 20,
    color: "#004e89",
    fontWeight: "600",
    marginBottom: 22,
    backgroundColor: "#e6f7ff",
  },
  pickerContainer: {
    overflow: "hidden",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#66bbe9",
    marginBottom: 28,
  },
  picker: {
    height: isTablet ? 65 : 55,
    color: "#004e89",
    fontSize: isTablet ? 20 : 16,
  },
  convertBtn: {
    backgroundColor: "#0081af",
    borderRadius: 14,
    paddingVertical: isTablet ? 22 : isSmall ? 14 : 18,
    elevation: 12,
  },
  convertBtnText: {
    color: "#c6def8",
    fontWeight: "900",
    fontSize: isTablet ? 26 : isSmall ? 18 : 22,
    letterSpacing: 2,
    textAlign: "center",
  },
  resultBox: {
    marginTop: 42,
    backgroundColor: "#b5dcf2",
    borderRadius: 18,
    paddingVertical: isTablet ? 34 : 28,
    paddingHorizontal: 20,
    elevation: 13,
  },
  resultLabel: {
    textAlign: "center",
    fontWeight: "700",
    color: "#004e89",
    fontSize: isTablet ? 24 : isSmall ? 16 : 20,
    marginBottom: 12,
  },
  resultValue: {
    fontSize: isTablet ? 38 : isSmall ? 26 : 32,
    fontWeight: "900",
    color: "#003057",
    textAlign: "center",
  },
});

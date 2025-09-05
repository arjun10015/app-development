import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Dimensions,
  Platform,
  Pressable,
  Animated,
  Easing,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

export default function BMICalculator() {
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(60);
  const [height, setHeight] = useState(170);
  const [modalVisible, setModalVisible] = useState(false);
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [scaleAnim] = useState(new Animated.Value(0));

  const openModal = () => {
    setModalVisible(true);
    scaleAnim.setValue(0.7);
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.back(1)),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.7,
      duration: 170,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const calculateBMI = () => {
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmi(bmiValue);

    if (bmiValue < 18.5) setCategory("Underweight");
    else if (bmiValue >= 18.5 && bmiValue < 24.9) setCategory("Normal");
    else if (bmiValue >= 25 && bmiValue < 29.9) setCategory("Overweight");
    else setCategory("Obese");

    openModal();
  };

  return (
    <ImageBackground
      source={{
        uri:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      }}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.header}>BMI Calculator</Text>
        <Text style={styles.subtitle}>Check your Body Mass Index</Text>

        {/* Age & Weight Row */}
        <View style={styles.row}>
          {/* Age */}
          <View style={styles.box}>
            <Text style={styles.label}>Age</Text>
            <Text style={styles.value}>{age}</Text>
            <View style={styles.stepper}>
              <Pressable onPress={() => setAge(Math.max(1, age - 1))} style={styles.stepBtn}>
                <Icon name="remove" size={22} color="#333" />
              </Pressable>
              <Pressable onPress={() => setAge(age + 1)} style={styles.stepBtn}>
                <Icon name="add" size={22} color="#333" />
              </Pressable>
            </View>
          </View>

          {/* Weight */}
          <View style={styles.box}>
            <Text style={styles.label}>Weight (kg)</Text>
            <Text style={styles.value}>{weight}</Text>
            <View style={styles.stepper}>
              <Pressable onPress={() => setWeight(Math.max(1, weight - 1))} style={styles.stepBtn}>
                <Icon name="remove" size={22} color="#333" />
              </Pressable>
              <Pressable onPress={() => setWeight(weight + 1)} style={styles.stepBtn}>
                <Icon name="add" size={22} color="#333" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Height Section */}
        <View style={styles.heightBox}>
          <Text style={styles.label}>Height (cm)</Text>
          <Text style={styles.value}>{height}</Text>
          <View style={styles.stepper}>
            <Pressable onPress={() => setHeight(Math.max(50, height - 1))} style={styles.stepBtn}>
              <Icon name="remove" size={22} color="#333" />
            </Pressable>
            <Pressable onPress={() => setHeight(height + 1)} style={styles.stepBtn}>
              <Icon name="add" size={22} color="#333" />
            </Pressable>
          </View>
        </View>

        {/* Calculate Button */}
        <Pressable style={styles.calcBtn} onPress={calculateBMI}>
          <Text style={styles.calcText}>Calculate BMI</Text>
        </Pressable>

        {/* Result Modal */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <Animated.View style={[styles.resultCard, { transform: [{ scale: scaleAnim }] }]}>
              <Text style={styles.resultTitle}>Your BMI</Text>
              <Text style={styles.resultValue}>{bmi}</Text>
              <Text style={styles.category}>{category}</Text>
              <Text style={styles.range}>Normal range: 18.5 - 24.9</Text>
              <Pressable style={styles.closeBtn} onPress={closeModal}>
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </Animated.View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const responsiveFont = size => Math.round((size * width) / 375);

const styles = StyleSheet.create({
  bg: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    flex: 1,
    alignItems: "center",
    padding: 18,
    paddingTop: 60,
    backgroundColor: "rgba(255, 255, 255, 0.21)",
  },
  header: {
    fontSize: responsiveFont(29),
    fontWeight: "bold",
    color: "#002D72",
    marginVertical: 16,
  },
  subtitle: { fontSize: responsiveFont(15), color: "#333", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", width: "93%" },
  box: {
    flex: 1,
    margin: 10,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    elevation: 4,
  },
  label: { fontSize: responsiveFont(13), color: "#777" },
  value: {
    fontSize: responsiveFont(27),
    fontWeight: "bold",
    color: "#240975",
  },
  stepper: { flexDirection: "row", marginTop: 8 },
  stepBtn: {
    marginHorizontal: 10,
    padding: 11,
    backgroundColor: "#eee",
    borderRadius: 12,
  },
  heightBox: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 18,
    alignItems: "center",
    width: "93%",
    marginVertical: 14,
    elevation: 4,
  },
  calcBtn: {
    marginTop: 32,
    backgroundColor: "#002D72",
    padding: 16,
    borderRadius: 13,
    width: "82%",
    alignItems: "center",
  },
  calcText: { fontSize: responsiveFont(18), color: "#fff", fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  resultCard: {
    width: "86%",
    backgroundColor: "#f9fff9",
    borderRadius: 21,
    padding: 24,
    alignItems: "center",
  },
  resultTitle: { fontSize: responsiveFont(19), marginBottom: 7, color: "#275D5A" },
  resultValue: {
    fontSize: responsiveFont(44),
    fontWeight: "bold",
    color: "#122947",
  },
  category: { fontSize: responsiveFont(18), fontWeight: "600", marginBottom: 13 },
  range: { fontSize: responsiveFont(16), color: "#0c0b0b", marginBottom: 9 },
  closeBtn: {
    marginTop: 17,
    backgroundColor: "#32CD32",
    padding: 13,
    borderRadius: 12,
    width: "75%",
    alignItems: "center",
  },
  closeText: { fontSize: responsiveFont(18), color: "#fff", fontWeight: "bold" },
});

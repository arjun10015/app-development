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
  SafeAreaView,
  PixelRatio,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

// Responsive font scaling helper
const responsiveFont = (size) => {
  const scale = width / 375; // 375 is iPhone X base width
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Responsive spacing (for margins/paddings)
const responsiveSize = (size) => Math.round((size * width) / 375);

export default function BMICalculator() {
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(60);
  const [heightVal, setHeightVal] = useState(170);
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
    const heightInMeters = heightVal / 100;
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
      <SafeAreaView style={styles.overlay}>
        <Text style={styles.header}>BMI Calculator</Text>
        <Text style={styles.subtitle}>Check your Body Mass Index</Text>

        {/* Age & Weight Row */}
        <View style={styles.row}>
          {/* Age */}
          <View style={styles.box}>
            <Text style={styles.label}>Age</Text>
            <Text style={styles.value}>{age}</Text>
            <View style={styles.stepper}>
              <Pressable
                onPress={() => setAge(Math.max(1, age - 1))}
                style={styles.stepBtn}
              >
                <Icon name="remove" size={responsiveFont(20)} color="#333" />
              </Pressable>
              <Pressable
                onPress={() => setAge(age + 1)}
                style={styles.stepBtn}
              >
                <Icon name="add" size={responsiveFont(20)} color="#333" />
              </Pressable>
            </View>
          </View>

          {/* Weight */}
          <View style={styles.box}>
            <Text style={styles.label}>Weight (kg)</Text>
            <Text style={styles.value}>{weight}</Text>
            <View style={styles.stepper}>
              <Pressable
                onPress={() => setWeight(Math.max(1, weight - 1))}
                style={styles.stepBtn}
              >
                <Icon name="remove" size={responsiveFont(20)} color="#333" />
              </Pressable>
              <Pressable
                onPress={() => setWeight(weight + 1)}
                style={styles.stepBtn}
              >
                <Icon name="add" size={responsiveFont(20)} color="#333" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Height Section */}
        <View style={styles.heightBox}>
          <Text style={styles.label}>Height (cm)</Text>
          <Text style={styles.value}>{heightVal}</Text>
          <View style={styles.stepper}>
            <Pressable
              onPress={() => setHeightVal(Math.max(50, heightVal - 1))}
              style={styles.stepBtn}
            >
              <Icon name="remove" size={responsiveFont(20)} color="#333" />
            </Pressable>
            <Pressable
              onPress={() => setHeightVal(heightVal + 1)}
              style={styles.stepBtn}
            >
              <Icon name="add" size={responsiveFont(20)} color="#333" />
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
            <Animated.View
              style={[styles.resultCard, { transform: [{ scale: scaleAnim }] }]}
            >
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
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    flex: 1,
    alignItems: "center",
    padding: responsiveSize(18),
    paddingTop: responsiveSize(40),
    backgroundColor: "rgba(255, 255, 255, 0.21)",
  },
  header: {
    fontSize: responsiveFont(28),
    fontWeight: "bold",
    color: "#002D72",
    marginVertical: responsiveSize(14),
  },
  subtitle: {
    fontSize: responsiveFont(15),
    color: "#333",
    marginBottom: responsiveSize(10),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "93%",
  },
  box: {
    flex: 1,
    margin: responsiveSize(8),
    backgroundColor: "#fff",
    padding: responsiveSize(14),
    borderRadius: 18,
    alignItems: "center",
    elevation: 4,
  },
  label: { fontSize: responsiveFont(13), color: "#777" },
  value: {
    fontSize: responsiveFont(26),
    fontWeight: "bold",
    color: "#240975",
  },
  stepper: { flexDirection: "row", marginTop: responsiveSize(6) },
  stepBtn: {
    marginHorizontal: responsiveSize(8),
    padding: responsiveSize(10),
    backgroundColor: "#eee",
    borderRadius: 12,
  },
  heightBox: {
    backgroundColor: "#fff",
    padding: responsiveSize(20),
    borderRadius: 18,
    alignItems: "center",
    width: "93%",
    marginVertical: responsiveSize(12),
    elevation: 4,
  },
  calcBtn: {
    marginTop: responsiveSize(28),
    backgroundColor: "#002D72",
    padding: responsiveSize(14),
    borderRadius: 13,
    width: "82%",
    alignItems: "center",
  },
  calcText: {
    fontSize: responsiveFont(17),
    color: "#fff",
    fontWeight: "bold",
  },
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
    padding: responsiveSize(20),
    alignItems: "center",
  },
  resultTitle: {
    fontSize: responsiveFont(18),
    marginBottom: responsiveSize(6),
    color: "#275D5A",
  },
  resultValue: {
    fontSize: responsiveFont(42),
    fontWeight: "bold",
    color: "#122947",
  },
  category: {
    fontSize: responsiveFont(17),
    fontWeight: "600",
    marginBottom: responsiveSize(12),
  },
  range: { fontSize: responsiveFont(15), color: "#0c0b0b", marginBottom: 8 },
  closeBtn: {
    marginTop: responsiveSize(15),
    backgroundColor: "#32CD32",
    padding: responsiveSize(12),
    borderRadius: 12,
    width: "75%",
    alignItems: "center",
  },
  closeText: {
    fontSize: responsiveFont(17),
    color: "#fff",
    fontWeight: "bold",
  },
});

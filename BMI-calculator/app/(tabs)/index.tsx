import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
  Pressable,
  Animated,
  Easing,
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

  // Animate modal on open
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
    let heightInMeters = height / 100;
    let bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmi(bmiValue);

    if (bmiValue < 18.5) setCategory("Underweight");
    else if (bmiValue >= 18.5 && bmiValue < 24.9) setCategory("Normal");
    else if (bmiValue >= 25 && bmiValue < 29.9) setCategory("Overweight");
    else setCategory("Obese");
    openModal();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>BMI Calculator</Text>
      <Text style={styles.subtitle}>Check your Body Mass Index</Text>
      {/* Age & Weight Row */}
      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.label}>Age</Text>
          <Text style={styles.value}>{age}</Text>
          <View style={styles.stepper}>
            <Pressable
              android_ripple={{ color: "#e0e0e0", borderless: true }}
              style={styles.stepBtn}
              onPress={() => setAge(age > 1 ? age - 1 : 1)}
            >
              <Icon name="remove" size={22} color="#333" />
            </Pressable>
            <Pressable
              android_ripple={{ color: "#e0e0e0", borderless: true }}
              style={styles.stepBtn}
              onPress={() => setAge(age + 1)}
            >
              <Icon name="add" size={22} color="#333" />
            </Pressable>
          </View>
        </View>
        <View style={styles.box}>
          <Text style={styles.label}>Weight (kg)</Text>
          <Text style={styles.value}>{weight}</Text>
          <View style={styles.stepper}>
            <Pressable
              android_ripple={{ color: "#e0e0e0", borderless: true }}
              style={styles.stepBtn}
              onPress={() => setWeight(weight > 1 ? weight - 1 : 1)}
            >
              <Icon name="remove" size={22} color="#333" />
            </Pressable>
            <Pressable
              android_ripple={{ color: "#e0e0e0", borderless: true }}
              style={styles.stepBtn}
              onPress={() => setWeight(weight + 1)}
            >
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
          <Pressable
            android_ripple={{ color: "#e0e0e0", borderless: true }}
            style={styles.stepBtn}
            onPress={() => setHeight(height > 50 ? height - 1 : 50)}
          >
            <Icon name="remove" size={22} color="#333" />
          </Pressable>
          <Pressable
            android_ripple={{ color: "#e0e0e0", borderless: true }}
            style={styles.stepBtn}
            onPress={() => setHeight(height + 1)}
          >
            <Icon name="add" size={22} color="#333" />
          </Pressable>
        </View>
      </View>
      {/* Calculate Button */}
      <Pressable
        android_ripple={{ color: "#294aad" }}
        style={({ pressed }) => [
          styles.calcBtn,
          pressed && { backgroundColor: "#274381" },
        ]}
        onPress={calculateBMI}
      >
        <Text style={styles.calcText}>Calculate BMI</Text>
      </Pressable>
      {/* Result Modal with animated scale */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.resultCard,
              {
                transform: [{ scale: scaleAnim }],
                shadowOpacity: 0.23,
                shadowOffset: { width: 0, height: 6 },
                elevation: 7,
              },
            ]}
          >
            <Text style={styles.resultTitle}>Your BMI</Text>
            <Text style={styles.resultValue}>{bmi}</Text>
            <Text style={styles.category}>{category}</Text>
            <Text style={styles.range}>Normal range: 18.5 - 24.9</Text>
            <Pressable
              android_ripple={{ color: "#43e77d" }}
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && { backgroundColor: "#28b648" },
              ]}
              onPress={closeModal}
            >
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const responsiveFont = (size) => Math.round(size * width / 375);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 18,
    paddingTop: 60,
    backgroundColor: "#f4f4f4",
  },
  header: {
    fontSize: responsiveFont(29),
    fontWeight: "bold",
    color: "#002D72",
    marginVertical: 16,
    letterSpacing: 1.2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "93%",
    marginVertical: 13,
  },
  box: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    ...Platform.select({
      ios: {
        shadowOpacity: 0.14,
        shadowRadius: 7,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 0.7,
    borderColor: "#e7e7e7",
  },
  label: {
    fontSize: responsiveFont(13),
    color: "#777",
    marginBottom: 2,
  },
  value: {
    fontSize: responsiveFont(27),
    fontWeight: "bold",
    marginVertical: 4,
    color: "#240975ff",
    letterSpacing: 1,
  },
  stepper: {
    flexDirection: "row",
    marginTop: 8,
  },
  stepBtn: {
    marginHorizontal: 10,
    padding: 11,
    backgroundColor: "#eee",
    borderRadius: 12,
    borderWidth: 0.9,
    borderColor: "#bbb",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: { shadowOpacity: 0.09, shadowRadius: 4 },
    }),
  },
  heightBox: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 18,
    alignItems: "center",
    width: "93%",
    shadowColor: "#000",
    ...Platform.select({
      ios: {
        shadowOpacity: 0.13,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 0.7,
    borderColor: "#e7e7e7",
    marginVertical: 14,
  },
  calcBtn: {
    marginTop: 32,
    backgroundColor: "#002D72",
    padding: 16,
    borderRadius: 13,
    width: "82%",
    alignItems: "center",
    shadowColor: "#000",
    ...Platform.select({
      ios: {
        shadowOpacity: 0.15,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  calcText: {
    fontSize: responsiveFont(18),
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 0.5,
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
    padding: 24,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#125A75",
        shadowOpacity: 0.23,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  resultTitle: {
    fontSize: responsiveFont(19),
    marginBottom: 7,
    color: "#275D5A",
    letterSpacing: 1,
    fontWeight: "600",
  },
  resultValue: {
    fontSize: responsiveFont(44),
    fontWeight: "bold",
    color: "#122947ff",
    marginBottom: 2,
    letterSpacing: 1.1,
  },
  category: {
    fontSize: responsiveFont(18),
    fontWeight: "600",
    marginBottom: 13,
    color: "#000000ff",
    letterSpacing: 1,
  },
  range: {
    fontSize: responsiveFont(16),
    color: "#0c0b0b",
    textAlign: "center",
    marginBottom: 9,
  },
  closeBtn: {
    marginTop: 17,
    backgroundColor: "#32CD32",
    padding: 13,
    borderRadius: 12,
    width: "75%",
    alignItems: "center",
  },
  closeText: {
    fontSize: responsiveFont(18),
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 0.4,
  },
});

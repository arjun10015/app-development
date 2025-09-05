import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');
const categories = ['Food', 'Transport', 'Shopping', 'Salary', 'Rent', 'Other'];

const getWeekStart = (date = new Date()) => {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
};

export default function ExpenseManager() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [type, setType] = useState('Expense');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [transactions, setTransactions] = useState([]);
  const [animValue] = useState(new Animated.Value(1));

  const addTransaction = () => {
    if (!amount || isNaN(+amount)) return;
    Animated.sequence([
      Animated.timing(animValue, { toValue: 0.95, duration: 90, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: 1, duration: 110, useNativeDriver: true }),
    ]).start();
    setTransactions([
      ...transactions,
      { amount: Number(amount), category, type, date, id: Date.now() + Math.random() },
    ]);
    setAmount('');
    setCategory(categories[0]);
    setType('Expense');
    setDate(new Date().toISOString().slice(0, 10));
  };

  const weeklyData = () => {
    const start = getWeekStart();
    const weekTrans = transactions.filter(t => new Date(t.date) >= start);
    const summary = {};
    for (const cat of categories) summary[cat] = { income: 0, expense: 0 };
    weekTrans.forEach(t => {
      if (t.type === 'Income') summary[t.category].income += t.amount;
      else summary[t.category].expense += t.amount;
    });
    return summary;
  };

  const summary = weeklyData();

  return (
    <KeyboardAvoidingView
      style={styles.flex1}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Expense Manager</Text>

        {/* Input Card */}
        <Animated.View style={[styles.card, { transform: [{ scale: animValue }] }]}>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholderTextColor="#b5b5b5"
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={itemValue => setCategory(itemValue)}
              style={styles.picker}
            >
              {categories.map(cat => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>

          {/* Expense / Income toggle */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, type === 'Expense' && styles.selectedBtn]}
              onPress={() => setType('Expense')}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleText, type === 'Expense' && styles.selectedText]}>
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, type === 'Income' && styles.selectedBtn]}
              onPress={() => setType('Income')}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleText, type === 'Income' && styles.selectedText]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
            placeholderTextColor="#b5b5b5"
          />

          <TouchableOpacity style={styles.addBtn} onPress={addTransaction} activeOpacity={0.85}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Weekly Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.subHeader}>Weekly Summary (by Category)</Text>
          <FlatList
            data={categories}
            keyExtractor={cat => cat}
            renderItem={({ item }) => (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryCat}>{item}</Text>
                <Text style={styles.summaryIncome}>Income: ₹{summary[item].income}</Text>
                <Text style={styles.summaryExpense}>Expense: ₹{summary[item].expense}</Text>
              </View>
            )}
          />
        </View>

        {/* Transactions */}
        <Text style={styles.transHeader}>Transactions (This Week)</Text>
        <FlatList
          data={transactions.filter(t => new Date(t.date) >= getWeekStart())}
          keyExtractor={t => String(t.id)}
          renderItem={({ item }) => (
            <View style={styles.transRow}>
              <Text style={styles.transDate}>{item.date}</Text>
              <Text style={styles.transCat}>{item.category}</Text>
              <Text style={item.type === 'Income' ? styles.transInc : styles.transExp}>
                {item.type === 'Income' ? '+' : '-'}₹{item.amount}
              </Text>
            </View>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

/* ==== Styles ==== */
const fontScale = width < 400 ? 1 : 1.22;
const paddingScale = width < 400 ? 1 : 1.18;

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: '#f0fff0' },
  container: {
    flex: 1,
    padding: 9 * paddingScale,
    backgroundColor: '#EBF9EF',
    alignItems: 'center',
  },
  header: {
    fontSize: 28 * fontScale,
    fontWeight: 'bold',
    marginVertical: 14,
    textAlign: 'center',
    color: '#4BB481',
    letterSpacing: 1.1,
  },
  card: {
    width: width > 500 ? 410 : '98%',
    backgroundColor: '#fff',
    padding: 17 * paddingScale,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#2b3b2b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 7,
    elevation: 8,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 7 * paddingScale,
    marginVertical: 6,
    fontSize: 15 * fontScale,
    backgroundColor: '#f7f7f7',
    color: '#262626',
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginVertical: 6,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 42 * paddingScale,
    width: '100%',
    color: '#3d3d3d',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 7,
    justifyContent: 'space-between',
  },
  toggleBtn: {
    flex: 1,
    backgroundColor: '#d7efd1',
    paddingVertical: 10 * paddingScale,
    borderRadius: 7,
    alignItems: 'center',
    borderWidth: 1.3,
    borderColor: '#b8dcbc',
    marginHorizontal: 3,
  },
  selectedBtn: {
    backgroundColor: '#4BB481',
    borderColor: '#47b881',
  },
  toggleText: {
    fontSize: 14 * fontScale,
    fontWeight: '600',
    color: '#334533',
  },
  selectedText: {
    color: '#fff',
  },
  addBtn: {
    width: '100%',
    backgroundColor: '#23b47a',
    paddingVertical: 10 * paddingScale,
    borderRadius: 11,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#23b47a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.17,
    shadowRadius: 7,
    elevation: 5,
  },
  addText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16 * fontScale,
    letterSpacing: 0.9,
  },
  summaryContainer: {
    width: width > 500 ? 420 : '98%',
    backgroundColor: '#F8FFF5',
    borderRadius: 13,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 7,
  },
  subHeader: {
    fontSize: 17 * fontScale,
    fontWeight: '600',
    color: '#3BB481',
    marginVertical: 10,
    marginLeft: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6.5,
    borderBottomWidth: 0.6,
    borderColor: '#edf4ed',
    alignItems: 'center',
  },
  summaryCat: {
    fontWeight: 'bold',
    color: '#47af90',
    fontSize: 15 * fontScale,
    flex: 1,
  },
  summaryIncome: {
    color: '#23b47a',
    fontWeight: '500',
    flex: 1,
    fontSize: 14 * fontScale,
    textAlign: 'left',
  },
  summaryExpense: {
    color: '#ec3e3e',
    fontWeight: '500',
    flex: 1,
    fontSize: 14 * fontScale,
    textAlign: 'left',
  },
  transHeader: {
    width: width > 500 ? 420 : '98%',
    fontSize: 16 * fontScale,
    fontWeight: '600',
    color: '#3BB481',
    marginVertical: 12,
    marginLeft: 5,
  },
  transRow: {
    flexDirection: 'row',
    width: width > 500 ? 410 : '98%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    backgroundColor: '#fff',
    borderRadius: 7,
    marginVertical: 2,
    elevation: 2,
  },
  transDate: { flex: 2, fontSize: 14 * fontScale, color: '#49ab98' },
  transCat: { flex: 2, fontSize: 14 * fontScale, color: '#383f38', fontWeight: '500' },
  transInc: { flex: 1, fontWeight: 'bold', color: '#23b47a', fontSize: 15 * fontScale, textAlign: 'right' },
  transExp: { flex: 1, fontWeight: 'bold', color: '#ec3e3e', fontSize: 15 * fontScale, textAlign: 'right' },
});

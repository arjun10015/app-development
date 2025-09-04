import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ImageBackground,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const backgroundImage = { uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' };

export default function AnimatedTasksWithBackground() {
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState([]);
  const inputAnim = useRef(new Animated.Value(0)).current;

  // Animate add button scale
  const addBtnScale = useRef(new Animated.Value(1)).current;

  const addTask = () => {
    if (!taskInput.trim()) return;

    Animated.sequence([
      Animated.timing(addBtnScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(addBtnScale, {
        toValue: 1,
        duration: 130,
        useNativeDriver: true,
      }),
    ]).start();

    setTasks(prev => [...prev, { id: Date.now().toString(), text: taskInput.trim(), done: false }]);
    setTaskInput('');
    Keyboard.dismiss();
  };

  const toggleDone = id => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, done: !task.done } : task))
    );
  };

  const deleteTask = id => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const onFocusInput = () => {
    Animated.timing(inputAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const onBlurInput = () => {
    if (!taskInput) {
      Animated.timing(inputAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  };

  const inputBorderColor = inputAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.4)', '#2acd85'],
  });

  const inputBackground = inputAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.7)'],
  });

  return (
    <ImageBackground source={backgroundImage} style={styles.bg} blurRadius={9}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>My Daily Tasks</Text>

        <Animated.View
          style={[
            styles.inputWrapper,
            {
              borderColor: inputBorderColor,
              backgroundColor: inputBackground,
              shadowColor: '#2acd85',
              shadowOpacity: inputAnim,
            },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Add a new task..."
            placeholderTextColor="rgba(0,0,0,0.3)"
            value={taskInput}
            onChangeText={setTaskInput}
            onFocus={onFocusInput}
            onBlur={onBlurInput}
            onSubmitEditing={addTask}
            returnKeyType="done"
          />
          <Animated.View style={{ transform: [{ scale: addBtnScale }] }}>
            <TouchableOpacity style={styles.addBtn} onPress={addTask} activeOpacity={0.8}>
              <Icon name="add-circle-outline" size={38} color="#2acd85" />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <FlatList
          style={styles.list}
          data={tasks}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tasks yet... relax or add one! 🎉</Text>
          }
          renderItem={({ item }) => (
            <AnimatedTaskItem
              task={item}
              toggleDone={toggleDone}
              deleteTask={deleteTask}
            />
          )}
        />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const AnimatedTaskItem = ({ task, toggleDone, deleteTask }) => {
  const animatedOpacity = useRef(new Animated.Value(1)).current;

  const onToggle = () => {
    toggleDone(task.id);
  };

  const onDelete = () => {
    // Fade out task on delete
    Animated.timing(animatedOpacity, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => deleteTask(task.id));
  };

  return (
    <Animated.View style={[styles.taskRow, { opacity: animatedOpacity }]}>
      <TouchableOpacity onPress={onToggle} style={styles.checkBoxWrapper} activeOpacity={0.7}>
        <Icon
          name={task.done ? 'checkbox' : 'square-outline'}
          size={28}
          color={task.done ? '#2acd85' : 'rgba(0,0,0,0.6)'}
        />
      </TouchableOpacity>
      <Text style={[styles.taskText, task.done && styles.taskDone]}>{task.text}</Text>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} activeOpacity={0.7}>
        <Icon name="trash" size={28} color="#e53935" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    paddingTop: 58,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  title: {
    color: '#06345aff',
    fontSize: width > 380 ? 36 : 30,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 2,
    textShadowColor: '#97e0f6ff',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 16 : 10,
    marginBottom: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 10,
  },
  input: {
    flex: 1,
    fontSize: 21,
    color: '#21115dff',
    fontWeight: '600',
  },
  addBtn: {
    marginLeft: 14,
  },
  list: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#0d0d59ff',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 90,
    textShadowColor: '#7db9e1ff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 14,
    borderRadius: 22,
    shadowColor: '#5f9dccff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 9,
  },
  checkBoxWrapper: {
    marginRight: 18,
  },
  taskText: {
    fontSize: 17,
    flex: 1,
    color: '#141e61ff',
  },
  taskDone: {
    color: '#0a1652ff',
    textDecorationLine: 'line-through',
    fontStyle: 'italic',
  },
  deleteBtn: {
    marginLeft: 16,
  },
});




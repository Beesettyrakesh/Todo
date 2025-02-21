import { Text, View, TextInput, Pressable, StyleSheet, FlatList, Modal,Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { ThemeContext } from "@/context/ThemeContext";
import { Octicons } from "@expo/vector-icons";
import Animated, { LinearTransition } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
// import SignOutButton from "./SignOutButton";

export interface ITodo {
  id: Number,
  title: string
  completed: boolean
}

export interface ITheme {
  text: string; 
  background: string; 
  icon: string; 
  button: string;
}

export default function Index() {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [text, setText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
  const router = useRouter()

  const [loaded, error] = useFonts({
    Inter_500Medium,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp")
        const storedTodos = jsonValue != null ? JSON.parse(jsonValue) : null
        if(storedTodos && storedTodos.length) {
          setTodos(storedTodos.sort((a: { id: number }, b: { id: number }) => b.id - a.id))
        }
      } catch(e) {
        console.error(e)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const storeTodosData = async () => {
      try {
        const jsonValue = JSON.stringify(todos)
        await AsyncStorage.setItem("TodoApp", jsonValue)
      } catch(e) {
        console.error(e)
      }
    }
    storeTodosData()
  }, [todos])

  if(!loaded && !error) {
    return null
  }

  const styles = createStyles(theme, colorScheme)

  const addTodo = () => {
    if(text.trim()){
      const newTodo: ITodo = {
        id: todos.length > 0 ? Number(todos[0].id) + 1 : 1,
        title: text.trim(),
        completed: false
      };
      
      setTodos(prevTodos => [newTodo, ...prevTodos]);
      setText('');
      setIsModalVisible(false);
    }
  };

  const toggleTodo = (id: Number) => {
    setTodos(prevTodos => 
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id: Number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setText('');
  };

  const handlePress = (id: Number) => {
    router.push(`/todos/${id}`)
  }

  const renderItem = ({ item }: {item: ITodo}) => (
    <View style={styles.todoItem}>
      <Pressable
        onPress={() => handlePress(item.id)}
        onLongPress={() => toggleTodo(item.id)}
        style={styles.textContainer}
      >
        <Text
          style={[styles.todoText, item.completed && styles.completedText]}
        >
          {item.title}
        </Text>
      </Pressable>
      <Pressable 
        onPress={() => removeTodo(item.id)}
        style={styles.iconContainer}
      >
        <MaterialCommunityIcons 
          name="delete-circle" 
          size={36} 
          color='#c80000'
          selectable={undefined} 
        />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>  
      {/* <SignOutButton /> */}
      <Animated.FlatList 
        data={todos}
        renderItem={renderItem}
        keyExtractor={todo => todo.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode='on-drag'
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No todos yet!</Text>
          </View>
        )}
      />

      <Pressable 
        style={styles.themeToggle}
        onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
      >
        <Octicons 
          name={colorScheme === 'dark' ? 'moon' : 'sun' }
          size={38} 
          color='white' 
          selectable={undefined} 
        />
      </Pressable>

      {/* Floating Action Button */}
      <Pressable 
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
      >
        <MaterialCommunityIcons name="plus" size={30} color="white" />
      </Pressable>

      {/* Modal for adding new todo */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={handleModalClose}
        >
          <Pressable 
            style={styles.modalContent}
            onPress={(e) => {
              e.stopPropagation();
              Keyboard.dismiss();
            }}
          >
            <Text style={styles.modalTitle}>Add New Todo</Text>
            <TextInput 
              style={styles.modalInput}
              placeholder="Enter your todo"
              placeholderTextColor="gray"
              value={text}
              onChangeText={setText}
              autoFocus={true}
              onSubmitEditing={addTodo}
            />
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleModalClose}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={[styles.modalButton, styles.addButton]}
                onPress={addTodo}
              >
                <Text style={styles.buttonText}>Add</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(theme: ITheme, colorScheme: string | null | undefined) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background
    },
    todoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      padding: 10,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    textContainer: {
      flex: 1,        
      marginRight: 10, 
    },
    todoText: {
      flex: 1,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
      flexWrap: 'wrap',
      flexShrink: 1
    },
    iconContainer: {
      paddingLeft: 8,  
      alignSelf: 'flex-start', 
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: 'gray'
    },
    fab: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: '#C3B1E1',
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.3)', // Updated from shadowProps
      elevation: 8, // for Android
    },
    themeToggle: {
      position: 'absolute',
      bottom: 96,
      right: 20,
      backgroundColor: '#C3B1E1',
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalContent: {
      backgroundColor: '#E6E6FA',
      borderRadius: 20,
      padding: 20,
      width: '90%',
      maxWidth: 400,
      boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.3)', // Updated from shadowProps
      elevation: 5, // for Android
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'black',
      marginBottom: 20,
      textAlign: 'center'
    },
    modalInput: {
      backgroundColor: '#3A3A3C',
      borderRadius: 10,
      padding: 15,
      fontSize: 16,
      color: theme.text,
      marginBottom: 20
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10
    },
    modalButton: {
      flex: 1,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center'
    },
    cancelButton: {
      backgroundColor: '#c80000'
    },
    addButton: {
      backgroundColor: '#029404'
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold'
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyStateText: {
      color: 'gray',
      fontSize: 16,
    },
  });
}
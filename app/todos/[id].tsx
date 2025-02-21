import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";

import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ITheme, ITodo } from "..";

export default function EditScreen() {

    const initialTodo: ITodo = {
        id: 0,
        title: '',
        completed: false
    };

    const { id } = useLocalSearchParams()
    const [todo, setTodo] = useState<ITodo>(initialTodo)
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)
    const router = useRouter()

    const [loaded, error] = useFonts({
        Inter_500Medium,
    })

    useEffect(() => {
        const fetchData = async (id: string | string[]) => {
            try {
                const jsonValue = await AsyncStorage.getItem("TodoApp")
                const storedTodos = jsonValue != null ? JSON.parse(jsonValue) : null
                
                if(storedTodos && storedTodos.length) {
                    const currentTodo = storedTodos.find((todo: ITodo) => todo.id.toString() === id)
                    setTodo(currentTodo)
                }
            } catch(e) {
                console.error(e)
            }
        }

        fetchData(id)
    }, [id])

    if(!loaded && !error) {
        return null
    }

    const styles = createStyles(theme, colorScheme)

    const handleSave = async () => {
        try {
            const editedTodo = { ...todo, title: todo.title}

            const jsonValue = await AsyncStorage.getItem("TodoApp")
            const storedTodos = jsonValue != null ? JSON.parse(jsonValue) : null

            if(storedTodos && storedTodos.length) {
                const remainingTodos = storedTodos.filter((todo: ITodo) => todo.id !== editedTodo.id)
                const allTodos = [...remainingTodos, editedTodo]
                await AsyncStorage.setItem("TodoApp", JSON.stringify(allTodos))
            } else {
                await AsyncStorage.setItem("TodoApp", JSON.stringify([editedTodo]))
            }

            router.push('/')
        } catch (e) {
            console.error(e)
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input}
                    placeholder="Edit Todo"
                    placeholderTextColor="gray"
                    value={todo?.title || ''}
                    onChangeText={(text) => setTodo(prev => ({ ...prev, title: text}))}
                />
            </View>
            <View style={[styles.modalButtons]}>
                <Pressable
                    onPress={handleSave}
                    style={[styles.modalButton, styles.saveBtn]}
                >
                    <Text style={styles.btnTxt}>Save</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push('/')}
                    style={[styles.modalButton, styles.cancelBtn]}
                >
                    <Text style={styles.btnTxt}>Cancel</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

function createStyles(theme: ITheme, colorScheme: string | null | undefined) {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            backgroundColor: theme.background
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            gap: 6,
            width: '100%',
            maxWidth: 1024,
            marginHorizontal: 'auto',
            pointerEvents: 'auto'
        },
        input: {
            flex: 1,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            fontSize: 18,
            fontFamily: 'Inter_500Medium',
            minWidth: 0,
            color: theme.text
        },
        modalButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 15,
            gap: 10,
        },
        modalButton: {
            flex: 1,
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
        },
        saveBtn: {
            backgroundColor: '#029404',
        },
        cancelBtn: {
            backgroundColor: '#c80000'
        },
        btnTxt: {
            fontSize: 18,
            fontFamily: 'Inter_500Medium',
            color: colorScheme === 'dark' ? 'white' : 'black'
        },
    })
}
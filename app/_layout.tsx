import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/context/ThemeContext";

import { Amplify } from 'aws-amplify';
import amplifyconfig from '../src/amplifyconfiguration.json';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';

Amplify.configure(amplifyconfig);

function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />  
          <Stack.Screen name="todos/[id]" />  
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
    
  )
}

export default withAuthenticator(RootLayout)

// retrieves only the current value of 'user' from 'useAuthenticator'
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { View, Text, Pressable, StyleSheet} from "react-native";

// const userSelector = (context) => [context.user];

const SignOutButton = () => {
  const { user, signOut } = useAuthenticator();
  const styles = createStyles()
  return (
    <View>
        <Text style={styles.buttonText}> 
            Hello, {user.username}! 
        </Text>
        <Pressable onPress={signOut} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>
            Sign out!
        </Text>
        </Pressable>
    </View>
  );
};

function createStyles() {
    return StyleSheet.create({
        buttonContainer: {
            backgroundColor: '#007bff',
            padding: 10,
            borderRadius: 5,
            alignItems: 'center'
        },
        buttonText: {
            color: 'white',
            fontWeight: 'bold'
        }
    })
}

export default SignOutButton
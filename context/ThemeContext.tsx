import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";
import { Appearance } from "react-native";
import { Colors } from "@/constants/Colors";

interface ThemeContextType {
  colorScheme: "light" | "dark" | null | undefined;
  setColorScheme: Dispatch<SetStateAction<"light" | "dark" | null | undefined>>;
  theme: typeof Colors.dark | typeof Colors.light;
}

export const ThemeContext = createContext<ThemeContextType>({
  colorScheme: 'light',
  setColorScheme: () => null,
  theme: Colors.light
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

    return (
        <ThemeContext.Provider 
          value={{ colorScheme, setColorScheme, theme }}
        >
          {children}
        </ThemeContext.Provider>
    );
};
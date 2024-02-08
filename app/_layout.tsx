import "../tamagui-web.css";

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { TamaguiProvider } from "tamagui";

import { config } from "../tamagui.config";
import { useFonts } from "expo-font";
import { Dispatch, SetStateAction, useEffect } from "react";
import React from "react";
import { timeEntry, ItemsProvider } from "./shared";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [interLoaded, interError] = useFonts({
        Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
        InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    });

    useEffect(() => {
        if (interLoaded || interError) {
            // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
            SplashScreen.hideAsync();
        }
    }, [interLoaded, interError]);

    if (!interLoaded && !interError) {
        return null;
    }

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();

    return (
        <TamaguiProvider config={config} defaultTheme={colorScheme as any}>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <ItemsProvider>
                    <Stack>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
                    </Stack>
                </ItemsProvider>
            </ThemeProvider>
        </TamaguiProvider>
    );
}

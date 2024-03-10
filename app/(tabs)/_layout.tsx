import { Link, Tabs } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Text, Button, View, Stack } from "tamagui";
import { Plus, AlarmClockPlus, ClipboardList, Settings } from "@tamagui/lucide-icons";



export default function TabLayout() {

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "green",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Clock In",
                    tabBarShowLabel: false,
                    tabBarIcon: (options) => <AlarmClockPlus color={options.color} />,
                    headerRight: () => (
                        <Link href="/modal">
                            <Settings />
                        </Link>
                    ),
                }}
            />
            <Tabs.Screen
                name="timesheet"
                options={{
                    title: "Timesheet",
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => <ClipboardList color={color} />,
                    headerRight: () => (
                        <Link href="/modal">
                            <Settings />
                        </Link>
                    ),
                }}
            />
        </Tabs>
    );
}

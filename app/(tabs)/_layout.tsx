import { Link, Tabs } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { Text, Button } from "tamagui";
import { Plus, AlarmClockPlus, ClipboardList } from "@tamagui/lucide-icons";

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
                        <Link href="/modal" asChild>
                            <Pressable>
                                <Text>Modal</Text>
                            </Pressable>
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
                }}
            />
        </Tabs>
    );
}

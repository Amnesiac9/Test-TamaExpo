import { Link, Tabs } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { Text } from "tamagui";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "red",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Clock In",
                    tabBarIcon: ({ color }) => <Text>Hello!</Text>,
                    headerRight: () => (
                        <Link href="/modal" asChild>
                            <Pressable>
                                <Text>Hello!</Text>
                            </Pressable>
                        </Link>
                    ),
                }}
            />
            <Tabs.Screen
                name="todo"
                options={{
                    title: "Todo",
                    tabBarIcon: ({ color }) => <Text>Hello!</Text>,
                }}
            />
            <Tabs.Screen
                name="timesheet"
                options={{
                    title: "Timesheet",
                    tabBarIcon: ({ color }) => <Text>Hello!</Text>,
                }}
            />
        </Tabs>
    );
}

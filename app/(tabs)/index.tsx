import React from "react";
import * as SQLite from "expo-sqlite";
import { Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { SQLError } from "expo-sqlite";
import { Theme, Text, View, H2, Button, Separator } from "tamagui";

function openDatabase() {
    if (Platform.OS === "web") {
        return {
            transaction: () => {
                return {
                    executeSql: () => {},
                };
            },
        };
    }

    const db = SQLite.openDatabase("db.db");
    return db;
}

export const db = openDatabase();

export const addTime = (text: string, forceUpdate: () => void) => {
    // is text empty?
    if (text === null || text === "") {
        return false;
    }

    db.transaction(
        (tx) => {
            tx.executeSql("insert into items (done, value) values (0, ?)", [text]);
            tx.executeSql("select * from items", [], (_, { rows }) => console.log(JSON.stringify(rows)));
        },
        (error: SQLError) => {
            console.error("An error occurred while executing the transaction:", error);
        },
        forceUpdate as () => void // forceUpdate is a function, but TypeScript doesn't know that?
    );
};

function handleAddTime() {
    addTime("test", () => {});
}

export default function TabOneScreen() {
    return (
        <View flex={1} alignItems="center">
            <Theme name="blue">
                <Separator marginVertical={20} />
                <Separator marginVertical={20} />
                <H2>Clock In</H2>
                <Separator borderWidth={0.5} width={"75%"} marginVertical={20} />
                <Separator marginVertical={100} />
                <Button>Clock In</Button>
                <Separator borderWidth={0.5} width={"50%"} marginVertical={20} />
                <Button onPress={handleAddTime}>Add Time</Button>
                <View>
                    <Separator borderWidth={0.5} width={"50%"} marginVertical={20} />
                    <Button>View Timecard</Button>
                    <Separator borderWidth={0.5} width={"50%"} marginVertical={20} />
                </View>
            </Theme>
        </View>
    );
}

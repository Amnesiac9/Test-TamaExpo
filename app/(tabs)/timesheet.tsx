import { useState, useEffect, useContext } from "react";
import { Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Text, View } from "tamagui";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";
import { SQLError } from "expo-sqlite";
import React from "react";
import { ItemsContext, addTime, db, deleteTime, updateTime, useForceUpdate } from "../shared";

interface ItemsProps {
    done: boolean;
    onPressItem: (id: number) => void; //(id: number) => void replace with the actual type
}

interface TimeCardProps {
    // add: (text: string, forceUpdate: () => void) => void; // replace with the actual type
    addTime: typeof addTime;
    db: SQLite.SQLiteDatabase;
}

interface Item {
    id: number;
    done: boolean;
    value: string;
    // add other properties here...
}

function Items({ done: doneHeading, onPressItem }: ItemsProps) {
    const { items, setItems } = useContext(ItemsContext);

    // useEffect(() => {
    //     if (items === null) {
    //         db.transaction((tx) => {
    //             tx.executeSql(`select * from items where done = ?;`, [doneHeading ? 1 : 0], (_, { rows: { _array } }) => setItems(_array));
    //         });
    //     }
    // }, []);

    // useEffect(() => {
    //     forceUpdate();
    // }, [items]);

    if (items === null || items.length === 0) {
        return null;
    }

    const heading = doneHeading ? "Completed" : "Todo";

    // Filter items based on their done status
    const filteredItems = items.filter((item) => Boolean(item.done) === doneHeading);

    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>{heading}</Text>
            {filteredItems.map(({ id, done, value }) => (
                <TouchableOpacity
                    key={id}
                    onPress={() => onPressItem(id)} // onPressItem &&
                    style={{
                        backgroundColor: done ? "#1c9963" : "#fff",
                        borderColor: "#000",
                        borderWidth: 1,
                        padding: 8,
                    }}
                >
                    <Text style={{ color: done ? "#fff" : "#000" }}>{value}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
//{ done: doneHeading, onPressItem, db }: ItemsProps
export default function TimeCard() {
    const [text, setText] = React.useState<string | null>(null);
    const { items, setItems } = useContext(ItemsContext);
    // const [forceUpdate, forceUpdateId] = useForceUpdate();

    useEffect(() => {
        db.transaction((tx: SQLite.SQLTransaction) => {
            tx.executeSql("create table if not exists items (id integer primary key not null, done int, value text);");
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>SQLite Example</Text>

            {Platform.OS === "web" ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={styles.heading}>Expo SQlite is not supported on web!</Text>
                </View>
            ) : (
                <>
                    <View style={styles.flexRow}>
                        <TextInput
                            onChangeText={(text) => setText(text)}
                            onSubmitEditing={() => {
                                if (text === null) {
                                    return;
                                }
                                addTime(text, setItems);
                                setText(null);
                            }}
                            placeholder="what do you need to do?"
                            style={styles.input}
                            value={text ?? undefined}
                        />
                    </View>
                    <ScrollView style={styles.listArea}>
                        <Items key={`forceupdate-todo`} done={false} onPressItem={(id) => updateTime(id, setItems)} />
                        <Items key={`forceupdate-done`} done={true} onPressItem={(id) => deleteTime(id, setItems)} />
                    </ScrollView>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    flexRow: {
        flexDirection: "row",
    },
    input: {
        borderColor: "#4630eb",
        borderRadius: 4,
        borderWidth: 1,
        flex: 1,
        height: 48,
        margin: 16,
        padding: 8,
    },
    listArea: {
        backgroundColor: "#f0f0f0",
        flex: 1,
        paddingTop: 16,
    },
    sectionContainer: {
        marginBottom: 16,
        marginHorizontal: 16,
    },
    sectionHeading: {
        fontSize: 18,
        marginBottom: 8,
    },
});

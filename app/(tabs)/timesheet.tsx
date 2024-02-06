import { useState, useEffect } from "react";
import { Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Text, View } from "tamagui";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";
import { SQLError } from "expo-sqlite";
import React from "react";
import { addTime, db } from "./index";

interface ItemsProps {
    done: boolean;
    onPressItem: (id: number) => void; // replace with the actual type
    db: SQLite.SQLiteDatabase;
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

function Items({ done: doneHeading, onPressItem, db: db }: ItemsProps) {
    const [items, setItems] = useState<Item[] | null>(null);

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(`select * from items where done = ?;`, [doneHeading ? 1 : 0], (_, { rows: { _array } }) => setItems(_array));
        });
    }, []);

    const heading = doneHeading ? "Completed" : "Todo";

    if (items === null || items.length === 0) {
        return null;
    }

    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>{heading}</Text>
            {items.map(({ id, done, value }) => (
                <TouchableOpacity
                    key={id}
                    onPress={() => onPressItem && onPressItem(id)}
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
    const [forceUpdate, forceUpdateId] = useForceUpdate();

    useEffect(() => {
        db.transaction((tx) => {
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
                                addTime(text, forceUpdate as () => void);
                                setText(null);
                            }}
                            placeholder="what do you need to do?"
                            style={styles.input}
                            value={text ?? undefined}
                        />
                    </View>
                    <ScrollView style={styles.listArea}>
                        <Items
                            db={db}
                            key={`forceupdate-todo-${forceUpdateId}`}
                            done={false}
                            onPressItem={(id) =>
                                db.transaction(
                                    (tx) => {
                                        tx.executeSql(`update items set done = 1 where id = ?;`, [id]);
                                    },
                                    (error: SQLError) => {
                                        console.error("An error occurred while executing the transaction:", error);
                                    },
                                    forceUpdate as () => void // forceUpdate is a function, but TypeScript doesn't know that?
                                )
                            }
                        />
                        <Items
                            db={db}
                            done
                            key={`forceupdate-done-${forceUpdateId}`}
                            onPressItem={(id) =>
                                db.transaction(
                                    (tx) => {
                                        tx.executeSql(`delete from items where id = ?;`, [id]);
                                    },
                                    (error: SQLError) => {
                                        console.error("An error occurred while executing the transaction:", error);
                                    },
                                    forceUpdate as () => void // forceUpdate is a function, but TypeScript doesn't know that?
                                )
                            }
                        />
                    </ScrollView>
                </>
            )}
        </View>
    );
}

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return [() => setValue(value + 1), value];
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

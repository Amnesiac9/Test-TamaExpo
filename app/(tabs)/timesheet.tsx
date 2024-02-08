import { useEffect, useContext } from "react";
import { Platform, StyleSheet } from "react-native";
import { Theme, Text, View, ListItem, Separator, Group, XGroup, YGroup, YStack, ScrollView } from "tamagui";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";
import React from "react";
import { ItemsContext, addTime, db, deleteTime, updateTime, useForceUpdate, createTimesheetTable } from "../shared";

interface ItemsProps {
    onPressItem: (id: number) => void; //(id: number) => void replace with the actual type
}

interface TimeCardProps {
    // add: (text: string, forceUpdate: () => void) => void; // replace with the actual type
    addTime: typeof addTime;
    db: SQLite.SQLiteDatabase;
}

function Items({ onPressItem }: ItemsProps) {
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

    // const heading = doneHeading ? "Completed" : "Todo";

    // // Filter items based on their done status
    // const filteredItems = items.filter((item) => Boolean(item.done) === doneHeading);

    return (
        <>
            <Text>Timesheet</Text>
            {items.map(({ id, date, startTime, endTime, hours, wages, note }) => (
                <XGroup orientation="vertical" separator={<Separator />} padding="$3" space="$2">
                    <Group.Item>
                        <Text>{date}</Text>
                    </Group.Item>
                    <Group.Item>
                        <Text>{startTime}</Text>
                    </Group.Item>
                    <Group.Item>
                        <Text>{endTime}</Text>
                    </Group.Item>
                    <Group.Item>
                        <Text>{hours}</Text>
                    </Group.Item>
                    <Group.Item>
                        <Text>{wages}</Text>
                    </Group.Item>
                    <Group.Item>
                        <Text>{note}</Text>
                    </Group.Item>
                </XGroup>
                // <TouchableOpacity
                //     key={id}
                //     onPress={() => onPressItem(id)} // onPressItem &&
                //     style={{
                //         // backgroundColor: done ? "#1c9963" : "#fff",
                //         borderColor: "#000",
                //         borderWidth: 1,
                //         padding: 8,
                //     }}
                // >
                //     <Text style={{ color: done ? "#fff" : "#000" }}>{value}</Text>
                // </TouchableOpacity>
            ))}
        </>
    );
}
//{ done: doneHeading, onPressItem, db }: ItemsProps
export default function TimeCard() {
    const { items, setItems } = useContext(ItemsContext);

    useEffect(() => {
        createTimesheetTable();
    }, []);

    return (
        <Theme name="green">
            {/* <View> */}
            {Platform.OS === "web" ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={styles.heading}>Expo SQlite is not supported on web!</Text>
                </View>
            ) : (
                <ScrollView width="100%" backgroundColor="$gray2Dark" padding="$4" borderRadius="$4">
                    <Items key={`times`} onPressItem={(id) => deleteTime(id, setItems)} />
                </ScrollView>
            )}
            {/* </View> */}
        </Theme>
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

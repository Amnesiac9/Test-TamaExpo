import { useEffect, useContext } from "react";
import { Platform } from "react-native";
import { Theme, Text, View, ListItem, Separator, Group, XGroup, YGroup, YStack, XStack, ScrollView, Button, ThemeableStack } from "tamagui";
import Constants from "expo-constants";
import React from "react";
import { ItemsContext, addTime, db, deleteTime, updateTime, useForceUpdate, createTimesheetTable, fetchItems } from "../shared";

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
                    <Text>Expo SQlite is not supported on web!</Text>
                </View>
            ) : (
                <Items key={`times`} onPressItem={(id) => deleteTime(id, setItems)} />
            )}
            {/* </View> */}
        </Theme>
    );
}

interface ItemsProps {
    onPressItem: (id: number) => void; //(id: number) => void replace with the actual type
}

function Items({ onPressItem }: ItemsProps) {
    const { items, setItems } = useContext(ItemsContext);

    useEffect(() => {
        if (items === null) {
            fetchItems(setItems);
        }
    }, []);

    // useEffect(() => {
    //     forceUpdate();
    // }, []);

    if (items === null || items.length === 0) {
        return null;
    }

    // const heading = doneHeading ? "Completed" : "Todo";

    // // Filter items based on their done status
    // const filteredItems = items.filter((item) => Boolean(item.done) === doneHeading);

    return (
        <ScrollView width="100%" padding="$1" borderRadius="$1">
            <ThemeableStack flex={5} gap={5}>
                {/* <Text>Timesheet</Text> */}
                {/* Items inside a map need a unique KEY! */}
                {items.map(({ id, date, startTime, endTime, hours, wages, note }) => (
                    <ThemeableStack
                        key={id}
                        bordered
                        borderRadius={15}
                        padded
                        backgroundColor={"$background"}
                        onPress={() => onPressItem(id)}
                        style={{ alignItems: "left" }}
                        maxHeight={120}
                        flexDirection="column"
                        flexWrap="wrap"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                    >
                        <Text width="50%">{date}</Text>
                        <Text width="50%">Start: {startTime}</Text>
                        <Text width="50%">End: {endTime}</Text>
                    </ThemeableStack>
                ))}
            </ThemeableStack>
        </ScrollView>
    );
}

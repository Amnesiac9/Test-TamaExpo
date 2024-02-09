import { useEffect, useContext } from "react";
import { Platform } from "react-native";
import { Theme, Text, View, ListItem, Separator, Group, XGroup, YGroup, YStack, ScrollView, Button } from "tamagui";
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
                <ScrollView width="100%" padding="$4" borderRadius="$4">
                    <Items key={`times`} onPressItem={(id) => deleteTime(id, setItems)} />
                </ScrollView>
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
        <YStack padding="$3" gap="$3">
            {/* <Text>Timesheet</Text> */}
            {/* <Group orientation="horizontal">
                <ListItem>First</ListItem>
                <ListItem>First</ListItem>
                <Button>Test</Button>
            </Group> */}

            {items.map(({ id, date, startTime, endTime, hours, wages, note }) => (
                <XGroup orientation="horizontal" maxWidth={"50%"} onPress={() => onPressItem(id)}>
                    <XGroup.Item>
                        <ListItem>{date}</ListItem>
                    </XGroup.Item>
                    <Group.Item>
                        <Text>{startTime}</Text>
                    </Group.Item>
                    {/* <Group.Item>
                            <Text>{endTime}</Text>
                        </Group.Item>
                        <Group.Item>
                            <Text>{hours}</Text>
                        </Group.Item>
                        <Group.Item>
                            <Text>{wages}</Text>
                        </Group.Item> */}
                    {/* <XGroup.Item>
                        <ListItem>{note}</ListItem>
                    </XGroup.Item> */}
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
        </YStack>
    );
}

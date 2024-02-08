import React, { useContext } from "react";
import { Theme, Text, View, H2, Button, Separator } from "tamagui";
import { addTime, useForceUpdate, ItemsContext } from "../shared";

export default function TabOneScreen() {
    const { items, setItems } = useContext(ItemsContext);

    function handleAddTime() {
        // Fake input for now

        const date = new Date();
        const startTime = new Date().setHours(9, 0, 0, 0);
        const endTime = new Date().setHours(17, 0, 0, 0);
        const hours = endTime - startTime;

        const timeEntry = {
            id: 0,
            date: date.toDateString(),
            startTime: startTime.toString(),
            endTime: endTime.toString(),
            hours: hours,
            wages: hours * 15,
            note: "Lunch",
        };

        addTime(timeEntry, setItems);
    }

    return (
        <View flex={1} alignItems="center">
            <Theme name="green">
                <Separator marginVertical={20} />
                <Separator marginVertical={20} />
                <H2>Clock In</H2>
                <Separator borderWidth={0.5} width={"75%"} marginVertical={20} />
                <Separator marginVertical={100} />
                {/* <View width={"75%"}> */}
                <Button>Clock In</Button>
                <Separator borderWidth={0.5} width={"50%"} marginVertical={20} />
                <Button onPress={() => handleAddTime()}>Add Time</Button>
                <Separator borderWidth={0.5} width={"50%"} marginVertical={20} />
                <Button>View Timecard</Button>
                {/* </View> */}
            </Theme>
        </View>
    );
}

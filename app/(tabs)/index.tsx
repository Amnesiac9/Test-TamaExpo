import React, { useContext } from "react";
import { Theme, Text, View, H2, Button, Separator } from "tamagui";
import { addTime, useForceUpdate, ItemsContext } from "../shared";

export default function TabOneScreen() {
    const { items, setItems } = useContext(ItemsContext);

    function handleAddTime(time: string) {
        addTime(time, setItems);
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
                <Button onPress={() => handleAddTime("10:50")}>Add Time</Button>
                <Separator borderWidth={0.5} width={"50%"} marginVertical={20} />
                <Button>View Timecard</Button>
                {/* </View> */}
            </Theme>
        </View>
    );
}

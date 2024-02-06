import React from "react";
import { Theme, Text, View, H2, Button, Separator } from "tamagui";

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
                <Button>Add Time</Button>
                <View>
                    <Separator borderWidth={0.5} width={"50%"} marginVertical={20} />
                    <Button>View Timecard</Button>
                    <Separator borderWidth={0.5} width={"50%"} marginVertical={20} />
                </View>
            </Theme>
        </View>
    );
}

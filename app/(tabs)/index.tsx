import React from "react";
import { Theme, Text, View, H2, Button, Separator } from "tamagui";

export default function TabOneScreen() {
    return (
        <Theme name="blue">
            <View flex={1} alignItems="center">
                <Separator marginVertical={20} />
                <H2>Record Time</H2>
                <Separator marginVertical={20} />
                <Button>Clock In</Button>
            </View>
        </Theme>
    );
}

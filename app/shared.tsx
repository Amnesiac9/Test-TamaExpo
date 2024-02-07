import { SQLError } from "expo-sqlite";
import * as SQLite from "expo-sqlite";
import React, { ReactNode, SetStateAction, Dispatch, useEffect } from "react";
import { useState } from "react";
import { Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";

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

export function useForceUpdate() {
    const [value, setValue] = useState(0);
    return [() => setValue(value + 1), value];
}

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
        forceUpdate // forceUpdate is a function, but TypeScript doesn't know that?
    );
};

export const deleteTime = (id: number, forceUpdate: () => void) => {
    db.transaction(
        (tx: SQLite.SQLTransaction) => {
            tx.executeSql(`delete from items where id = ?;`, [id]);
        },
        (error: SQLError) => {
            console.error("An error occurred while executing the transaction:", error);
        },
        forceUpdate // forceUpdate is a function, but TypeScript doesn't know that?
    );
};

export const updateTime = (id: number, forceUpdate: () => void) => {
    db.transaction(
        (tx: SQLite.SQLTransaction) => {
            tx.executeSql(`update items set done = 1 where id = ?;`, [id]);
        },
        (error: SQLError) => {
            console.error("An error occurred while executing the transaction:", error);
        },
        forceUpdate // forceUpdate is a function, but TypeScript doesn't know that?
    );
};

export interface Item {
    id: number;
    done: boolean;
    value: string;
    // add other properties here...
}

const ItemsContext = React.createContext({
    items: null as Item[] | null,
    setItems: (() => {}) as Dispatch<SetStateAction<Item[] | null>>,
});

function ItemsProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<Item[] | null>(null);

    // Function to fetch items from database
    // const fetchItems = () => {
    //   db.transaction((tx) => {
    //     tx.executeSql(`select * from items where done = ?;`, [doneHeading ? 1 : 0], (_, { rows: { _array } }) => setItems(_array));
    //   });
    // };

    // Fetch items when component mounts
    // useEffect(fetchItems, []);

    return <ItemsContext.Provider value={{ items, setItems }}>{children}</ItemsContext.Provider>;
}

export { ItemsContext, ItemsProvider };

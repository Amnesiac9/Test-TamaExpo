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

export const fetchItems = (setItems: Dispatch<SetStateAction<timeEntry[] | null>>) => {
    db.transaction(
        (tx) => {
            tx.executeSql("select * from timesheet", [], (_, resultSet) => {
                const items = resultSet.rows._array;
                setItems(items);
            });
        },
        (error: SQLError) => {
            console.error("An error occurred while executing the transaction:", error);
        }
    );
};

export const addTime = (timeEntry: timeEntry, setItems: Dispatch<SetStateAction<timeEntry[] | null>>) => {
    // is text empty?
    if (timeEntry === null || timeEntry.date === "") {
        return false;
    }

    db.transaction(
        (tx) => {
            tx.executeSql("insert into timesheet (date, startTime, endTime, hours, wages, notes) values (?, ?, ?, ?, ?, ?)", [
                timeEntry.date,
                timeEntry.startTime,
                timeEntry.endTime,
                timeEntry.hours,
                timeEntry.wages,
                timeEntry.note,
            ]);
        },
        (error: SQLError) => {
            console.error("An error occurred while executing the transaction:", error);
        },
        () => fetchItems(setItems) // Fetch all items after the new item has been added
    );
};

export const deleteTime = (id: number, setItems: Dispatch<SetStateAction<timeEntry[] | null>>) => {
    db.transaction(
        (tx: SQLite.SQLTransaction) => {
            tx.executeSql(`delete from timesheet where id = ?;`, [id]);
        },
        (error: SQLError) => {
            console.error("An error occurred while executing the transaction:", error);
        },
        () => fetchItems(setItems) // Fetch all items after the new item has been added
    );
};

export const updateTime = (id: number, setItems: Dispatch<SetStateAction<timeEntry[] | null>>) => {
    db.transaction(
        (tx: SQLite.SQLTransaction) => {
            tx.executeSql(`update timesheet set date = date where id = ?;`, [id]);
        },
        (error: SQLError) => {
            console.error("An error occurred while executing the transaction:", error);
        },
        () => fetchItems(setItems) // Fetch all items after the new item has been added
    );
};

/**
 * Interface for a time entry.
 *
 * @property {number} id - The unique ID of the time entry.
 * @property {string} date - The date of the time entry, in the format 'YYYY-MM-DD'.
 * @property {string} startTime - The start time of the time entry, in the format 'HH:MM:SS'.
 * @property {string} endTime - The end time of the time entry, in the format 'HH:MM:SS'.
 * @property {number} hours - The number of hours worked.
 * @property {number} wages - The wages earned for the time entry.
 * @property {string} notes - Any additional notes for the time entry.
 */
export interface timeEntry {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    hours: number;
    wages: number;
    note: string;
}

const ItemsContext = React.createContext({
    items: null as timeEntry[] | null,
    setItems: (() => {}) as Dispatch<SetStateAction<timeEntry[] | null>>,
});

function ItemsProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<timeEntry[] | null>(null);

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

export function createTimesheetTable() {
    db.transaction((tx: SQLite.SQLTransaction) => {
        tx.executeSql(`
            CREATE TABLE IF NOT EXISTS timesheet (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                startTime TEXT NOT NULL,
                endTime TEXT NOT NULL,
                hours REAL NOT NULL,
                wages REAL NOT NULL,
                notes TEXT
            );
        `);
    });
}

import React, { useCallback, useMemo, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getNotes } from "../storage/notesStorage";
import { Note } from "../types/note";
import NoteCard from "../components/NoteCard";

export default function HomeScreen() {
    const router = useRouter();
    const [notes, setNotes] = useState<Note[]>([]);
    const [search, setSearch] = useState("");

    const loadNotes = async () => {
        const storedNotes = await getNotes();
        setNotes(storedNotes);
    };

    useFocusEffect( // This is important because new notes won't show after you add them.
        useCallback(() => {
            loadNotes();
        }, [])
    );

    const filteredNotes = useMemo(() => { // This prevents unnecessary recalculation
        return notes.filter(
            (note) =>
                note.title.toLowerCase().includes(search.toLowerCase()) ||
                note.content.toLowerCase().includes(search.toLowerCase())
        );
    }, [notes, search]); // This enable filteredNotes to recalculate when notes or search changes

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Notes</Text>

            <TextInput
                placeholder="Search notes..."
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
            />

            <FlatList
                data={filteredNotes}
                keyExtractor={(item) => item.id} // Gives each item a unique key
                renderItem={({ item }) => (
                    <NoteCard
                        note={item}
                        onPress={() =>
                            router.push({
                                pathname: "/note/[id]",
                                params: { id: item.id },
                            })
                        }
                    />
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No notes found.</Text>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push("/add-note")}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 16, 
        backgroundColor: "#fff" 
    },
    header: { 
        fontSize: 28, 
        fontWeight: "bold", 
        marginBottom: 16 
    },
    searchInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        color: "#888",
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#111",
        justifyContent: "center",
        alignItems: "center",
    },
    fabText: { 
        color: "#fff", 
        fontSize: 28, 
        fontWeight: "bold" 
    },
});
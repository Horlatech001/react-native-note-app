import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { getNotes, saveNotes } from "../../storage/notesStorage";
import { Note } from "../../types/note";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null); //Stores the current note being viewed. Value is set as null because initially, no note is loaded yet.

  const loadNote = useCallback(async () => { // This function is to fetch one note. The use of callback is important for hook like useEffect
    const notes = await getNotes();
    const foundNote = notes.find((n) => n.id === id) || null;
    setNote(foundNote);
  }, [id]); // This reloads note if ID changes

  useFocusEffect( // This runs loadNote when screen is focused or opened. UseEffect runs once while useFocusEffect runs everytime user returns to screen.
    useCallback(() => {
      loadNote();
    }, [loadNote])
  );

  const handleDelete = async () => {
    if (!note) return; // If there is no note, stop execution.

    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const notes = await getNotes();
          const updatedNotes = notes.filter((n) => n.id !== note.id); // This keeps all notes EXCEPT the note being deleted.
          await saveNotes(updatedNotes);
          router.replace("/"); // Make use of replace to prevents user from going back to deleted note.
        },
      },
    ]);
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Note not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.content}>{note.content}</Text>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
          router.push({
            pathname: "/add-note",
            params: {
              id: note.id,
              title: note.title,
              content: note.content,
            },
          })
        }
      >
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  content: { fontSize: 16, lineHeight: 24, color: "#444", marginBottom: 30 },
  editButton: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
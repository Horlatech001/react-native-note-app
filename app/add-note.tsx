import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getNotes, saveNotes } from "../storage/notesStorage";
import { Note } from "../types/note";

export default function AddNoteScreen() {
  const router = useRouter();

  // Get params (for edit mode)
  const { id, title: paramTitle, content: paramContent } = 
    useLocalSearchParams<{
      id?: string;
      title?: string;
      content?: string;
    }>(); //paramTitle and paramContent are value from navigation

  const isEdit = !!id; // Converts id into a boolean

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Pre-fill fields if editing
  useEffect(() => {
    if (isEdit) {
      setTitle(paramTitle || "");
      setContent(paramContent || "");
    }
  }, [isEdit, paramTitle, paramContent]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Validation", "Please fill in both title and content.");
      return;
    }

    const notes = await getNotes();

    if (isEdit) {
      // UPDATE existing note
      const updatedNotes = notes.map((note) =>
        note.id === id
          ? {
              ...note,
              title,
              content,
              updatedAt: new Date().toISOString(),
            }
          : note
      );

      await saveNotes(updatedNotes);
    } else {

      // CREATE new note
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveNotes([newNote, ...notes]);
    }

    router.back();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Note title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Write your note..."
        value={content}
        onChangeText={setContent}
        style={[styles.input, styles.textArea]}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {isEdit ? "Update Note" : "Save Note"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  textArea: {
    height: 180,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
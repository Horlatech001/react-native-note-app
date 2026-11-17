import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Note } from "../types/note";

type Props = {
  note: Note;
  onPress: () => void;
};

export default function NoteCard({ note, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.content} numberOfLines={2}>
        {note.content}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f4f4f4",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  content: {
    color: "#555",
  },
});
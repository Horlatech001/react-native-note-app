import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "../types/note";

const NOTES_KEY = "notes_app_notes"; //This is the name of where the data is stored inside LocalStorage

export const saveNotes = async (notes: Note[]) => {
  try {
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error("Error saving notes:", error);
  }
};

export const getNotes = async (): Promise<Note[]> => {   //This getNotes function will return an array of notes.
  try {
    const data = await AsyncStorage.getItem(NOTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting notes:", error);
    return []; // This ensures the app still works even if storage fails
  }
};
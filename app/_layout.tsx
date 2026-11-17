import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "My Notes" }} />
      <Stack.Screen name="add-note" options={{ title: "Add Note" }} />
      <Stack.Screen name="note/[id]" options={{ title: "Note Details" }} />
    </Stack>
  );
}
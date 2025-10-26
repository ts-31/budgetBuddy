import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: {
      reducer(state, action) {
        state.messages.push(action.payload);
      },
      prepare({ from, text }) {
        return {
          payload: {
            id: nanoid(),
            from,
            text,
            ts: Date.now(),
          },
        };
      },
    },
    clearMessages(state) {
      state.messages = [];
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },
  },
});

export const { addMessage, clearMessages, setMessages } = chatSlice.actions;
export default chatSlice.reducer;

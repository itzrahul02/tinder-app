import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
  name: string;
  age: number;
  location: string;
  photo: string;
  email: string;
  bio: string;
};

interface HistoryAction {
  type: "swipeLeft" | "swipeRight" | "removeLiked";
  user: User;
  index?: number; // for removeLiked
}

interface UserState {
  users: User[];
  currentIndex: number;
  likedUsers: User[];
  history: HistoryAction[]; // store past actions for undo
}

const initialState: UserState = {
  users: [],
  currentIndex: 0,
  likedUsers: [],
  history: [],
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    swipeRight: (state) => {
      const currentUser = state.users[state.currentIndex];
      if (currentUser) {
        state.likedUsers.push(currentUser);
        state.history.push({ type: "swipeRight", user: currentUser });
      }
      state.currentIndex++;
    },
    swipeLeft: (state) => {
      const currentUser = state.users[state.currentIndex];
      if (currentUser) {
        state.history.push({ type: "swipeLeft", user: currentUser });
      }
      state.currentIndex++;
    },
    setLikedUsers: (state, action: PayloadAction<User[]>) => {
      state.likedUsers = action.payload;
    },
    removeLikedUser: (state, action: PayloadAction<number>) => {
      const removed = state.likedUsers[action.payload];
      if (removed) {
        state.history.push({
          type: "removeLiked",
          user: removed,
          index: action.payload,
        });
        state.likedUsers.splice(action.payload, 1);
      }
    },
    resetIndex: (state) => {
      state.currentIndex = 0;
    },
    undoSwipe: (state) => {
      const last = state.history.pop();
      if (!last) return;

      switch (last.type) {
        case "swipeRight":
          // remove from liked
          state.likedUsers = state.likedUsers.filter(
            (u) => u.email !== last.user.email
          );
          state.currentIndex = Math.max(0, state.currentIndex - 1);
          break;
        case "swipeLeft":
          state.currentIndex = Math.max(0, state.currentIndex - 1);
          break;
        case "removeLiked":
          if (last.index !== undefined) {
            state.likedUsers.splice(last.index, 0, last.user);
          }
          break;
      }
    },
  },
});

export const {
  setUsers,
  swipeRight,
  swipeLeft,
  setLikedUsers,
  removeLikedUser,
  resetIndex,
  undoSwipe,
} = userSlice.actions;

export default userSlice.reducer;

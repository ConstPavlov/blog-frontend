import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/auth';
import { postsReducer } from './slices/posts';
import { commentReducer } from './slices/comments';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
    comments: commentReducer,
  },
});

export default store;

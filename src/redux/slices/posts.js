import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts');
  return data;
});
export const fetchPopularPosts = createAsyncThunk('posts/fetchPopularPosts', async () => {
  const { data } = await axios.get('/posts/popular');
  return data;
});

export const fetchTags = createAsyncThunk('tags/fetchTags', async () => {
  const { data } = await axios.get('/tags');
  return data;
});

export const fetchRemovePost = createAsyncThunk('tags/fetchRemovePost', async (id) => {
  axios.delete(`/posts/${id}`);
});

const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    // Получение всех постов
    builder.addCase(fetchPosts.pending, (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    });
    builder.addCase(fetchPosts.rejected, (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    });

    // Получение популярных постов
    builder.addCase(fetchPopularPosts.pending, (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    });
    builder.addCase(fetchPopularPosts.fulfilled, (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    });
    builder.addCase(fetchPopularPosts.rejected, (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    });

    // Полусение тэгов
    builder.addCase(fetchTags.pending, (state) => {
      state.tags.items = [];
      state.tags.status = 'loading';
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = 'loaded';
    });
    builder.addCase(fetchTags.rejected, (state) => {
      state.tags.items = [];
      state.tags.status = 'error';
    });

    // Удаление поста
    builder.addCase(fetchRemovePost.pending, (state, action) => {
      state.posts.items = state.posts.items.filter((post) => post._id !== action.meta.arg);
    });
  },
});


export const postsReducer = postsSlice.reducer;

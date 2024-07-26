import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchComments = createAsyncThunk('comments/fetchComments', async () => {
  const { data } = await axios.get('/comments');
  return data;
});

export const fetchAddComment = createAsyncThunk(
  'add-comment/fetchAddComment',
  async ({ id, text }) => {
    const { data } = await axios.post(`/add-comment${id}`, { text });
    return data;
  },
);

export const fetchPostComments = createAsyncThunk('postComments/fetchPostComments', async (id) => {
  const { data } = await axios.get(`/posts/${id}/comments`);
  return data.comments;
});

const initialState = {
  items: [],
  postComments: [],
  quantityComments: 0,
  newComment: null,
  status: 'loading',
};

const CommentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},

  //Получение комментов ВСЕХ

  extraReducers: (builder) => {
    builder.addCase(fetchComments.pending, (state, action) => {
      state.items = [];
      state.status = 'loading';
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = 'loaded';
    });
    builder.addCase(fetchComments.rejected, (state, action) => {
      state.items = [];
      state.status = 'error';
    });

    //Добавление однного коммента

    builder.addCase(fetchAddComment.pending, (state, action) => {
      state.newComment = null;
      state.status = 'loading';
    });
    builder.addCase(fetchAddComment.fulfilled, (state, action) => {
      state.newComment = action.payload;
      state.status = 'loaded';
    });
    builder.addCase(fetchAddComment.rejected, (state, action) => {
      state.newComment = null;
      state.status = 'error';
    });

    //Получение комментов у конкретнного поста

    builder.addCase(fetchPostComments.pending, (state, action) => {
      state.postComments = [];
      state.quantityComments = 0;
      state.status = 'loading';
    });
    builder.addCase(fetchPostComments.fulfilled, (state, action) => {
      state.postComments = action.payload;
      state.quantityComments = action.payload.length;
      state.status = 'loaded';
    });
    builder.addCase(fetchPostComments.rejected, (state, action) => {
      state.postComments = [];
      state.quantityComments = 0;
      state.status = 'error';
    });
  },
});

// export const selectCommentsByPostId = () => (state) => {
//   return state.comment.postComments.length;
// };

export const commentReducer = CommentSlice.reducer;

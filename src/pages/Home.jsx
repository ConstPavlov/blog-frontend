import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import axios from '../axios';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularPosts, fetchPosts, fetchTags } from '../redux/slices/posts';
import { fetchPostComments } from '../redux/slices/comments';
import { Link } from 'react-router-dom';
import { fetchComments, selectCommentsByPostId } from '../redux/slices/comments';

export const Home = () => {
  const dispatch = useDispatch();

  const { posts, tags } = useSelector((state) => state.posts);
  // const commList = useSelector((state) => state.comments.items);
  const commStatus = useSelector((state) => state.comments.status);
  const userData = useSelector((state) => state.auth.data);

  const [valueTab, setValueTab] = React.useState(0);
  const [commentsMapPost, setCommentsMapPost] = React.useState({});
  const [lastComments, setLastComments] = React.useState([]);

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isCommLoading = commStatus === 'loading';

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchPosts());
        dispatch(fetchTags());
        const allComments = await dispatch(fetchComments());

        const postCommentsMap = {};
        allComments.payload.forEach((comment) => {
          const postId = comment.post;
          postCommentsMap[postId] = postCommentsMap[postId] || [];
          postCommentsMap[postId].push(comment);
          // postCommentsMap[postId] = ;
        });
        setCommentsMapPost(postCommentsMap);

        const { data } = await axios.get('/lastComments');
        setLastComments(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const onClickNew = () => {
    dispatch(fetchPosts());
  };
  const onClickPopular = () => {
    dispatch(fetchPopularPosts());
  };

  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };
  // console.log(postComments);

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={valueTab}
        onChange={handleChange}
        aria-label="basic tabs example">
        <Tab component={Link} to="/" onClick={onClickNew} label="New" />
        <Tab component={Link} to="/posts/popular" onClick={onClickPopular} label="Popular" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((post, idx) =>
            isPostsLoading ? (
              <Post key={idx} isLoading={true} />
            ) : (
              <Post
                id={post._id}
                key={post._id}
                title={post.title}
                imageUrl={post.imageUrl ? `${process.env.REACT_APP_API_URL}${post.imageUrl}` : ''}
                user={post.user}
                createdAt={post.createdAt}
                viewsCount={post.viewsCount}
                commentsCount={commentsMapPost[post._id] ? commentsMapPost[post._id].length : 0}
                tags={post.tags}
                isEditable={Boolean(userData?._id === post.user._id)}
              />
            ),
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={
              lastComments

              // {
              //   user: {
              //     fullName: 'Вася Пупкин',
              //     avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
              //   },
              //   text: 'Это тестовый комментарий',
              // },
              // {
              //   user: {
              //     fullName: 'Иван Иванов',
              //     avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
              //   },
              //   text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              // },
            }
            isLoading={isCommLoading}
          />
        </Grid>
      </Grid>
    </>
  );
};

// function CommentsCount({ postId }) {
//   const comments = useSelector(selectCommentsByPostId(postId));
//   console.log(comments);

//   return <p>Количество комментариев: {comments.length}</p>;
// }

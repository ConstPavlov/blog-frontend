import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import { Post } from '../components/Post';
import { AddComment, Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import axios from '../axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddComment, fetchPostComments } from '../redux/slices/comments';

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [commentsPost, setCommentsPost] = React.useState([]);
  const userData = useSelector((state) => state.auth.data);
  const { postComments } = useSelector((state) => state.comments);
  const dispatch = useDispatch();
  // const [text, setText] = React.useState('');
  const [comments, setComments] = React.useState();
  const navigate = useNavigate();
  // const commentsData = useSelector((state) => state.comments.items);
  console.log(commentsPost);
  const [isLoading, setIsLoading] = React.useState(true);
  const { id } = useParams();

  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        alert('Ошибка при получении статьи');
      });

    const fetchComments = async () => {
      const dataComm = await dispatch(fetchPostComments(id));
      setCommentsPost(dataComm.payload);
      console.log(dataComm);
    };
    fetchComments();

    // axios
    //   .get(`/posts/${id}/comments`)
    //   .then((res) => {
    //     setCommentsPost(res.data.comments);
    //     // setIsLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err, 'Комментариев еще нет');
    //     setCommentsPost([]);
    //   });
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }
  console.log(data);

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={commentsPost ? commentsPost.length : 0}
        tags={data.tags}
        isEditable={Boolean(userData?._id === data.user._id)}
        isFullPost>
        <Markdown>{data.text}</Markdown>
      </Post>
      <CommentsBlock
        items={
          postComments
          // ({
          //   user: {
          //     fullName: 'Иван Иванов',
          //     avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
          //   },
          //   text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
          // },
          // {
          //   user: {
          //     fullName: 'Иван Иванов',
          //     avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
          //   },
          //   text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
          // })
        }
        isLoading={isLoading}>
        <AddComment info={data} />
      </CommentsBlock>
    </>
  );
};

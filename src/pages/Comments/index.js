import { useDropdown } from '@mui/base';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CommentsBlock } from '../../components';
import { fetchComments } from '../../redux/slices/comments';

const Comments = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.comments);
  const isPostsLoading = status === 'loading';
  React.useEffect(() => {
    const fetching = () => {
      dispatch(fetchComments());
    };
    try {
      fetching();
    } catch (error) {
      console.warn(error, 'Не удалось сделать запрос на комментарии');
    }
  }, []);
  return (
    <div style={{ backgroundColor: 'yellow' }}>
      {/* {items.map((item) => (
        <CommentsBlock />
      ))} */}
      {(isPostsLoading ? [...Array(5)] : items).map((comm) => (
        <CommentsBlock />
      ))}
    </div>
  );
};

export default Comments;

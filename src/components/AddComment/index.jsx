import React from 'react';

import styles from './AddComment.module.scss';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import axios from '../../axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchAddComment, fetchPostComments } from '../../redux/slices/comments';

export const AddComment = ({ info }) => {
  const [text, setText] = React.useState('');
  const [comments, setComments] = React.useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log(text);

  const onSubmit = React.useCallback(async () => {
    // const { dataComments } = await axios.post(`/add-comment${id}`, { text });
    // setComments(dataComments);
    dispatch(fetchAddComment({ id, text }));
    setText('');
    dispatch(fetchPostComments(id));
    // console.log(dataComments.comment);
    navigate(`/posts/${id}`);
  });

  const onChangeTextFeld = (event) => {
    setText(event.target.value);
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src={info.imageUrl} />
        <div className={styles.form}>
          <TextField
            value={text}
            onChange={onChangeTextFeld}
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
          />
          <Button onClick={onSubmit} variant="contained">
            Отправить
          </Button>
        </div>
      </div>
    </>
  );
};

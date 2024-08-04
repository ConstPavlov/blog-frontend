import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { selectIsAuth } from '../../redux/slices/auth';

import axios from '../../axios';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setIsLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const inputFileRef = React.useRef(null);

  const isEditing = Boolean(id);

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);

      const { data } = await axios.post('/upload', formData);
      console.log(data);
      setImageUrl('');
      setImageUrl(data.url);
    } catch (error) {
      console.warn(error);
      alert('Error uploading the file');
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const fields = {
        title,
        tags: tags,
        imageUrl,
        text,
      };
      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (error) {
      console.warn(error);
      alert('Error when creating an article');
    }
  };

  React.useEffect(() => {
    if (id) {
      axios
        .get(`posts/${id}`)
        .then(({ data }) => {
          setImageUrl(data.imageUrl);
          setTitle(data.title);
          setTags(data.tags.join(','));
          setText(data.text);
        })
        .catch((err) => {
          console.error(err);
          alert('Error when receiving the article');
        });
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Enter the text...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Download the preview
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <Button onClick={onClickRemoveImage} variant="contained" color="error">
          Remove
        </Button>
      )}
      {imageUrl && (
        <img className={styles.image} src={`${process.env.REACT_APP_API_URL}${imageUrl}`} alt="Uploaded" />
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="The title of the article..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags, specify the tags separated by commas..."
        fullWidth
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Save' : 'To publish'}
        </Button>
        <Button size="large">Cancel</Button>
      </div>
    </Paper>
  );
};

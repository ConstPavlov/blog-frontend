import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';

import styles from './Login.module.scss';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));
    console.log(data);

    if (!data.payload) {
      alert('Failed to register');
    }

    // if (!data.payload && data.payload.error === 'ERR_BAD_RESPONSE') {
    //   setError('fullName', {
    //     type: 'manual',
    //     message: 'Введите корректные данные',
    //   });
    // }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };
  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography classes={{ root: styles.title }} variant="h5">
          Creating an account
        </Typography>
        <div className={styles.avatar}>
          <Avatar sx={{ width: 100, height: 100 }} />
        </div>
        <TextField
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Specify the full name' })}
          className={styles.field}
          label="Full name"
          fullWidth
        />
        <TextField
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register('email', { required: 'Specify the email address' })}
          className={styles.field}
          label="E-Mail"
          fullWidth
        />
        <TextField
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Enter the password' })}
          className={styles.field}
          type="password"
          label="Password"
          fullWidth
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Sign Up
        </Button>
      </form>
    </Paper>
  );
};

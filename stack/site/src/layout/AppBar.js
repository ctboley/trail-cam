import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useChangeTheme } from '../theme';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const MyAppBar = (props) => {
  const { title } = props;
  const classes = useStyles();
  const changeTheme = useChangeTheme();

  return (
    <Box className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <Button variant="text" color="inherit" onClick={() => changeTheme()}>
            Change Theme
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

MyAppBar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default MyAppBar;

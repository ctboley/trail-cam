import React from 'react';
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import { getSession } from "./utils";
import Dashboard from './layout/Dashboard';
import { createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import ThemeProvider from './theme';

const App = () => {
  const theme = createMuiTheme({
    palette: {
      type: 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dashboard />
    </ThemeProvider>
  );
};

export default App;

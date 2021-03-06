import React from 'react';
import { createMuiTheme, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';

import { useTheme } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

const ThemeDispatchContext = React.createContext(null);

const ThemeProvider = ({ children, theme }) => {
  const themeInitialOptions = {
    paletteType: 'light',
  };

  const [themeOptions, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case 'changeTheme':
        return {
          ...state,
          paletteType: action.payload,
        };
      default:
        throw new Error();
    }
  }, themeInitialOptions);

  const memoizedTheme = React.useMemo(() => {
    return createMuiTheme({
      ...theme,
      palette: {
        type: themeOptions.paletteType,
        primary: deepPurple,
      },
    });
  }, [theme, themeOptions.paletteType]);

  return (
    <MuiThemeProvider theme={memoizedTheme}>
      <ThemeDispatchContext.Provider value={dispatch}>{children}</ThemeDispatchContext.Provider>
    </MuiThemeProvider>
  );
};

export default ThemeProvider;

export const useChangeTheme = () => {
  const dispatch = React.useContext(ThemeDispatchContext);
  const theme = useTheme();
  const changeTheme = React.useCallback(
    () =>
      dispatch({
        type: 'changeTheme',
        payload: theme.palette.type === 'light' ? 'dark' : 'light',
      }),
    [theme.palette.type, dispatch]
  );

  return changeTheme;
};

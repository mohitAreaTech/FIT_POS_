export const loadState = () => {
    try {
      const serializedState = localStorage.getItem(process.env.REACT_APP_BUSINESS+'state');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  };
  
  export const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(process.env.REACT_APP_BUSINESS+'state', serializedState);
    } catch (err) {
      // Ignore write errors.
    }
  };
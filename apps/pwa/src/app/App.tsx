import { Provider } from 'react-redux';
import './App.css';
import { store } from './store';

export function App() {
  return (
    <Provider store={store}>
      <div></div>
    </Provider>
  );
}

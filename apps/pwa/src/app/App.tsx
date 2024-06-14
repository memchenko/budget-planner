import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useNavigate, BrowserRouter, Route, Routes } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import './App.css';
import { store, persistor } from './store';
import { Main } from '../screens/main';

const NextUI = (props: PropsWithChildren<{}>) => {
  const navigate = useNavigate();

  return <NextUIProvider navigate={navigate}>{props.children}</NextUIProvider>;
};

export function App() {
  return (
    <BrowserRouter>
      <NextUI>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Routes>
              <Route path="/" element={<Main />} />
            </Routes>
          </PersistGate>
        </Provider>
      </NextUI>
    </BrowserRouter>
  );
}

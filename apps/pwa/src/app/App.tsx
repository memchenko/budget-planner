import { PropsWithChildren } from 'react';
import { useNavigate, BrowserRouter, Route, Routes } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import './App.css';
import { Main } from '../screens/main';

const NextUI = (props: PropsWithChildren<{}>) => {
  const navigate = useNavigate();

  return <NextUIProvider navigate={navigate}>{props.children}</NextUIProvider>;
};

export function App() {
  return (
    <BrowserRouter>
      <NextUI>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </NextUI>
    </BrowserRouter>
  );
}

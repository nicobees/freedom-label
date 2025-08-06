// const API_ENDPOINT = 'http://localhost:8000'; // this is the host name of the backend server

import React from 'react';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

const Counter = ({ increase }: { increase?: (() => void) | null }) => {
  console.log('inside Counter: ');

  const handleClick = increase ? increase : () => {};

  return <button onClick={handleClick}>Increase</button>;
};

const CounterMemoized = React.memo(Counter);

const Show = ({ count }: { count: number }) => {
  console.log('inside Show: ', count);

  return <div>Count: {count}</div>;
};

window.tempObject = {
  0: undefined,
  1: undefined,
  2: undefined,
  3: undefined,
  4: undefined,
  5: undefined,
};

export function App() {
  const [count, setCount] = useState(0);

  const increase = useCallback(() => {
    console.info('inside increase');
    setCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    window.tempObject = { ...window.tempObject, [count]: increase };

    console.info('inside useEffect: ', count, window.tempObject);
  }, [count, increase]);

  console.info('inside main: ', count, window.tempObject);

  return (
    <>
      <Counter />
      <button onClick={() => setCount((prev) => prev + 1)}>Increase 2</button>
      <Show count={count} />
    </>
  );
}

export default App;

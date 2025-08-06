// const API_ENDPOINT = 'http://localhost:8000'; // this is the host name of the backend server

import { useEffect, useState } from 'react';

const Counter = ({ increase }: { increase?: (() => void) | null }) => {
  console.log('inside Counter: ');

  const handleClick = increase ? increase : () => {};

  return <button onClick={handleClick}>Increase</button>;
};

// const CounterMemoized = React.memo(Counter);

const Show = ({ count }: { count: number }) => {
  console.log('inside Show: ', count);

  return <div>Count: {count}</div>;
};

export function App() {
  const [count, setCount] = useState(0);
  const [color, setColor] = useState('blue');

  // const increase = () => {
  //   console.info('inside increase');
  //   setCount((prev) => prev + 1);
  // };

  useEffect(() => {
    // window.tempObject = { ...window.tempObject, [count]: increase };

    console.info('inside useEffect: ', count);
  }, [count]);

  const chartOptions = { color: color, theme: 'dark' };

  // console.info('inside main: ', count, window.tempObject);

  return (
    <>
      <Counter />
      <button onClick={() => setCount((prev) => prev + 1)}>Increase 2</button>
      <Show count={count} />
      <button onClick={() => setColor('red')}>Change Color</button>
      <Chart options={chartOptions} />
    </>
  );
}

function Chart({ options }: { options: { color: string; theme: string } }) {
  useEffect(() => {
    console.log('Options object changed, re-initializing chart...');
    // ... logic to re-draw a chart
  }, [options]); // This effect relies on the 'options' object reference

  return <div>Chart</div>;
}

export default App;

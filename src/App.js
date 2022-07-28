import './App.css';
import { useState, useEffect } from 'react';

const formatMsToTime = (ms) => {
  const sec = ms / 1000;

  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor(sec % 3600 / 60);
  const seconds = Math.floor(sec % 3600 % 60);

  return `${hours} : ${minutes} : ${seconds}`;
}

function App() {

  const [seconds, setSeconds] = useState(null)
  const [minutes, setMinutes] = useState(null)
  const [hours, setHours] = useState(null)
  const [countdown, setCountdown] = useState({ lastTick: undefined, timeRemainingMs: undefined, })

  const [running, setRunning] = useState(false)

  function handleSubmit(e) {
    e.preventDefault();
    setRunning(true);
  }

  useEffect(() => {
    if (running) {
      const hoursInMs = (hours || 0) * 60 * 60 * 1000;
      const minsInMs = (minutes || 0) * 60 * 1000;
      const secInMs = (seconds || 0) * 1000;
      setCountdown({
        lastTick: Date.now(),
        timeRemainingMs: hoursInMs + minsInMs + secInMs,
      })
      
      const interval = setInterval(() => {
        setCountdown(({ lastTick, timeRemainingMs}) => {
          if (timeRemainingMs <= 0) {
            setRunning(false);
            return {
              lastTick: undefined,
              timeRemainingMs: undefined,
            };
          }
          return {
            lastTick: Date.now(),
            timeRemainingMs: timeRemainingMs - (Date.now() - lastTick),
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [running]);

  return (
    <>
    <div className="app">
      {!running &&
        <form onSubmit={handleSubmit}>
          <>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              placeholder="HH"
              min={0}
            />
            :
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              placeholder="MM"
              min={0}
            />
            :
            <input
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(Number(e.target.value))}
              placeholder="SS"
              min={0}
            />
            <button type="submit">Start</button>
          </>
        </form>
      }
      {running && 
        <>
          {formatMsToTime(countdown.timeRemainingMs)}
          <button>Pause</button>
          <button
            onClick={() => {
              setRunning(false);
              setSeconds(undefined);
              setMinutes(undefined);
              setHours(undefined);
            }}
          >
            Reset
          </button>
        </>
      }
      </div>
    </>
  );
}


export default App;

import { useState, useEffect, useMemo } from "react";
import { timeConverter } from "./helpers";
import { modesList, defaultTime, defaultTimerState } from "./constants";
import { SettingModal } from "./components";

import successAudio from "./assets/audio/success.wav";

function App() {
  const [mode, setMode] = useState(modesList[0]);
  const [time, setTime] = useState(defaultTime);
  const [timerValue, setTimerValue] = useState(time[mode]);
  const [timerId, setTimer] = useState(null);
  const [timerState, setTimerState] = useState(defaultTimerState);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompletedCount, setIsCompletedCount] = useState(0);
  const conertedValue = useMemo(() => timeConverter(timerValue), [timerValue]);
  const audio = useMemo(() => new Audio(successAudio), []);

  useEffect(() => {
    resetCircleOutline();
  }, []);

  useEffect(() => {
    runCircleOutline();
  }, [timerValue]);

  useEffect(() => {
    setTimerValue(time[mode]);
  }, [mode, time]);

  const resetCircleOutline = () => {
    const circle = document.querySelector(".timer__moving-outline circle");
    const circleLength = circle.getTotalLength();

    circle.style.strokeDasharray = circleLength;
    circle.style.strokeDashoffset = circleLength;
  };

  const runCircleOutline = () => {
    const circle = document.querySelector(".timer__moving-outline circle");
    const circleLength = circle.getTotalLength();

    const currentSeconds = timerValue;
    const defaultSeconds = time[mode];
    const progress = (currentSeconds / defaultSeconds) * circleLength;

    circle.style.strokeDashoffset = progress;
    circle.style.strokeWidth = isPlaying ? 10 : 0;
  };

  const runTimer = () => {
    clearInterval(timerId);
    const newTimerId = setInterval(() => {
      setTimerValue((timerValue) => {
        if (timerValue < 1) {
          clearInterval(newTimerId);
          completeTimer();
          return 0;
        } else {
          return timerValue - 1;
        }
      });
    }, 1000);
    setTimer(newTimerId);
  };

  const startTimer = () => {
    if (isPlaying) return;
    runTimer();

    setIsPlaying(true);
  };

  const pauseTimer = () => {
    clearInterval(timerId);
    setTimerState({
      ...timerState,
      isPaused: true,
    });
  };

  const stopTimer = () => {
    clearInterval(timerId);
    setTimerValue(time[mode]);
    setIsPlaying(false);
    setTimerState(defaultTimerState);
  };

  const continueTimer = () => {
    runTimer();
    setTimerState({
      ...timerState,
      isPaused: false,
    });
  };

  const completeTimer = () => {
    let newMode = "";
    const idx = modesList.findIndex((value) => value === mode);
    if (idx === 0) {
      setIsCompletedCount(isCompletedCount + 1);
      newMode = isCompletedCount === time.nTimes ? modesList[2] : modesList[1];
      audio.play();
    } else {
      newMode = modesList[0];
      if (idx === 2) {
        setIsCompletedCount(0);
      }
    }

    setMode(newMode);
    setTimerState(defaultTimerState);
    setIsPlaying(false);
  };

  const renderButtons = () => {
    if (!isPlaying) {
      return (
        <button className="button" onClick={startTimer}>
          Play
        </button>
      );
    }
    if (timerState.isPaused) {
      return (
        <>
          <button className="button" onClick={continueTimer}>
            Continue
          </button>
          <button className="button" onClick={stopTimer}>
            Stop
          </button>
        </>
      );
    } else {
      return (
        <button className="button" onClick={pauseTimer}>
          Pause
        </button>
      );
    }
  };
  return (
    <div className={`App ${mode} ${isPlaying}`}>
      <div className="timer">
        <div className="timer__outlines">
          <h2 className="timer__value">{conertedValue}</h2>
          <svg className="timer__moving-outline" viewBox="0 0 453 453">
            <circle cx="226.5" cy="226.5" r="216.5" />
          </svg>
        </div>

        <div className="timer__btns">{renderButtons()}</div>
      </div>
      <SettingModal time={time} setTime={setTime} stopTimer={stopTimer} />
    </div>
  );
}

export default App;

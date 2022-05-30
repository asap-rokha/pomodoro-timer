import React from "react";
import Modal from "react-modal";
import { convertInSeconds, convertInMinutes } from "../helpers";

import settingsImg from "../assets/icons/settings.svg";

const customStyles = {
  overlay: {
    backgroundColor: "transparent",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "24px 16px",
    borderRadius: "20px",
    borderColor: "white",
    background:
      "linear-gradient(90deg, #F78CA0 0%, #F9748F 20.31%, #FD868C 66.67%, #FE9A8B 100%)",
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

export function SettingModal({ time, setTime, stopTimer }) {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function toggleModal() {
    setIsOpen(!modalIsOpen);
  }

  function onClose() {
    setIsOpen(false);
  }

  function onSave(e) {
    e.preventDefault();
    const { elements } = e.target;
    let work = convertInSeconds(elements.work.value);
    let shortBreak = convertInSeconds(elements.shortBreak.value);
    let longBreak = convertInSeconds(elements.longBreak.value);
    let nTimes = elements.nTimes.value;
    let newTimerState = {};
    let values = { work, shortBreak, longBreak, nTimes };
    for (const [key, value] of Object.entries(values)) {
      if (value > 0) newTimerState = { ...newTimerState, [key]: value };
    }
    setTime({ ...time, ...newTimerState });
    setIsOpen(false);
    stopTimer();
  }

  return (
    <div className="settingsModal">
      <img
        className="settingsModal__openBtn"
        onClick={toggleModal}
        src={settingsImg}
        alt=""
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={onClose}
        style={customStyles}
        contentLabel="Settings Modal"
      >
        <form onSubmit={onSave} className="settingsModal__form">
          <label className="settingsModal__label" htmlFor="work">
            Pomodoro
          </label>
          <input
            className="settingsModal__input"
            id="work"
            name="work"
            type="number"
            placeholder={convertInMinutes(time.work)}
          />
          <label className="settingsModal__label" htmlFor="work">
            Short Break
          </label>
          <input
            className="settingsModal__input"
            id="shortBreak"
            name="shortBreak"
            type="number"
            placeholder={convertInMinutes(time.shortBreak)}
          />
          <label className="settingsModal__label" htmlFor="work">
            Long Break
          </label>
          <input
            className="settingsModal__input"
            id="longBreak"
            name="longBreak"
            type="number"
            placeholder={convertInMinutes(time.longBreak)}
          />
          <label className="settingsModal__label" htmlFor="work">
            Number of Pomodoros between breaks
          </label>
          <input
            className="settingsModal__input"
            id="nTimes"
            name="nTimes"
            type="number"
            placeholder={time.nTimes}
          />

          <div className="settingsModal__btns">
            <button onClick={onClose} className="button">
              Close
            </button>
            <button type="submit" className="button">
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

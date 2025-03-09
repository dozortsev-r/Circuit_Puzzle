import { useState, useEffect } from "react";
import Cell from "./Cell.jsx";
import AlertPopup from "./AlertPopup.jsx";

const NUM_COLUMNS = 20;
const NUM_ROWS = 15;

export default function App() {
  const levelOneMessage = "Level 1: Create a circuit with an equivalent resistance of 20 with two resistors in series."
  const levelTwoMessage = "Wow you're really good at this. On to level two! \n Level 2: Dylan that looks really good"
  const [gameState, setGameState] = useState(
    Array.from({ length: NUM_ROWS }, () =>
      Array.from({ length: NUM_COLUMNS }).fill(null)
    )
  );
  const [level, setLevel] = useState(1);
  const [isAlertPopupOpen, setIsAlertPopupOpen] = useState(false);
  //default to levelOne message
  const [alertMessage, setAlertMessage] = useState(levelOneMessage)
  const [closeButton, setCloseButton] = useState("Start")

  useEffect(() => {
    console.log(level);
    setCloseButton("Start")
    if (level === 1) {
      let newGameState = Array.from({ length: NUM_ROWS }, () =>
        Array.from({ length: NUM_COLUMNS }).fill(null)
      );
      for (let col = 2; col <= 7; col++) {
        newGameState[2][col] = {
          type: "wire_h",
        };
      }
      for (let col = 2; col <= 8; col++) {
        newGameState[5][col] = {
          type: "wire_h",
        };
      }
      newGameState[5][1] = {
        type: "wire_c",
      };
      for (let row = 2; row <= 5; row++) {
        newGameState[row][1] = {
          type: "wire_v",
        };
      }
      newGameState[3][1] = {
        type: "voltage source",
      };
      for (let row = 2; row <= 4; row++) {
        newGameState[row][8] = {
          type: "wire_v",
        };
      }
      newGameState[2][1] = {
        type: "wire_c_tl",
      };
      newGameState[2][8] = {
        type: "wire_c_tr",
      };
      newGameState[5][8] = {
        type: "wire_c_br",
      };
      newGameState[5][1] = {
        type: "wire_c_bl",
      };
      setGameState(newGameState);
      setIsAlertPopupOpen(true);
      setAlertMessage(levelOneMessage)
    } else if (level === 2) {
      let newGameState = Array.from({ length: NUM_ROWS }, () =>
        Array.from({ length: NUM_COLUMNS }).fill(null)
      );
      for (let col = 2; col <= 7; col++) {
        newGameState[2][col] = {
          type: "wire_h",
        };
      }
      for (let col = 2; col <= 8; col++) {
        newGameState[5][col] = {
          type: "wire_h",
        };
      }
      newGameState[5][1] = {
        type: "wire_c",
      };
      newGameState[4][1] = {
        type: "voltage source",
      };
      for (let row = 2; row <= 4; row++) {
        newGameState[row][8] = {
          type: "wire_v",
        };
      }
      newGameState[3][1] = {
        type: "wire_c_tl",
      };
      newGameState[3][2] = {
        type: "wire_h",
      };
      newGameState[3][3] = {
        type: "resistor",
      };
      newGameState[2][8] = {
        type: "wire_c_tr",
      };
      newGameState[5][8] = {
        type: "wire_c_br",
      };
      newGameState[5][1] = {
        type: "wire_c_bl",
      };
      setGameState(newGameState);
      setIsAlertPopupOpen(true);
      setAlertMessage(levelTwoMessage)
    }
    
  }, [level]);

  function checkAnswer() {
    let totalResistance = 0;
    let totalVoltage = 0;

    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLUMNS; col++) {
        const value = gameState[row][col];
        if (value !== null && value.type === "resistor") {
          //if value in column -1 & column +1= wire
          totalResistance += value.resistance;
        }
        if (value !== null && value.type === "voltage source") {
          totalVoltage += value.Voltage;
        }
      }
    }

    const allowedCells = [
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
      [4, 5],
      [4, 6],
      [4, 7],
      [4, 8],
      [7, 1],
      [7, 2],
      [7, 3],
      [7, 4],
      [7, 5],
      [7, 6],
      [7, 7],
      [7, 8],
      [4, 8],
      [5, 8],
      [6, 8],
      [7, 8],
    ];

    let allResistorsInValidPlaces = true;

    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLUMNS; col++) {
        const value = gameState[row][col]; // null or { type: 'resistor', resistance: 10 }

        if (value !== null && value.type === "resistor") {
          const isNotValidPlacement = !allowedCells.some(
            ([r, c]) => r === row && c === col
          );
          if (value !== null && value.type === "voltage source") {
            const isNotValidPlacement = !allowedCells.some(
              ([r, c]) => r === row && c === col
            );
            if (isNotValidPlacement) {
              allResistorsInValidPlaces = false;
            }
          }
        }
      }

      const isCorrect = totalResistance === 20 && allResistorsInValidPlaces;

      if (isCorrect) {
        setAlertMessage("Correct Solution!")
        setCloseButton("Continue")
        setIsAlertPopupOpen(true);
      } else {
        setAlertMessage("Incorrect solution, keep trying.")
        setCloseButton("Try Again")
        setIsAlertPopupOpen(true);
      }
      return;
    }
  }
  return isAlertPopupOpen ? (
      <AlertPopup 
        isAlertPopupOpen={isAlertPopupOpen} 
        setIsAlertPopupOpen={setIsAlertPopupOpen}
        closeButton = {closeButton}
        message = {alertMessage}
      />
    ) : (
    <div>

      <div className="p-4 grid grid-cols-[150px_1fr]">
        <div>
          <p>Levels</p>
          <div className="mt-2 flex space-x-2">
            <button
              className="bg-blue-400 text-white px-2 py-1 rounded-md font-medium"
              onClick={() => setLevel(1)}
            >
              1
            </button>
            <button
              className="bg-blue-400 text-white px-2 py-1 rounded-md font-medium"
              onClick={() => setLevel(2)}
            >
              2
            </button>
            <button
              className="bg-blue-400 text-white px-2 py-1 rounded-md font-medium"
              onClick={() => setLevel(3)}
            >
              3
            </button>
          </div>

          <div className="mt-8">
            <button
              onClick={checkAnswer}
              className="bg-pink-500 text-white font-medium px-2 py-1 rounded-md"
            >
              Check Answer
            </button>
          </div>
        </div>

        <div className="relative border min-h-screen">
          {gameState.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-0"
              style={{ gridTemplateColumns: `repeat(${NUM_COLUMNS}, 80px)` }}
            >
              {row.map((value, cellIndex) => (
                <Cell
                  key={cellIndex}
                  row={rowIndex}
                  col={cellIndex}
                  gameState={gameState}
                  setGameState={setGameState}
                />
              ))}
            </div>
          ))}

          {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img src="/wire_horiz.png" className="w-half" />
          </div> */}
        </div>
      </div>
    </div>
  );
}

//use object oriented to create levels

import { useState } from "react";

const NUM_COLUMNS = 10;
const NUM_ROWS = 12;

export default function App() {
  const [gameState, setGameState] = useState(
    Array.from({ length: NUM_ROWS }, () =>
      Array.from({ length: NUM_COLUMNS }).fill(null)
    )
  );

  console.log(gameState);

  function checkAnswer() {
    let totalResistance = 0;

    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLUMNS; col++) {
        const value = gameState[row][col];
        if (value !== null && value.type === "resistor") {
          totalResistance += value.resistance;
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

          if (isNotValidPlacement) {
            allResistorsInValidPlaces = false;
          }
        }
      }
    }

    const isCorrect = totalResistance === 20 && allResistorsInValidPlaces;

    if (isCorrect) {
      alert("Correct solution!");
    } else {
      alert("Incorrect solution, keep trying.");
    }
  }

  return (
    <div className="p-4 grid grid-cols-[150px_1fr]">
      <div>
        <p>Levels</p>
        <div className="mt-2">
          <button className="bg-blue-500 text-white px-2 py-1 rounded-md font-medium">
            1
          </button>
        </div>

        <div className="mt-8">
          <button
            onClick={checkAnswer}
            className="bg-red-500 text-white font-medium px-2 py-1 rounded-md"
          >
            Check Answer
          </button>
        </div>
      </div>

      <div className="relative border min-h-screen">
        {gameState.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid"
            style={{ gridTemplateColumns: `repeat(${NUM_COLUMNS}, 1fr)` }}
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

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src="/Box.svg" className="w-half" />
        </div>
      </div>
    </div>
  );
}

function Cell({ row, col, gameState, setGameState }) {
  const value = gameState[row][col];

  return (
    <button
      className="border aspect-square hover:bg-gray-100 transition-colors"
      onClick={() => {
        if (value) {
          const newGameState = structuredClone(gameState);
          newGameState[row][col] = null;
          setGameState(newGameState);
        } else {
          const element = prompt(
            "Enter what element you want to add (resistor, capacitor):"
          );

          if (element === "resistor") {
            const resistance = prompt("Enter the resistance value:");

            if (resistance && !isNaN(resistance)) {
              const newGameState = structuredClone(gameState);
              newGameState[row][col] = {
                type: "resistor",
                resistance: Number(resistance),
              };
              setGameState(newGameState);
            }
          }
        }
      }}
    >
      {value && value.type === "resistor" && (
        <div>
          <img src="/resistor.png" />
          <p className="text-lg font-bold">{value.resistance} Ω</p>
        </div>
      )}
    </button>
  );
}

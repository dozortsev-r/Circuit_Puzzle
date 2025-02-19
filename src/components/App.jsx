import { useState,useEffect } from "react";

const NUM_COLUMNS = 10;
const NUM_ROWS = 12;

export default function App() {
  const [gameState, setGameState] = useState(
    Array.from({ length: NUM_ROWS }, () =>
      Array.from({ length: NUM_COLUMNS }).fill(null)
    )
  );
  const [level, setLevel] = useState(1);

  useEffect(() => {
    console.log(gameState);
    const newGameState =  Array.from({ length: NUM_ROWS }, () =>
      Array.from({ length: NUM_COLUMNS }).fill(null)
    );
    for (let col = 2; col <= 7; col++) {
      newGameState[2][col] = {
        type: "wire_h"
      };
    }
    for (let col = 2; col <= 8; col++) {
      newGameState[5][col] = {
        type: "wire_h"
      };
    }
    newGameState[5][1] = {
      type: "wire_c"
    }
    for (let row = 2; row <= 5; row++) {
      newGameState[row][1] = {
        type: "wire_v",
      };
      newGameState[3][1] = {
        type: "voltage source"
      }
    }
    for (let row = 2; row <= 4; row++) {
      newGameState[row][8] = {
        type: "wire_v"
      };
    }
    newGameState[2][1] = {
      type: "wire_c_tl"
    }
    newGameState[2][8] = {
      type: "wire_c_tr"
    }
    newGameState[5][8] = {
      type: "wire_c_br"
    }
    newGameState[5][1] = {
      type: "wire_c_bl"
    }
    setGameState(newGameState)
    alert("Create a circuit with an equivalent resistence of 20 with two resistors in series")
  }, [level]);


  function checkAnswer() {
    let totalResistance = 0;
    let totalVoltage = 0;

    for (let row = 0; row < NUM_ROWS; row++) {
      for (let col = 0; col < NUM_COLUMNS; col++) {
        const value = gameState[row][col];
        if (value !== null && value.type === "resistor") { //if value in column -1 & column +1= wire
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
      alert("Correct solution!");
    } else {
      alert("Incorrect solution, keep trying.");
    }
    return;
  }
  }
  return (
    <div className="p-4 grid grid-cols-[150px_1fr]">
      <div>
        <p>Levels</p>
        <div className="mt-2">
          <button 
            className="bg-blue-500 text-white px-2 py-1 rounded-md font-medium"
            onClick= {() => setLevel(1)}
          >
            {level}
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
        
        {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src="/wire_horiz.png" className="w-half" />
        </div> */}
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
            "Enter what element you want to add (resistor, voltage source, capacitor):"
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
          if (element === "voltage source") {
            const Voltage = prompt("Enter the voltage value:");
            if (Voltage && !isNaN(Voltage)) {
              const newGameState = structuredClone(gameState);
              newGameState[row][col] = {
                type: "voltage source",
                Voltage: Number(Voltage),
              };
              setGameState(newGameState);
            }
            
          }
      }}
    }
    >
      {value && value.type === "resistor" && (
        <div className = "w-32 h-32 flex flex-col items-center justify-start">
          <p className="text-lg font-bold mt-3">{value.resistance} Ω</p>
          <img src="/resistor.png"/>
        </div>
      )}
      {value && value.type === "voltage source" && (
        <div className="w-25 h-32 flex items-center justify-center overflow-hidden">
          <p className="absolute item-start justify-center text-lg font-bold bg-white bg-opacity-75 px-1 rounded">
            {value.Voltage} V
          </p>
          <img src="/Voltage_Source.png" className="w-full h-full object-contain" />
      </div>
      )}
      {value && value.type === "wire_h" && (
        <div className="w-32 h-32 flex items-center justify-center overflow-hidden">
          <img src="/wire_horiz.png" className="w-full h-full object-contain" />
      </div>
      )}
      {value && value.type === "wire_v" && (
        <div className="w-32 h-32 flex items-center justify-center overflow-hidden">
          <img src="/wire_vert.png" className="w-full h-full object-contain" />
      </div>
      )}
      {value && value.type === "wire_c_tl" && (
        <div className="w-32 h-32 flex item-half item-half overflow-hidden">
          <img src="/wire_corn_tl.png" className="w-full h-full object-contain mt-10 ml-9" />
      </div>
      )}
      {value && value.type === "wire_c_tr" && (
        <div className="w-32 h-32 flex item-half item-half overflow-hidden">
          <img src="/wire_corn_tr.png" className="w-full h-full object-contain mt-10 mr-20" />
      </div>
      )}
      {value && value.type === "wire_c_br" && (
        <div className="w-32 h-32 flex item-half item-half overflow-hidden">
          <img src="/wire_corn_br.png" className="w-half h-half object-contain mb-12 mr-12" />
      </div>
      )}
      {value && value.type === "wire_c_bl" && (
        <div className="w-32 h-32 flex item-half item-half overflow-hidden">
          <img src="/wire_corn_bl.png" className="w-half h-half object-contain mb-11 ml-12" />
      </div>
      )}
    </button>
  );
}
//use object oriented to create levels

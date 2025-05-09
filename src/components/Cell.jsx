export default function Cell({ row, col, gameState, setGameState }) {
  const value = gameState[row][col];

  return (
    <button
      className="border w-20 h-20 hover:bg-gray-100 transition-colors"
      style={{ padding: 0, margin: 0, boxSizing: "border-box" }}
      onClick={() => {
        if (value) {
          const newGameState = structuredClone(gameState);
          newGameState[row][col] = null;
          setGameState(newGameState);
        } else {
          const element = prompt(
            "Enter what element you want to add (resistor, vertical resistor, voltage source, capacitor):"
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
          if (element === "vertical resistor") {
            const resistance = prompt("Enter the resistance value:");

            if (resistance && !isNaN(resistance)) {
              const newGameState = structuredClone(gameState);
              newGameState[row][col] = {
                type: "vertical resistor",
                resistance: Number(resistance),
              };
              setGameState(newGameState);
            }
          }
          if (element === "voltage source") {
            const voltage = prompt("Enter the voltage value:");
            if (voltage && !isNaN(voltage)) {
              const newGameState = structuredClone(gameState);
              newGameState[row][col] = {
                type: "voltage source",
                voltage: Number(voltage),
              };
              setGameState(newGameState);
            }
          }
          if (element === "capacitor") {
            const capacitance = prompt("Enter the capacitance value:");
            if (capacitance && !isNaN(capacitance)) {
              const newGameState = structuredClone(gameState);
              newGameState[row][col] = {
                type: "capacitor",
                capacitance: Number(capacitance),
              };
              setGameState(newGameState);
            }
          }
        }
      }}
    >
      {value && value.type === "resistor" && (
        <div className="flex flex-col items-center justify-start overflow-hidden">
          <p className="text-sm font-bold">{value.resistance} Ω</p>
          <img src="/resistor.png" className="w-half h-half object-contain mb-5"/>
          
        </div>
      )}
      {value && value.type === "vertical resistor" && (
        <div className="flex flex-row items-center justify-start overflow-visible">
          <p className="text-sm font-bold transform rotate-90">{value.resistance} Ω</p>
          <img src="/resistor_v.png" className="absolute w-20 h-20 object-contain"/>
          
        </div>
      )}
      {value && value.type === "capacitor" && (
        <div className="flex flex-col items-center justify-start overflow-hidden">
          <p className="text-sm font-bold">{value.capacitance} F</p>
          <img src="/Capacitor.svg.png" className="w-half h-half object-contain mb-20"/>
          
        </div>
      )}
      {value && value.type === "voltage source" && (
        <div className="flex items-center justify-center overflow-hidden">
          <p className="absolute item-start justify-center text-sm font-bold bg-white bg-opacity-75 px-1 rounded ml-1">
            {value.voltage} V
          </p>
          <img src="/Voltage_Source.png" className="w-20 h-20 object-contain ml-1" />
        </div>
      )}
      {value && value.type === "wire_h" && (
        <div className="flex items-center justify-center overflow-hidden">
          <img src="/wire_horiz.png" className="w-full h-full object-contain" />
        </div>
      )}
      {value && value.type === "wire_v" && (
        <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
          <img src="/wire_vert.png" className="w-full h-full object-contain" />
        </div>
      )}
      {value && value.type === "wire_c_tl" && (
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
          <img
            src="/wire_corn_tl.png"
            className="max-w-[75%] max-h-[65%] object-contain ml-8 mt-8"
          />
        </div>
      )}
      {value && value.type === "wire_c_tr" && (
        <div className="relative w-[80%] h-full overflow-hidden flex items-center">
          <img
            src="/wire_corn_tr.png"
            className="max-w-[100%] max-h-[100%] object-contain mr-5 mt-12"
          />
        </div>
      )}
      {value && value.type === "wire_c_br" && (
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
          <img
            src="/wire_corn_br.png"
            className="max-w-[75%] max-h-[65%] object-contain mr-7 mb-7"
          />
        </div>
      )}
      {value && value.type === "wire_c_bl" && (
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
          <img
            src="/wire_corn_bl.png"
            className="max-w-[80%] max-h-[65%] object-contain ml-8 mb-7"
          />
        </div>
      )}
      {value && value.type === "wire_all" && (
        <div className="flex items-center justify-center overflow-hidden">
          <img src="/wire_all.png" className="w-full h-full object-contain" />
        </div>
      )}
      {value && value.type === "wire_3_l" && (
        <div className="flex items-center justify-center overflow-hidden">
          <img src="/wire_3_l.png" className="w-full h-full object-contain" />
        </div>
      )}
      {value && value.type === "wire_3_r" && (
        <div className="flex items-center justify-center overflow-hidden">
          <img src="/wire_3_r.png" className="w-full h-full object-contain" />
        </div>
      )}
      {value && value.type === "wire_3_b" && (
        <div className="flex items-center justify-center overflow-hidden">
          <img src="/wire_3_b.png" className="w-full h-full object-contain" />
        </div>
      )}
      {value && value.type === "wire_3_t" && (
        <div className="flex items-center justify-center overflow-hidden">
          <img src="/wire_3_t.png" className="w-full h-full object-contain" />
        </div>
      )}
    </button>
  );
}

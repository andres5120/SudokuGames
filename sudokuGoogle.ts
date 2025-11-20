import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- UTILITIES & HELPERS ---

// NOTE: This is a web-based React implementation to work in this preview environment.
// You can adapt the logic and components back to your React Native project.

// Helper to shuffle arrays
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Function to apply random transformations to a valid Sudoku board
const transformBoard = (board, solution) => {
    let newBoard = JSON.parse(JSON.stringify(board));
    let newSolution = JSON.parse(JSON.stringify(solution));

    // 1. Relabel numbers
    const numMap = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const relabel = (b) => b.map(row => row.map(cell => cell === 0 ? 0 : numMap[cell - 1]));
    newBoard = relabel(newBoard);
    newSolution = relabel(newSolution);

    // 2. Swap rows within a 3x3 block
    for (let block = 0; block < 3; block++) {
        const rows = shuffleArray([0, 1, 2]);
        const tempBoard = [...newBoard];
        const tempSolution = [...newSolution];
        for (let i = 0; i < 3; i++) {
            newBoard[block * 3 + i] = tempBoard[block * 3 + rows[i]];
            newSolution[block * 3 + i] = tempSolution[block * 3 + rows[i]];
        }
    }

    // 3. Swap columns within a 3x3 block
    for (let block = 0; block < 3; block++) {
        const cols = shuffleArray([0, 1, 2]);
        const tempBoard = JSON.parse(JSON.stringify(newBoard));
        const tempSolution = JSON.parse(JSON.stringify(newSolution));
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 3; j++) {
                newBoard[i][block * 3 + j] = tempBoard[i][block * 3 + cols[j]];
                newSolution[i][block * 3 + j] = tempSolution[i][block * 3 + cols[j]];
            }
        }
    }
    
    return { board: newBoard, solution: newSolution };
};


// Sudoku puzzle generation and solving logic
const sudoku = {
  generate: (difficulty) => {
    // Base puzzles
    const puzzles = {
      facil: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0], [6, 0, 0, 1, 9, 5, 0, 0, 0], [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3], [4, 0, 0, 8, 0, 3, 0, 0, 1], [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0], [0, 0, 0, 4, 1, 9, 0, 0, 5], [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ],
      medio: [
        [0, 2, 0, 6, 0, 8, 0, 0, 0], [5, 8, 0, 0, 0, 9, 7, 0, 0], [0, 0, 0, 0, 4, 0, 0, 0, 0],
        [3, 7, 0, 0, 0, 0, 5, 0, 0], [6, 0, 0, 0, 0, 0, 0, 0, 4], [0, 0, 8, 0, 0, 0, 0, 1, 3],
        [0, 0, 0, 0, 2, 0, 0, 0, 0], [0, 0, 9, 8, 0, 0, 0, 3, 6], [0, 0, 0, 3, 0, 6, 0, 9, 0],
      ],
      dificil: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 3, 0, 8, 5], [0, 0, 1, 0, 2, 0, 0, 0, 0],
        [0, 0, 0, 5, 0, 7, 0, 0, 0], [0, 0, 4, 0, 0, 0, 1, 0, 0], [0, 9, 0, 0, 0, 0, 0, 0, 0],
        [5, 0, 0, 0, 0, 0, 0, 7, 3], [0, 0, 2, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 4, 0, 0, 0, 9],
      ],
      experto: [
        [8, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 3, 6, 0, 0, 0, 0, 0], [0, 7, 0, 0, 9, 0, 2, 0, 0],
        [0, 5, 0, 0, 0, 7, 0, 0, 0], [0, 0, 0, 0, 4, 5, 7, 0, 0], [0, 0, 0, 1, 0, 0, 0, 3, 0],
        [0, 0, 1, 0, 0, 0, 0, 6, 8], [0, 0, 8, 5, 0, 0, 0, 1, 0], [0, 9, 0, 0, 0, 0, 4, 0, 0],
      ],
    };
    // Base solutions
    const solutions = {
        facil: [
            [5, 3, 4, 6, 7, 8, 9, 1, 2], [6, 7, 2, 1, 9, 5, 3, 4, 8], [1, 9, 8, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3], [4, 2, 6, 8, 5, 3, 7, 9, 1], [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4], [2, 8, 7, 4, 1, 9, 6, 3, 5], [3, 4, 5, 2, 8, 6, 1, 7, 9],
        ],
        medio: [
            [1, 2, 3, 6, 7, 8, 9, 4, 5], [5, 8, 4, 1, 3, 9, 7, 6, 2], [9, 6, 7, 2, 4, 5, 8, 3, 1],
            [3, 7, 2, 4, 6, 1, 5, 8, 9], [6, 1, 5, 9, 8, 3, 2, 7, 4], [4, 9, 8, 5, 7, 2, 6, 1, 3],
            [8, 3, 6, 7, 2, 9, 1, 5, 0], [7, 5, 9, 8, 1, 4, 0, 3, 6], [2, 4, 1, 3, 5, 6, 0, 9, 7],
        ],
        dificil: [
            [9, 8, 7, 6, 5, 4, 3, 2, 1], [2, 4, 6, 1, 7, 3, 9, 8, 5], [3, 5, 1, 9, 2, 8, 7, 4, 6],
            [1, 2, 8, 5, 3, 7, 6, 9, 4], [6, 3, 4, 8, 9, 2, 1, 5, 7], [7, 9, 5, 4, 6, 1, 8, 3, 2],
            [5, 1, 9, 2, 8, 6, 4, 7, 3], [4, 7, 2, 3, 1, 9, 5, 6, 8], [8, 6, 3, 7, 4, 5, 2, 1, 9],
        ],
        experto: [
            [8, 1, 2, 7, 5, 3, 6, 4, 9], [9, 4, 3, 6, 8, 2, 1, 7, 5], [6, 7, 5, 4, 9, 1, 2, 8, 3],
            [1, 5, 4, 2, 3, 7, 8, 9, 6], [3, 6, 9, 8, 4, 5, 7, 2, 1], [2, 8, 7, 1, 6, 9, 5, 3, 4],
            [5, 2, 1, 9, 7, 4, 3, 6, 8], [4, 3, 8, 5, 2, 6, 9, 1, 7], [7, 9, 6, 3, 1, 8, 4, 5, 2],
        ],
    };
    
    // Get the base puzzle and solution
    const baseBoard = puzzles[difficulty];
    const baseSolution = solutions[difficulty];

    // Apply random transformations and return the new puzzle
    return transformBoard(baseBoard, baseSolution);
  },
};

// --- COMPONENTS ---

const CustomAlert = ({ title, message, onClose }) => (
    <div className="alert-overlay">
        <div className="alert-box">
            <h3 className="alert-title">{title}</h3>
            <p className="alert-message">{message}</p>
            <button className="alert-button" onClick={onClose}>OK</button>
        </div>
    </div>
);

const App = () => {
  const [difficulty, setDifficulty] = useState('facil');
  const [board, setBoard] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [alertInfo, setAlertInfo] = useState(null);
  const [gameId, setGameId] = useState(1); // Add a gameId to force re-render

  // Memoize initial game setup to avoid re-running on every render
  const gameData = useMemo(() => sudoku.generate(difficulty), [difficulty, gameId]);

  // Initialize or reset game
  useEffect(() => {
    const { board: newBoard, solution: newSolution } = gameData;
    setBoard(JSON.parse(JSON.stringify(newBoard)));
    setInitialBoard(JSON.parse(JSON.stringify(newBoard)));
    setSolution(newSolution);
    setSelectedNumber(null);
  }, [gameData]);

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    setGameId(prevId => prevId + 1); // Increment gameId to trigger a new puzzle
  };

  const handleCellClick = (row, col) => {
    if (selectedNumber && initialBoard[row][col] === 0) {
      const newBoard = [...board];
      newBoard[row][col] = selectedNumber;
      setBoard(newBoard);
    } else if (initialBoard[row][col] !== 0) {
        setAlertInfo({ title: "Aviso", message: "No puedes cambiar los números iniciales." });
    }
  };

  const onclickAds = () => {
    console.log('Showing Ads...');
    setAlertInfo({ title: "Publicidad", message: "Imagina que estás viendo un anuncio..." });
    setTimeout(() => {
      console.log('Ad finished.');
      if(alertInfo) setAlertInfo(null);
      giveHint();
    }, 1500);
  };

  const giveHint = () => {
    const emptyCells = [];
    board.forEach((row, rIndex) => {
      row.forEach((cell, cIndex) => {
        if (cell === 0) {
          emptyCells.push({ r: rIndex, c: cIndex });
        }
      });
    });

    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const { r, c } = randomCell;
      const newBoard = [...board];
      newBoard[r][c] = solution[r][c];
      setBoard(newBoard);
    } else {
      setAlertInfo({ title: "¡Felicidades!", message: "¡Ya has completado el tablero!" });
    }
  };

  const confirmBoard = () => {
    let isCorrect = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== 0 && board[i][j] !== solution[i][j]) {
          isCorrect = false;
          break;
        }
      }
      if (!isCorrect) break;
    }
    
    const isComplete = board.every(row => row.every(cell => cell !== 0));

    if (isComplete && isCorrect) {
      setScore(prev => prev + 10);
      setAlertInfo({ title: '¡Correcto!', message: '¡Has resuelto el Sudoku! Ganas 10 puntos.' });
    } else {
      setScore(prev => prev - 4);
      setAlertInfo({ title: 'Incorrecto', message: 'Algunos números no son correctos o el tablero está incompleto. Pierdes 4 puntos.' });
    }
  };
  
  const handlePassTurn = () => {
    console.log("Pass Turn button pressed. No action defined yet.");
  };

  return (
    <>
      <style>{`
        :root {
            --cell-size: min(8vw, 45px);
            --board-size: calc(var(--cell-size) * 9);
        }
        .app-container {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #f0f4f8;
            padding: 20px;
            min-height: 100vh;
            box-sizing: border-box;
        }
        .header {
            display: flex;
            justify-content: space-between;
            width: 100%;
            max-width: var(--board-size);
            align-items: center;
            margin-bottom: 10px;
        }
        .title { font-size: 32px; font-weight: bold; color: #1e3a8a; }
        .score { font-size: 18px; font-weight: 600; color: #334155; }
        .difficulty-selector {
            display: flex;
            margin-bottom: 20px;
            background-color: #e2e8f0;
            border-radius: 20px;
            padding: 4px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .diff-button {
            padding: 8px 12px;
            border-radius: 16px;
            border: none;
            background-color: transparent;
            color: #475569;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
        }
        .diff-button-active { background-color: #3b82f6; color: #ffffff; }
        .board {
            width: var(--board-size);
            height: var(--board-size);
            border: 2px solid #334155;
            background-color: #ffffff;
            border-radius: 8px;
            display: grid;
            grid-template-columns: repeat(9, 1fr);
        }
        .cell {
            width: var(--cell-size);
            height: var(--cell-size);
            border: 0.5px solid #94a3b8;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: calc(var(--cell-size) * 0.6);
            font-weight: bold;
            color: #3b82f6;
            cursor: pointer;
            box-sizing: border-box;
        }
        .cell:nth-child(3n) { border-right: 2px solid #334155; }
        .cell:nth-child(9n) { border-right: none; }
        .board-row:nth-child(3n) .cell { border-bottom: 2px solid #334155; }
        .board-row:last-child .cell { border-bottom: none; }
        .initial-cell-text { color: #1e293b; cursor: not-allowed; }
        .numbers-container {
            display: flex;
            justify-content: center;
            width: 100%;
            max-width: calc(var(--board-size) + 20px);
            margin-top: 25px;
            flex-wrap: wrap;
        }
        .number-button {
            width: calc(var(--cell-size) * 0.95);
            height: calc(var(--cell-size) * 0.95);
            background-color: #e2e8f0;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 5px;
            font-size: calc(var(--cell-size) * 0.5);
            font-weight: bold;
            color: #475569;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.2s ease-in-out;
        }
        .number-button-selected {
            background-color: #3b82f6;
            color: white;
            border-color: #1e3a8a;
        }
        .actions-container {
            display: flex;
            justify-content: space-between;
            width: 100%;
            max-width: var(--board-size);
            margin-top: 25px;
        }
        .button {
            padding: 15px 20px;
            border-radius: 30px;
            border: none;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            flex-grow: 1;
            margin: 0 5px;
            text-align: center;
        }
        .button-primary {
            background-color: #2563eb;
            color: #ffffff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .button-secondary { background-color: #e2e8f0; color: #1e3a8a; }
        .pass-turn-text { margin-top: 20px; font-size: 16px; color: #64748b; font-weight: 500; cursor: pointer; }
        
        /* Alert Styles */
        .alert-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .alert-box { background-color: white; padding: 25px; border-radius: 15px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.3); width: 80%; max-width: 300px; }
        .alert-title { margin-top: 0; font-size: 20px; color: #1e3a8a; }
        .alert-message { margin-bottom: 20px; font-size: 16px; color: #334155; }
        .alert-button { background-color: #2563eb; color: white; border: none; padding: 10px 25px; border-radius: 20px; font-size: 16px; cursor: pointer; }
      `}</style>
      <div className="app-container">
        {alertInfo && <CustomAlert title={alertInfo.title} message={alertInfo.message} onClose={() => setAlertInfo(null)} />}
        
        <div className="header">
          <h1 className="title">Sudoku</h1>
          <p className="score">Puntos: {score}</p>
        </div>
        
        <div className="difficulty-selector">
          {['facil', 'medio', 'dificil', 'experto'].map(level => (
              <button key={level} onClick={() => handleDifficultyChange(level)} className={`diff-button ${difficulty === level ? 'diff-button-active' : ''}`}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
          ))}
        </div>

        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`cell ${initialBoard[rowIndex][colIndex] !== 0 ? 'initial-cell-text' : ''}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="numbers-container">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} onClick={() => setSelectedNumber(num)} className={`number-button ${selectedNumber === num ? 'number-button-selected' : ''}`}>
              {num}
            </button>
          ))}
        </div>

        <div className="actions-container">
          <button className="button button-secondary" onClick={onclickAds}>
            Ayuda
          </button>
          <button className="button button-primary" onClick={confirmBoard}>
            Confirmar
          </button>
        </div>
        
        <p className="pass-turn-text" onClick={handlePassTurn}>
          Pass Turn
        </p>
      </div>
    </>
  );
};

export default App;

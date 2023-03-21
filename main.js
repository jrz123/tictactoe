/*
 * Estado general de la aplicacion donde se guarda el historico, los pasos, y el estado turno
 */
let state = {
  history: [ { squares: Array(9).fill(null) } ],
  stepNumber: 0,
  xIsNext: true,
};

/*
 * Este metodo tiene todos los posibles opciones de ganar en el juego y ademas compara con una lista actual
 * de la aplicacion y verifica un ganador en ella.
 */
let calculateWinner = (squares) => {
  let valueWinner = null;
  let linesWinner = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  linesWinner.forEach((line) => {
    let [a, b, c] = line;
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) { 
      valueWinner = squares[a];
      return; 
    } 
  })
  return valueWinner;
};

/*
 * Renderiza un button de tipo square con su evento click
 */
let square = (props) => {
  let button = document.createElement("button");
  button.setAttribute("class", "square");
  button.addEventListener("click", props.onClick);
  button.textContent = props.value;
  return button;
};

/*
 * Renderiza una square con un valor del square y su evento click
 */
let renderSquare = (props, position) => square({value: props.squares[position], onClick: () => props.onClick(position)});

/*
 * Renderiza tres squares dentro de cada fila del tablero
 */
let boardRow = (props, { a, b, c }) => {
  let row = document.createElement("div");
  row.setAttribute("class", "board-row");
  row.appendChild(renderSquare(props, a));
  row.appendChild(renderSquare(props, b));
  row.appendChild(renderSquare(props, c));
  return row;
};

/*
 * Renderiza todo el tablero
 */
let board = (props) => {
  let div = document.createElement("div");
  div.appendChild(boardRow(props, { a: 0, b: 1, c: 2 }))
  div.appendChild(boardRow(props, { a: 3, b: 4, c: 5 }))
  div.appendChild(boardRow(props, { a: 6, b: 7, c: 8 }))
  return div;
};

/*
 * cambia de estado cuando se ejecuta el click dentro del tablero
 */
let handleClick = (i) => {
  let history = state.history.slice(0, state.stepNumber + 1);
  let current = history[history.length - 1];
  let squares = current.squares.slice();
  if(calculateWinner(squares) || squares[i]) { return; }

  squares[i] = state.xIsNext ? 'X' : 'O';
  state = {
    history: history.concat([{
      squares: squares,
    }]),
    stepNumber: history.length,
    xIsNext: !state.xIsNext,
  };
  game();
} 

/*
 * Cambia de un movimiento a otro a partir del historico guardado
 */
let jumpTo = (step) => {
  state.stepNumber = step;
  state.xIsNext = (step % 2) === 0;
  game();
};

/*
 * Funcion general del juego, es donde se renderiza todos los elementos que contiene
 * como el tablero y sus diferentes subdivisiones
 */
let game = () => {
  let history = state.history;
  let current = history[state.stepNumber];
  let winner = calculateWinner(current.squares);

  let moves = history.map((step, move) => {
    let descripcion = move ? 'Go to move #' + move : 'Go to game start';
    let li = document.createElement("li");
    li.setAttribute("key", move);
    let button = document.createElement("button");
    button.addEventListener('click', () => { jumpTo(move) });
    button.textContent = descripcion;
    li.appendChild(button);
    return li;
  });
  let status = winner ? 'Winner: ' + winner : 'Next Player: '+ (state.xIsNext ? 'X' : 'O');

  let root = document.getElementById("root");
  root.innerHTML = ""
  let div = document.createElement("div");
  div.setAttribute("class", "game");
  let divChildBoard = document.createElement("div");
  divChildBoard.setAttribute("class", "game-board");
  divChildBoard.appendChild(board({squares: current.squares, onClick: handleClick}));
  let divChildInfo = document.createElement("div");
  divChildInfo.setAttribute("class", "game-info");
  let divStatus = document.createElement("div");
  divStatus.textContent = status;
  let olMoves = document.createElement("ol");
  moves.forEach((li) => olMoves.appendChild(li));
  divChildInfo.appendChild(divStatus);
  divChildInfo.appendChild(olMoves);
  div.appendChild(divChildBoard);
  div.appendChild(divChildInfo);
  root.appendChild(div);
};

/*
 * Ejecucion del programa principal
 */
game();

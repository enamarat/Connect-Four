let x = 280;
let row = 0;
let player = 1;
let gameOver = false;
let board = [];
let circles = `<rect width="510" height="260" x="250" y="50" fill="#F7F08A" stroke="grey" stroke-width="5"/>`;
let occupiedSpaces = 0;

// draw a board
for (let i = 0; i < 10; i++) {
  circles += `<circle cx=${280+i*50} cy="80" r="20"
  fill="#FFF" stroke="grey" stroke-width="5"/>`;
  let column = [0];
  for (let j = 0; j < 4; j++) {
    circles += `<circle cx=${280+i*50} cy=${130+j*50} r="20"
    fill="#FFF" stroke="grey" stroke-width="5"/>`;
    column.push(0);
  }
  board.push(column);
}
circles += `<circle class="currentCircle used" cx="280" cy="25" r="20"
fill="#A4E549"/>`;
document.querySelector("#board").innerHTML = circles;

// create a new circle
const createNewCircle = () => {
  const usedCircles = document.querySelectorAll(".used");
  usedCircles[usedCircles.length-1].classList.remove("currentCircle");
  let color = null;
  if (player === 1) {
    color = '#A4E549';
    document.querySelector("#turn").textContent = "Player 1's turn";
  } else if (player === 2) {
    color = '#EB6935';
    document.querySelector("#turn").textContent = "Player 2's turn";
  }
  const circle = `<circle class="currentCircle used" cx="280" cy="25" r="20"
  fill=${color} />`;
  document.querySelector("#board").innerHTML += circle;
 // restart
  x = 280;
  row = 0;
  window.addEventListener("keydown", choosePosition);
}

/* check whether one of the players connected four circles
 either horizontally or vertically */
const checkIfFourConnected = () => {
  // check columns
  for (let i = 0; i < board.length; i++) {
    let countPlayer1 = 0;
    let countPlayer2 = 0;
    for (let j = 0; j < board[i].length; j++) {
      // skip empty columns
      if (board[i][board[i].length-1] === 0) {
        break;
      }
      if (board[i][j] === 1) {
        countPlayer1++;
        countPlayer2 = 0;
      } else if (board[i][j] === 2) {
        countPlayer2++;
        countPlayer1 = 0;
      }

      if (countPlayer1 === 4) {
        setTimeout(() => {
          for (let a = j; a > j-4; a--) {
            document.querySelector("#board").innerHTML += `<circle class="used" cx="${280+i*50}" cy="${80+a*50}" r="20"
            fill="#b0ffb5" />`;
          }
        }, 1100);
        showVictoryMessage(1,i,j);
        break;
      } else if (countPlayer2 === 4) {
        setTimeout(() => {
          for (let a = j; a > j-4; a--) {
            document.querySelector("#board").innerHTML += `<circle class="used" cx="${280+i*50}" cy="${80+a*50}" r="20"
            fill="#ff9c91" />`;
          }
        }, 1100);
        showVictoryMessage(2);
        break;
      }
    }
  }
  // check rows
  let count = board[0].length-1;
  while (count >= 0) {
    let countPlayer1 = 0;
    let countPlayer2 = 0;
    for (let i = 0; i < board.length; i++) {
      if (board[i][count] === 1) {
        countPlayer1++;
        countPlayer2 = 0;
      } else if (board[i][count]=== 2) {
        countPlayer2++;
        countPlayer1 = 0;
      } else if (board[i][count]=== 0) {
        countPlayer1 = 0;
        countPlayer2 = 0;
      }

      if (countPlayer1 === 4) {
       const y = 80 + count*50;
        setTimeout(() => {
          for (let a = i; a > i-4; a--) {
            document.querySelector("#board").innerHTML += `<circle class="used" cx="${280+a*50}" cy="${y}" r="20"
            fill="#b0ffb5" />`;
          }
        }, 1100);
        showVictoryMessage(1);
        break;
      } else if (countPlayer2 === 4) {
        const y = 80 + count*50;
        setTimeout(() => {
          for (let a = i; a > i-4; a--) {
            document.querySelector("#board").innerHTML += `<circle class="used" cx="${280+a*50}" cy="${y}" r="20"
            fill="#ff9c91" />`;
          }
        }, 1100);
        showVictoryMessage(2);
        break;
      }
    }
    count--;
  }
}

// show victory message
const showVictoryMessage = (player) => {
  setTimeout(() =>{
    document.querySelector("#turn").textContent = `Player ${player} won!`;
    document.querySelector("#turn").classList.add("victory-message");
    document.querySelector("#restart").style.display = "block";
  }, 1100);
  gameOver = true;
}

// choose the circle's position
const choosePosition = (event) => {
  document.querySelector(".currentCircle").style.transition = "0.5s";
  if (event.key === "ArrowLeft") {
    if (x > 280) {
      x -= 50;
      row -= 1;
    }
  } else if (event.key === "ArrowRight") {
    document.querySelector(".currentCircle").style.transition = "0.5s";
    if (x < 730) {
      x += 50;
      row += 1;
    }
  } else if (event.key === "ArrowDown") {
    document.querySelector(".currentCircle").style.transition = "1s";
    let y = 280;
    let count = 0;
    for (let i = board[row].length-1; i >= 0; i--) {
      if (i < board[row].length-1) {
        y -= 50;
      }
      if (board[row][i] === 0) {
        board[row][i] = player;
        break;
      }
      count++;
    }
    if (count < board[row].length) {
      if (player === 1) {
        player = 2;
      } else if (player === 2) {
        player = 1;
      }
      document.querySelector(".currentCircle").style.cy = y;
      occupiedSpaces++;
      checkIfFourConnected();
      window.removeEventListener("keydown", choosePosition);
      if (occupiedSpaces === board.length * board[0].length) {
        setTimeout(() => {
          document.querySelector("#turn").textContent = "It's a draw!";
        },1100);
        setTimeout(() => {
          document.querySelector("#restart").style.display = "block";
        },2000);
      } else {
        if (gameOver === false) {
          setTimeout(()=> {
            createNewCircle();
          }, 1100);
        }
      }
    }
  }
  document.querySelector(".currentCircle").style.cx = x;
}
window.addEventListener("keydown", choosePosition);

// restart the game
const restartGame = () => {
  document.querySelector("#turn").textContent = "Player 1's turn";
  document.querySelector("#turn").classList.remove("victory-message");
  x = 280;
  row = 0;
  player = 1;
  gameOver = false;
  occupiedSpaces = 0;
  // remove all circles
  const usedCircles = document.querySelectorAll(".used");
  for (let i = 0; i < usedCircles.length; i++) {
    document.querySelector("#board").removeChild(usedCircles[i]);
  }
  // clear the board
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = 0;
    }
  }
  // create a new circle for the first player
  const circle = `<circle class="currentCircle used" cx="280" cy="25" r="20"
  fill='#A4E549' />`;
  document.querySelector("#board").innerHTML += circle;
  window.addEventListener("keydown", choosePosition);
  // hide the restart button
  document.querySelector("#restart").style.display = "none";
}
document.querySelector("#restart").addEventListener("click", restartGame);

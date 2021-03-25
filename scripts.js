let x = 280;
let row = 0;
let player = 1;
let gameOver = false;

// draw a board
let board = [];
let circles = `<rect width="510" height="260" x="250" y="50" fill="#F7F08A" stroke="grey" stroke-width="5"/>`;
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
  //console.log(board[i]);
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
        document.querySelector("#turn").textContent = "Player 1 won!";
        gameOver = true;
        break;
      } else if (countPlayer2 === 4) {
        document.querySelector("#turn").textContent = "Player 2 won!";
        gameOver = true;
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
        document.querySelector("#turn").textContent = "Player 1 won!";
        gameOver = true;
        break;
      } else if (countPlayer2 === 4) {
        document.querySelector("#turn").textContent = "Player 2 won!";
        gameOver = true;
        break;
      }
    }
    count--;
  }
//  console.log(board);
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
      checkIfFourConnected();
      window.removeEventListener("keydown", choosePosition);
      if (gameOver === false) {
        setTimeout(()=> {
          createNewCircle();
        }, 1100);
      }
    }
  }
  document.querySelector(".currentCircle").style.cx = x;
}
window.addEventListener("keydown", choosePosition);

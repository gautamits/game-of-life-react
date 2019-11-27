import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';


function paddingBottom(arr, fill = 0) {
  arr.push(Array(arr.length).fill(fill))
  arr = arr.slice(1)
  return arr
}

function paddingTop(arr, fill = 0) {
  arr.unshift(Array(arr.length).fill(fill))
  arr = arr.slice(0, arr.length - 1)
  return arr
}

function paddingLeft(arr, fill=0) {
  return arr.map(row => {
    row.unshift(0)
    row = row.slice(0, row.length - 1)
    return row
  })
}

function paddingRight(arr, fill=0) {
  return arr.map(row => {
    row.push(0)
    row = row.slice(1)
    return row
  })
}

function paddingTopLeft(arr, fill=0){
  return paddingTop(paddingLeft(arr, fill))
}

function paddingBottomLeft(arr, fill = 0) {
  return paddingBottom(paddingLeft(arr, fill))
}

function paddingTopRight(arr, fill = 0) {
  return paddingTop(paddingRight(arr, fill))
}

function paddingBottomRight(arr, fill = 0) {
  return paddingBottom(paddingRight(arr, fill))
}

function sumMatrix(arr){
  
}
export default function App(props){
  const [gameRunning, toggleGameRunning] = useState(false)
  const [board, setBoard] = useState(null)
  const loop = useRef(null)
  function handleSliderChange(e){
    const columns = parseInt(e.target.value)
    if(isNaN(columns)) return
    const rows = parseInt((window.innerHeight/window.innerWidth) * columns);
    let arr = [...Array(rows).keys()].map(ele=>[...Array(columns).keys()].map(e=>0))
    setBoard(arr)
  }

  function nextStep(row, column, alive){
    const columns = board[0].length
    const rows = board.length
    let sum = 0, ans;
    if(column > 0 ){
      sum+=board[row][column-1] //left
    }
    if(column < columns-1 ){
      sum+= board[row][column+1] // right
    }
    if(row > 0){
      sum+= board[row-1][column] // top
    }
    if(row < rows-1){
      sum+=board[row+1][column] //bottom
    }
    if(row > 0 && column > 0){
      sum+= board[row-1][column-1] //top left
    }
    if(row > 0 && column < columns-1){
      sum+= board[row-1][column+1] //top right
    }
    if(row < rows-1 && column < columns-1 ){
      sum+=board[row+1][column+1] //bottom right
    }
    if(row < rows-1 && column > 0){
      sum+= board[row+1][column-1] //bottom left
    }
    
    if(alive === 0){
      if(sum === 3) ans =  1
      else ans =  0;
    }

    else{
      switch(sum){
        case 1:
          ans=0
          break
        case 2:
        case 3:
          ans=1
          break
        default:
          ans=0
      }
    }
    return ans;
  }
  
  function startGame(){
    if(gameRunning){
      toggleGameRunning(false)
    }
    else{
      toggleGameRunning(true)
    }
  }


  useEffect(()=>{
    if(!gameRunning) return
    setTimeout(oneStep, 100)
  },[board, gameRunning])

  function oneStep(){
    const nextBoard = board.map((row, i)=>row.map((column, j)=>nextStep(i,j,board[i][j])))
    setBoard([...nextBoard])
  }

  const memoisedRespond = React.useCallback(({ row, column, bit }) => {
    let arr2 = [...board];
    arr2[row - 1][column - 1] = bit ^ 1;
    setBoard(arr2)
  },[board])

  function doNothing(){}
	console.log('running');
  return (
    <div className="App">
    <form style={{display:'inline'}}>
      <label>squares</label>
      <input 
        style={{height: '30px', display:'block'}}
        type="text" 
        disabled={gameRunning}
        // min="2" max={`${window.innerWidth / 8}`} step="1" 
        name="squareCount" 
        onChange={handleSliderChange} />
        <button type="button" onClick={startGame}>{gameRunning ? 'stop' : 'start'}</button>

    </form>
    <button onClick={oneStep}>one step</button>
    {board && Array.isArray(board[0]) && <div style={{gridTemplateColumns:`repeat(${board[0].length}, 1fr)`}} className="canvas-container">
      {board.map((row, i)=>row.map((column, j)=>
        <ColoredTile
          bit={board[i][j]}
          row={i+1}
          column={j+1}
          respond={gameRunning ? doNothing : memoisedRespond}
          key={`${i}-${j}`}
        />
      ))}
    </div>}
    <ToastContainer position="top-center" hideProgressBar={true}
            style={{ marginTop: '120px', lineHeight: '20px', paddingTop: 16,
            textAlign: 'center', fontSize: 14}}
            />
    </div>
  );
}

const ColoredTile = React.memo(({row, column, bit, respond})=>{
  const handleClick=(e)=>{
    e.preventDefault();
    respond({row:row, column:column,bit:bit})
  }

  return(
    <div onClick={handleClick} style={{background:bit === 1 ? 'rgba(255, 0 ,0 , 0.5)' : 'rgba(0, 255, 0, 0.5)', }}>

    </div>
  )
})

import React, { Component } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      squares:0,
      columns:0,
      width:0,
      height:0,
      gameRunning: false,
    }
  }

  onSubmit=(e)=>{
    e.preventDefault();
    const inputForm = document.forms.inputForm;
    const data = new FormData(inputForm)
    const squares = data.get("squareCount")
    let screenH = window.innerHeight;
    let screenW = window.innerWidth;
    let tileHeight = parseInt(Math.sqrt((screenH*screenW)/squares))
    toast.success(tileHeight);
    let rows = parseInt(screenH / tileHeight);
    let columns = parseInt(screenW / tileHeight);
    let arr = [...Array(rows).keys()]
    .map(ele=>[...Array(columns).keys()].map(e=>0))
    this.setState({board:arr, tileHeight:tileHeight, columns:columns, rows: rows});

  }

  nextStep = (row, column, alive)=>{
    // console.log(row, column, alive);
    let sum = 0, ans;
    if(column > 0 ){
      sum+=this.state.board[row][column-1] //left
      // console.log('left ', sum)
    }
    if(column < this.state.columns-1 ){
      sum+= this.state.board[row][column+1] // right
      // console.log('right ', sum)
    }
    if(row > 0){
      sum+= this.state.board[row-1][column] // top
      // console.log('top ', sum)
    }
    if(row < this.state.rows-1){
      sum+=this.state.board[row+1][column] //bottom
      // console.log('bottom ', sum)
    }
    if(row > 0 && column > 0){
      sum+= this.state.board[row-1][column-1] //top left
      // console.log('top left ', sum)
    }
    if(row > 0 && column < this.state.columns-1){
      sum+= this.state.board[row-1][column+1] //top right
      // console.log('top right ', sum)
    }
    if(row < this.state.rows-1 && column < this.state.columns-1 ){
      sum+=this.state.board[row+1][column+1] //bottom right
      // console.log('bottom right ', sum)
    }
    if(row < this.state.rows-1 && column > 0){
      sum+= this.state.board[row+1][column-1] //bottom left
      // console.log('bottom left ', sum)
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
    // console.log('returning ', ans)
    return ans;
  }
  
  startGame = ()=>{
    if(this.state.gameRunning){
      this.setState({gameRunning: false},clearInterval(this.loop))
      return
    }
    this.setState({gameRunning:true});
    this.loop=setInterval(()=>{ 
 
  }, 5000);
  }

  oneStep = ()=>{
    let arr2 = [...Array(this.state.rows).keys()]
    .map(ele=>[...Array(this.state.columns).keys()].map(e=>0))
    
    this.state.board.map((row, i)=>
      row.map((column, j)=>{
        arr2[i][j] = this.nextStep(i,j, this.state.board[i][j])
      }))
    this.setState({board:arr2}); 
  }
  render() {
    return (
      <div className="App">
      <form style={{display:'inline'}} id="inputForm" onSubmit={this.onSubmit}>
        squares
        <input type="number"  name="squareCount"/>
        <input type="submit" value="submit"/>
      </form>
      <button onClick={this.oneStep}>start</button>
      <div style={{background:'green', height:'100vh', width:'100vw', display:'flex'}}>
        <div style={{width:'100%', height:'100%', display:'grid'}}>
          {this.state.board && this.state.board.map((row, i)=>row.map((column, j)=>
          <ColoredTile
            dimension={this.state.tileHeight}
            bit={this.state.board[i][j]}
            row={i+1}
            column={j+1}
            respond={({row, column, bit})=>{
              let arr2=this.state.board;
              arr2[row-1][column-1]=bit^1;
              this.setState({board:arr2})
            }}
          />
          ))}
        </div>
      </div>
      <ToastContainer position="top-center" hideProgressBar={true}
              style={{ marginTop: '120px', lineHeight: '20px', paddingTop: 16,
              textAlign: 'center', fontSize: 14}}
              />
      </div>
    );
  }
}

export default App;

function ColoredTile(props){
  const onclick=(e)=>{
    e.preventDefault();
    props.respond({row:props.row, column:props.column,bit:props.bit})
  }

  return(
    <div onClick={onclick} style={{border:'1px solid rgba(0,0,0,0.15)',gridArea:`${props.row}/${props.column}/${props.row+1}/${props.column+1}`, display:'inline', height:props.dimension, width:props.dimension, background:props.bit === 1 ? 'red' : 'green'}}>

    </div>
  )
}
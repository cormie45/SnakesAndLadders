import React, { useState, useEffect } from 'react';
import GameBoard from '../components/GameBoard';
import Players from '../components/Players';
import Dice from '../components/Dice';
import PlayerForm from '../components/PlayerForm';
import RuleDisplay from '../components/RuleDisplay';
import GameService from '../services/GameService';
import Tasks from '../components/Tasks';

const Game = () => {
    const [tasks, setTasks] = useState([])
    const [players, setPlayers] = useState([])
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
    const [livePlayer, setLivePlayer] = useState({})
    const [randomTask, setRandomTask] = useState(null)
    const [actions, setActions] = useState([])
    const [randomAction, setRandomAction] = useState(null)
    const [refresh, setRefresh] = useState(0)
    
    const boardSize = 750;
    const tiles = 10;
    const tileSize = 75;
    let yAxis = (tiles - 1) * tileSize;
    let xAxis = 0;
    let board = [];
    let direction = 1;


    for (let index = 0; index < tiles * tiles; index++) {
        // add each tile to the array
        board.push({ xAxis, yAxis, tileSize, index });
        xAxis = xAxis + tileSize * direction;
        // reverse direction after 10th tile and move up 1 tile
        if (xAxis >= boardSize || xAxis <= -tileSize) {
            direction *= -1;
            xAxis += tileSize * direction;
            yAxis -= tileSize
        }
    }

    const ladders = [
        {start: 9, startxAxis: board[9].xAxis, startyAxis: board[9].yAxis, end: 30, endxAxis: board[30].xAxis, endyAxis: board[30].yAxis},
        {start: 35, startxAxis: board[35].xAxis, startyAxis: board[35].yAxis, end: 61, endxAxis: board[61].xAxis, endyAxis: board[61].yAxis},
        {start: 65, startxAxis: board[65].xAxis, startyAxis: board[65].yAxis, end: 73, endxAxis: board[73].xAxis, endyAxis: board[73].yAxis},
        {start: 20, startxAxis: board[20].xAxis, startyAxis: board[20].yAxis, end: 45, endxAxis: board[45].xAxis, endyAxis: board[45].yAxis},
    ]

    let checkLadders = (tempPlayer) => {
        ladders.forEach((ladder) => {
            if (ladder.start  === tempPlayer.currentSquare ) {
                tempPlayer.xAxis = ladder.endxAxis
                tempPlayer.yAxis = ladder.endyAxis
                tempPlayer.currentSquare = ladder.end
                console.log("ladder hit!")
                let update = refresh + 1
                setRefresh(update)
            }
        })    
    }
    
    const snakes = [
        {start: 22, startxAxis: board[22].xAxis, startyAxis: board[22].yAxis, end: 5, endxAxis: board[5].xAxis, endyAxis: board[5].yAxis},
        {start: 70, startxAxis: board[70].xAxis, startyAxis: board[70].yAxis, end: 33, endxAxis: board[33].xAxis, endyAxis: board[33].yAxis},
        {start: 82, startxAxis: board[82].xAxis, startyAxis: board[82].yAxis, end: 58, endxAxis: board[58].xAxis, endyAxis: board[58].yAxis},
        {start: 98, startxAxis: board[98].xAxis, startyAxis: board[98].yAxis, end: 0, endxAxis: board[0].xAxis, endyAxis: board[0].yAxis}
    ]
    
    let checkSnakes = (tempPlayer) => {
        snakes.forEach((snake) => {
            if (snake.start  === tempPlayer.currentSquare ) {
                tempPlayer.xAxis = snake.endxAxis
                tempPlayer.yAxis = snake.endyAxis
                tempPlayer.currentSquare = snake.end
                console.log("snake bite!")
                let update = refresh + 1
                setRefresh(update)
            }
        })    
    }

    const drinks = [3, 8, 16, 19, 28, 45, 46, 47, 58, 68, 75, 76, 81, 85, 89, 93, 97]

    const punishments = [2, 5, 13, 24, 35, 39, 49, 50, 56, 60, 64, 69, 77, 86, 90, 92, 96]

    console.log(board)

    const addPlayer = newPlayer => {

        let tempArray = players
        players.push(newPlayer)
        setPlayers(tempArray)
        setLivePlayer(players[0])
        let update = refresh + 1
        setRefresh(update)
    }

    const getRoll = (newRoll) => {
        if(players.length ){
            setLivePlayer(players[currentPlayerIndex])
            updatePlayer(newRoll)
        }
    }

    const getRandomTask = () => {
        if (tasks.length > 0) {
            const max = tasks.length
            const randomNumber = Math.floor(Math.random() * max);
            const task = tasks[randomNumber].task
            setRandomTask(tasks[randomNumber].task)
            setRandomAction("")
            return task
        }
    }

    const getRandomAction = () => {
        if (actions.length > 0) {
            const max = actions.length
            const randomNumber = Math.floor(Math.random() * max);
            const action = actions[randomNumber].action
            setRandomAction(action)
            setRandomTask("")
            return action
        }
    }

    const getNoTask = () => {
        setRandomTask("")
        setRandomAction("")
        return ("")
    }

    const updatePlayer = (newRoll) => {
        let tempPlayer = livePlayer
        let tempPlayers = players
        
        let newPosition = tempPlayer.currentSquare + newRoll
        if (newPosition < 99 ) {
            tempPlayer.xAxis = board[newPosition].xAxis
            tempPlayer.yAxis = board[newPosition].yAxis
            tempPlayer.currentSquare = newPosition
        } else if (newPosition > 99) {
            let remainder = newPosition - 99
            tempPlayer.xAxis = board[99 - remainder].xAxis
            tempPlayer.yAxis = board[99 - remainder].yAxis 
            tempPlayer.currentSquare = 99 - remainder 
        } else if (newPosition === 99) {
            tempPlayers.splice(currentPlayerIndex, 1)
        }

        checkLadders(tempPlayer)
        checkSnakes(tempPlayer)
        
        let nextPlayerIndex = currentPlayerIndex
        if (nextPlayerIndex + 1 === players.length) {
            nextPlayerIndex = 0
            // setCurrentPlayerIndex(nextPlayerIndex)
        } else {
            nextPlayerIndex += 1
            // setCurrentPlayerIndex(nextPlayerIndex)
        }
        let update = refresh + 1
        setRefresh(update)
        setLivePlayer(players[nextPlayerIndex])
        setCurrentPlayerIndex(nextPlayerIndex)
    }

    useEffect(() => {
        GameService.getTasks()
        .then(tasks => setTasks(tasks))
        }, []
    )
        console.log(players)
   

    useEffect(() => {
        GameService.getActions()
        .then(actions => setActions(actions))
        }, []
    )

    const refreshPage = () => {
        window.location.reload(false);
    }

    
        
    return (
        <React.Fragment>
        <header className="header">

        <img className="logo-2" src="https://i.ibb.co/MDwn8vD/Snake.png" alt="Snake" border="0"/>
        <h1>SNAKES & BLADDERED</h1>
        <img className="logo" src="https://i.ibb.co/k1fsMPT/Icon-Color-11.png" alt="Icon-Color-11" border="0"/>
        </header>
       
        <div className="main-wrapper">
            <div className="dice-container">
                <PlayerForm addPlayer={addPlayer}/><br></br>
                {players.name}
            </div>
            
            <div className="board">
                <GameBoard board={board} ladders={ladders} snakes={snakes} />
                <Players players={players}/>
            </div>

            <div className="dice-container"><Dice getRoll = {getRoll}/>
                
                <button className="nes-btn is-warning" onClick={refreshPage}>New Game</button>
                <RuleDisplay />
            </div>
        </div>

        <div className="task-button-container">
            <button className="task-button" onClick={getRandomTask}>Click me: Task</button>
            <button className="task-button" onClick={getRandomAction}>Click me: Action</button>
            <button className="task-button" onClick={getNoTask}>Click me: Empty Square</button>
        </div>

        <div 
        className="task-button-container"><Tasks randomTask={randomTask} randomAction={randomAction}/>
        </div>
        </React.Fragment>
    )

}

export default Game;
import React, {useState, useRef } from "react";
import '../App.css';

import bgImage from "../pictures/white-clouds-repeating-background-slightDark.jpg";
import python from "../pictures/python.jpg";
import kingAuthur from "../pictures/KingAuthur-fix1.jpg";
import sirPasty from "../pictures/Patsy-fix1.jpg";
import sirBedivere from "../pictures/SirBedivere.jpg";
import sirGalahad from "../pictures/SirGalahad.jpg";
import sirLancelot from "../pictures/SirLancelot-fix1.jpg";
import sirRobin from "../pictures/SirRobin-fix1.jpg";
import theFrenchTaunter from "../pictures/TheFrenchTaunter.jpg";
import timTheEnchanter from "../pictures/TimTheEnchanter.jpg";
import rogerTheShrubber from "../pictures/RogerTheShrubber.jpg";
import knightOfNi from "../pictures/KnightOfNi.jpg";
import dennis from "../pictures/Dennis.jpg";

/** @dev https://www.npmjs.com/package/ipfs-http-client (v33.1.1) */
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
const soundBaseURI = 'https://ipfs.infura.io/ipfs/';

/** @dev IMPORTANT: if you upload your own questions.json file, set the ipfs address here 
  * Note that the ipfs base uri is not needed for this but is used elsewhere. Perhaps this 
  * inconsistency can be addressed later. */
const triviaQuestionsJSONURI = 'Qmct9cCW3AAL4JLQLkGmKo2SfN2xJA9Kv5TpkuAaXRN9h6'; 

/** @dev here is where you can change what file plays for a failure  */
const triviaFailureURI = 'https://ipfs.infura.io/ipfs/QmUZwBzSDf7eASPdJ28cEKDXeTi68LbuRyHEbPTapPtAxA'; 

/** @dev Monty Python game is 3 questions long, to match the # of 'Bridge Of Death' questions from the movie */
const totalQuestionsToAsk = 3; 
/** @dev if you add questions to the game, set to the total questions available in the questions.json file here or add logic to calc */
const totalQuestionsInJSON = 10; 

/** @dev main function for handling Home page */
function Home() {  
  const [questionsLoaded, setQuestionsLoaded] = useState(0);
  const [qBuffer, setQBuffer] = useState(null);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [currQuestIndex, setCurrQuestIndex] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [gameWon, setGameWon] = useState(0);
  const [gameLost, setGameLost] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(0);  
  
  /** @dev placing the pictures around the outside of the browser display (and Holy Grail logo picture) */
  function PlacePictures(){
    return(      
      <div>
        <img src={sirRobin} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '9.5vh', left: '1vh'}} 
        alt="sirRobin" />
        <img src={sirGalahad} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '25.5vh', left: '1vh'}} 
        alt="sirGalahad" />
        <img src={sirLancelot} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '41.5vh', left: '1vh'}} 
        alt="sirLancelot" />
        <img src={sirBedivere} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '58.5vh', left:'1vh'}} 
        alt="sirBedivere" />

        <img src={kingAuthur} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '75vh', left: '1vh'}} 
        alt="Aurthur" />

        <img src={sirPasty} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '75vh', left: '15vw'}} 
        alt="sirPasty" />
        <img src={theFrenchTaunter} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '75vh', left: '29.5vw'}} 
        alt="theFrenchTaunter" />
        <img src={rogerTheShrubber} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '75vh', left: '44vw'}} 
        alt="rogerTheShrubber" />
        <img src={timTheEnchanter} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '75vh', left: '58.5vw'}} 
        alt="timTheEnchanter" />
        <img src={dennis} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '75vh', left: '73vw'}} 
        alt="dennis" />
        <img src={knightOfNi} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '75vh', left: '87vw'}} 
        alt="knightOfNi" />

        <img src={python} 
        style={{height: '40vh', width: '16vw', position: 'absolute', top: '29vh', left: '80vw'}} 
        alt="python" />
      </div>
    )    
  }

  /** @dev clears state completely - could be removed if I can find a way to successfully clear 
    * the setUsedQuestions array. For now, it's a known technical issue. */
  function startOver() {
    window.location.reload();
  }

  /** @dev handles opening the game and loading the questions questions.json from IPFS and loading the first question */
  function beginTheGame() {    
    setGameWon(0);
    setGameLost(0);
    setQuestionsAsked(0);
    setCurrQuestIndex(0);
    setUsedQuestions([]);
    setCorrectAnswer(0);
    
    if (questionsLoaded == 0) {
      const ipfsPath = triviaQuestionsJSONURI; // see declaration @ top of file 
      ipfs.cat(ipfsPath, function (err, file) {
        if(err) throw err;    
        const jsonBytesToString = String.fromCharCode(...file);
        const jsonFromString = JSON.parse(jsonBytesToString);
        const allQuestions = JSON.stringify(jsonFromString);
        setQBuffer(jsonFromString);
        setQuestionsLoaded(1);
      });
    } else  {
      console.log('questions already loaded: ' + qBuffer['questions']);
    }
    parseNextQuestion();
  }

  /** @dev function retrieves & parses the next unused question to display */
  function parseNextQuestion() {
    var tmpQ = questionsAsked;
    const q = qBuffer;
    var newNum = pickRandom(); 
    if (newNum === 0) {
      console.log('we have reached total number of questions. usedQuestions: ' + usedQuestions);      
    } else {
      /** @dev IMPORTANT: JSON indexes for questions are 0 based, not 1 based: decrementing by 1 */
      newNum--;
      setCurrQuestIndex(newNum);
    }
    tmpQ = tmpQ + 1;
    setQuestionsAsked(tmpQ);    
  }

  /** @dev function plays the question's corresponding (right or wrong answer) audio file */
  function playFile(uri) {
    console.log('in playFile uri:' + uri);
    const soundCtrl = document.getElementById('audioPlayer');
    soundCtrl.setAttribute('src', uri);
    soundCtrl.play();
  }

  /** @dev function resets the correctAnswer flag, meaning the game is still in progress */
  function continueQuestions() {
    setCorrectAnswer(0); 
  }

  /** @dev This is the main function for handling answers given by the player. Method reads the radio
    * button chosen, determining if the answer is correct or wrong. Will then call corresponding 
    * playFile() method and play the correct sound file. Finally, it sets state vars as needed and calls 
    * parseNextQuestion() or ends the game. */
  function handleAnswer() {
    var qIndex = parseInt(currQuestIndex, 10);    
    for (var i = 0; i < totalQuestionsToAsk; i++) {
      
      var radios = document.getElementsByName('answerButtons');
      if (radios[i].checked) {
        var answer = JSON.stringify(qBuffer['questions'][qIndex]['answers'][i]['correct']);
        var tmpURI = JSON.stringify(qBuffer['questions'][qIndex]['contentAddress']).replace('"','').replace('"','');
        //console.log('tempURI: '+ tmpURI);
        var correctAnswerSoundFile = soundBaseURI.concat(tmpURI);
        //console.log('soundFile: ' + correctAnswerSoundFile);
        var answerValue = parseInt(answer, 10);
        var trueValue = parseInt('1', 10);
        
        if (answerValue === trueValue) {
          for (var j = 0; j < totalQuestionsToAsk; j++) {
            radios[j].checked = false;
          }
          if (questionsAsked == totalQuestionsToAsk) {
            playFile(correctAnswerSoundFile);            
            setGameWon(1);
            setUsedQuestions([]);
          } else {
            playFile(correctAnswerSoundFile);
            setCorrectAnswer(1);
            parseNextQuestion();
          }          
        } else { // wrong answer
          playFile(triviaFailureURI);
          setGameLost(1);
          setUsedQuestions([]);
        }
        return;      
      }
    }
  }

  /** @dev function chooses a random number between 1 and 10 that has not been used before (the number of questions 
    * in question.json - the file most recently loaded to IPFS and used by the game) */
  function pickRandom() {    
    var newNum = null;
    var bFound = true;
    var key = null;

    /** @dev technical issue: querying the length of 'usedQuestions' array is not working - need to count manually */
    var lengthOfUsedQArray = 0; 
    //console.log('lengthOfUsedQArray: ' + lengthOfUsedQArray);
    for (key in usedQuestions) {
      lengthOfUsedQArray++;
    }
    
    /** @dev once we reach the total # of questions to ask, return 0. Game is over */
    if (totalQuestionsToAsk == lengthOfUsedQArray) {
      return 0;
    }
    let ctr = 0;
    let currState = lengthOfUsedQArray === 0 ? [] : usedQuestions;
    
    newNum = Math.floor((Math.random() * totalQuestionsInJSON) + 1);    
    if (lengthOfUsedQArray > 0) {      
      do {
        for (var i = 0; i < lengthOfUsedQArray; i++) {
          if (parseInt(newNum, 10) === parseInt(usedQuestions[i], 10)) {
            bFound = true;            
            newNum = Math.floor((Math.random() * 3) + 1);
            break;
          } else {
            bFound = false;
          }
          ctr++;
        }    
      } while (bFound === true && ctr < totalQuestionsToAsk);

      currState.push(newNum);
      setUsedQuestions(currState);
    } else {
      currState.push(newNum);      
      setUsedQuestions(currState);
    } 
    return newNum;
  }

  /** @dev function handles radio button click */
  function radioButtClick(buttonIndex) {     
    var radios = document.getElementsByName('answerButtons');
    for( var i = 0; i < radios.length; i++ ) {
      if( buttonIndex != i ) {
        radios[i].checked = false;
      }      
    }
    return;
  }

  /** @dev function returns display of the possible answer */
  function displayPossibleAnswer(displayIndex) {
    var qIndex = parseInt(currQuestIndex, 10);
    //console.log('in q0: ' + JSON.stringify(qBuffer['questions'][qIndex]['answers'][0]['answer']));
    var answerText = JSON.stringify(qBuffer['questions'][qIndex]['answers'][displayIndex]['answer']).replace('"','').replace('"','');
    return (<div className='App-answer'>{answerText}</div>);
  }

  /** @dev function returns display of the question section: main question and it's 3 possible answers */
  function retreiveQuestion() {
    if (questionsLoaded == 1) {
      var qIndex = parseInt(currQuestIndex, 10);
      return (
        <div>
          <div className='justify-content-center'>
            <h4 className='App-question'>{JSON.stringify(qBuffer['questions'][qIndex]['question']).replace('"','').replace('"','')}</h4>
            <hr className='App-hr-thickness App-question'/>
          </div>
          <table>
            <tbody>              
              <tr className='center'>
                <td className="radio-listitem App-question-radio"><input type="radio" id="answerButtons" name='answerButtons' onClick={radioButtClick(0)} />&nbsp;&nbsp;&nbsp;</td>
                <td className='float-left'><label>{displayPossibleAnswer(0)}</label></td>
              </tr>                            
              <tr>
                <td className="radio-listitem App-question-radio"><input type="radio" id="answerButtons" name='answerButtons' onClick={radioButtClick(1)} />&nbsp;&nbsp;&nbsp;</td>
                <td className='float-left'><label>{displayPossibleAnswer(1)}</label></td>
              </tr>
              <tr>
                <td className="radio-listitem App-question-radio"><input type="radio" id="answerButtons" name='answerButtons' onClick={radioButtClick(2)} />&nbsp;&nbsp;&nbsp;</td>
                <td className='float-left'><label>{displayPossibleAnswer(2)}</label></td>
              </tr>              
            </tbody>
          </table>          
          <button type="button" className='btn btn-outline-primary App-normalFont' onClick={handleAnswer}>Submit Your Answer</button>
          <br />
        </div>
      );
    }
  }

  /** @dev function returns display of the page including the question area & messages to user (winning or losing message) */
  function displayQuestions() {
    if (!questionsLoaded) {
      return (
        <div id='questionSection'>
          <form action="/action_page.php">
            <div className='row justify-content-center'>
              <div className='col-auto'>
                <button type="button" onClick={beginTheGame} className='btn btn-primary App-normalFont'>&nbsp;&nbsp;BEGIN&nbsp;&nbsp;</button>
              </div>
            </div>
          </form>
        </div>
      );
    } else if (correctAnswer == 1) {
      return (
        <div>
          <br />
          <div><h3>Correct!</h3></div>
          <br />
          <button type="button" onClick={continueQuestions} className='btn btn-primary App-normalFont'>&nbsp;&nbsp;Next Question...&nbsp;&nbsp;</button>
        </div>
      );    
    } else if (gameWon) {
      return (
        <div id='questionSection'>
          <form action="/action_page.php">
            <div className='row justify-content-center'>
              <div className='col-auto'>
                <br/><br/>
                <div><h3>Correct! You have Won!</h3></div>
                <div><h3>You may pass over the Bridge Of Death</h3></div>
                <br/>
                <br/>
                <button type="button" onClick={startOver} className='btn btn-primary App-normalFont'>&nbsp;&nbsp;PLAY AGAIN?&nbsp;&nbsp;</button>
              </div>
            </div>
          </form>
        </div>
      );      
    } else if (gameLost) {
      return (
        <div id='questionSection'>
          <form action="/action_page.php">
            <div className='row justify-content-center'>
              <div className='col-auto'>
                <br/><br/>
                <h3>WRONG! You are thrown into the Gorge of Eternal Peril!!</h3>
                <br/>
                <br/>
                <button type="button" onClick={startOver} className='btn btn-primary App-normalFont'>&nbsp;&nbsp;PLAY AGAIN?&nbsp;&nbsp;</button>
              </div>
            </div>
          </form>
        </div>
      );
    } else {
      return (
        <div id='questionSection'>
          <form action="/action_page.php">
            <div className='row justify-content-center'>
              <div className='col-auto'>{retreiveQuestion()}</div>
            </div>
          </form>
        </div>
      );
    }
  }

  /** @dev Main controlling html for the entire page. See 'displayQuestions' and it's related functions for more info */
  return (
    <div className="home App-normalFont">
      <div>
        <div
          class="tiledBackground"
          style={{
            backgroundImage: 'url('+ bgImage +')',            
            height: "100vh",
            width: "100vw"
          }}
        >        
          <div>
            {PlacePictures()} 
          </div>
          <div className="container-fluid">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto"> 
                  <h3 className='App-title'>Who would cross the Bridge of Death must answer me</h3>
                  <h3 className='App-title'>these questions three, 'ere the other side he see...</h3>
                  <br />
                  <br />
                  <br />                  
                  {displayQuestions()}
                  <br />
                </div>
                <div name='divPlayer' className='hidden'>
                  <audio id="audioPlayer"><source src='QmfZRqqYyGCZsKi1rg7ZBioiyU8e499nGibezUFstZZQr2' /></audio>
                </div>
              </main>
            </div>
          </div>          
        </div>
      </div>
    </div>
  );
}
export default Home;
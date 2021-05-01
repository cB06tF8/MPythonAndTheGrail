import React, {useState, useRef } from "react";
import '../App.css';

import bgImage from "../pictures/white-clouds-repeating-background.jpg";
import python from "../pictures/python.jpg";
import kingAuthur from "../pictures/KingAuthur.jpg";
import sirPasty from "../pictures/Patsy.jpg";
import sirBedivere from "../pictures/SirBedivere.jpg";
import sirGalahad from "../pictures/SirGalahad.jpg";
import sirLancelot from "../pictures/SirLancelot.png";
import sirRobin from "../pictures/SirRobin.jpg";
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
 *  Note that the ipfs base uri is not needed for this but is needed elsewhere 
 *  Perhaps this inconsistency can be addressed later. */
const triviaQuestionsURI = 'Qmf3oS7LXX5upysPJmScAeYtCs7sgANWGTTKaX6Qnx9xYv';
/** @dev here is where you can change what file plays for a failure  */
/* IMP: at the moment - using the bridgeKeepers death file as the failure sound but I need to modify Sir Robin's
   death sound file - it's better    */
const triviaFailureURI = 'https://ipfs.infura.io/ipfs/Qmd1x73i28b61koGredpkvD8qxGuJTag3q9efDnQMNojPG'; 

function Home() {
  const totalQuestionsToAsk = 3;  
  const [questionsLoaded, setQuestionsLoaded] = useState(0);
  const [qBuffer, setQBuffer] = useState(null);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [currQuestIndex, setCurrQuestIndex] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [gameWon, setGameWon] = useState(0);
  const [gameLost, setGameLost] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  
  function PlacePictures(){
    return(      
      <div>
        <img src={sirRobin} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '11.5vh', left: '1vh'}} 
        alt="sirRobin" />
        <img src={sirGalahad} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '29.5vh', left: '1vh'}} 
        alt="sirGalahad" />
        <img src={sirLancelot} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '47.5vh', left: '1vh'}} 
        alt="sirLancelot" />
        <img src={sirBedivere} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '65.5vh', left:'1vh'}} 
        alt="sirBedivere" />

        <img src={kingAuthur} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '84vh', left: '1vh'}} 
        alt="Aurthur" />

        <img src={sirPasty} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '84vh', left: '15vw'}} 
        alt="sirPasty" />
        <img src={theFrenchTaunter} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '84vh', left: '29.5vw'}} 
        alt="theFrenchTaunter" />
        <img src={rogerTheShrubber} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '84vh', left: '44vw'}} 
        alt="rogerTheShrubber" />
        <img src={timTheEnchanter} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '84vh', left: '58.5vw'}} 
        alt="timTheEnchanter" />
        <img src={dennis} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '84vh', left: '73vw'}} 
        alt="dennis" />
        <img src={knightOfNi} 
        style={{height: '12vh', width: '10vw', position: 'absolute', top: '84vh', left: '87vw'}} 
        alt="knightOfNi" />

        <img src={python} 
        style={{height: '46vh', width: '18vw', position: 'absolute', top: '30vh', left: '80vw'}} 
        alt="python" />
      </div>
    )    
  }

  function startOver() {
    window.location.reload();
  }

  function beginTheGame() {    
    setGameWon(0);
    setGameLost(0);
    setQuestionsAsked(0);
    setCurrQuestIndex(0);
    setUsedQuestions([]);
    setCorrectAnswer(0);
    
    if (questionsLoaded == 0) {
      const ipfsPath = triviaQuestionsURI; // see declaration @ top of file 
      // 'Qmf3oS7LXX5upysPJmScAeYtCs7sgANWGTTKaX6Qnx9xYv'; // questions-fix2.json -- uses 0 and 1 for true/false
      // old: 'Qma37cqphixGGgQa486ZCcv4TaTNr4G97dzYjZf9gasDaz';      
      ipfs.cat(ipfsPath, function (err, file) {
        if(err) throw err;    
        const jsonBytesToString = String.fromCharCode(...file);
        //console.log('bytes as string: ' + jsonBytesToString);
        const jsonFromString = JSON.parse(jsonBytesToString);
        //console.log('jsonFromString: ' + jsonFromString);
        const allQuestions = JSON.stringify(jsonFromString);
        //console.log('String to JSON: ', jsonFromString['questions']); //['questions']['0']['clipName']
        //console.log('stringify JSON:' + allQuestions);
        setQBuffer(jsonFromString);
        setQuestionsLoaded(1);
      });
    } else  {
      console.log('questions already loaded: ' + qBuffer['questions']);
    }
    parseNextQuestion();
  }

  function parseNextQuestion() {
    var tmpQ = questionsAsked;
    const q = qBuffer;
    //console.log('in parseQuestion');
    var newNum = pickRandom(); 
    if (newNum === 0) {
      console.log('we have reached total number of questions. usedQuestions: ' + usedQuestions);      
    } else {
      /** @dev IMPORTANT: JSON indexes for questions are 0 based, not 1 based, so decrement by 1. */
      newNum--;
      setCurrQuestIndex(newNum);
    }
    tmpQ = tmpQ + 1;
    setQuestionsAsked(tmpQ);    
  }

  function playFile(uri) {
    console.log('in playFile uri:' + uri);
    const soundCtrl = document.getElementById('audioPlayer');
    soundCtrl.setAttribute('src', uri);
    soundCtrl.play();
  }

  function continueQuestions() {
    setCorrectAnswer(0); 
  }

  function handleAnswer() {
    var qIndex = parseInt(currQuestIndex, 10);    
    for (var i = 0; i < totalQuestionsToAsk; i++) {
      
      var radios = document.getElementsByName('answerButtons');
      if (radios[i].checked) {
        var answer = JSON.stringify(qBuffer['questions'][qIndex]['answers'][i]['correct']);
        var tmpURI = JSON.stringify(qBuffer['questions'][qIndex]['contentAddress']).replace('"','').replace('"','');
        console.log('tempURI: '+ tmpURI);
        var correctAnswerSoundFile = soundBaseURI.concat(tmpURI);
        console.log('soundFile: ' + correctAnswerSoundFile);
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
            //setCorrectAnswer(1);
            //alert('Correct answer!');
          } else {
            //console.log('questionsAsked=' + questionsAsked);
            playFile(correctAnswerSoundFile);
            setCorrectAnswer(1);
            //alert('Correct answer!');
            parseNextQuestion();
          }
          
        } else {
          playFile(triviaFailureURI);
          setGameLost(1);
          setUsedQuestions([]);
          //alert('WRONG! You are thrown into the Gorge of Eternal Peril!!');
        }
        return;      
      }
    }
  }

  function pickRandom() {    
    var newNum = null;
    var bFound = true;
    var key = null;

    /** @dev querying length of array not working - need to count manually */
    var lengthOfUsedQArray = 0; 
    //console.log('lengthOfUsedQArray: ' + lengthOfUsedQArray);
    for (key in usedQuestions) {
      //console.log('in pickRandom usedQuestions loop');
      lengthOfUsedQArray++;
    }
    //console.log('lengthOfUsedQArray after: ' + lengthOfUsedQArray);

    /** @dev once we reach the total # of questions to ask, return 0. Game is over */
    if (totalQuestionsToAsk == lengthOfUsedQArray) {
      return 0;
    }
    let ctr = 0;
    let currState = lengthOfUsedQArray === 0 ? [] : usedQuestions;
    
    /* the game is 3 questions long. 
     * 3 is the number Thou shalt count and the number of the counting shall be 3. */
    newNum = Math.floor((Math.random() * 3) + 1);    
    if (lengthOfUsedQArray > 0) {      
      do {
        for (var i = 0; i < lengthOfUsedQArray; i++) {
          //var a = parseInt(newNum, 10);
          //var b = parseInt(usedQuestions[i], 10);
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

    //console.log('currState: ' + currState);
    return newNum;
  }

  function radioButtClick(buttonIndex) {     
    var radios = document.getElementsByName('answerButtons');
    for( var i = 0; i < radios.length; i++ ) {
      if( buttonIndex != i ) {
        radios[i].checked = false;
      }      
    }
    return;
  }

  function getQuestion(displayIndex) {
    var qIndex = parseInt(currQuestIndex, 10);
    //console.log('in q0: ' + JSON.stringify(qBuffer['questions'][qIndex]['answers'][0]['answer']));
    return (<div className='App-answer'>{JSON.stringify(qBuffer['questions'][qIndex]['answers'][displayIndex]['answer'])}</div>);
  }

  function retreiveQuestion() {
    //console.log('in retreiveQuestion...');
    
    if (questionsLoaded == 1) {
      //console.log('questionsLoaded: ' + questionsLoaded);
      //const allQuestions = JSON.stringify(qBuffer['questions']);
      //console.log('qBuffer:' + allQuestions);
      var qIndex = parseInt(currQuestIndex, 10);
      //console.log('qIndex: ' + qIndex);
      return (
        <div>
          <div className='justify-content-center'>
            <h4 className='App-question'>{JSON.stringify(qBuffer['questions'][qIndex]['question'])}</h4>
            <hr className='App-hr-thickness App-question'/>
          </div>
          <table>
            <tbody>              
              <tr className='center'>
                <td className="radio-listitem App-question-radio"><input type="radio" id="answerButtons" name='answerButtons' onClick={radioButtClick(0)} />&nbsp;&nbsp;&nbsp;</td>
                <td className='float-left'><label>{getQuestion(0)}</label></td>
              </tr>                            
              <tr>
                <td className="radio-listitem App-question-radio"><input type="radio" id="answerButtons" name='answerButtons' onClick={radioButtClick(1)} />&nbsp;&nbsp;&nbsp;</td>
                <td className='float-left'><label>{getQuestion(1)}</label></td>
              </tr>
              <tr>
                <td className="radio-listitem App-question-radio"><input type="radio" id="answerButtons" name='answerButtons' onClick={radioButtClick(2)} />&nbsp;&nbsp;&nbsp;</td>
                <td className='float-left'><label>{getQuestion(2)}</label></td>
              </tr>              
            </tbody>
          </table>
          <br />
          <button type="button" className='btn btn-outline-primary App-normalFont' onClick={handleAnswer}>Submit Your Answer</button>
          <br />
        </div>
      );
    }
  }

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

  /** @dev "Home": main returned html */
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
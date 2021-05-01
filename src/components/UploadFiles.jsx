import React, {useState} from "react";
import {submitContentToIPFS} from './IPFSSubmit.js';
import '../App.css';

/** @dev https://www.npmjs.com/package/ipfs-http-client (v33.1.1) */
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'});

function UploadFiles() {
  const totalQuestionsToAsk = 3;
  const [buffer, setBuffer] = useState('');
  const [qContent, setQContent] = useState('');
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [currQuest, setCurrQuest] = useState(0);

  function handleSubmit(event) {
    event.preventDefault();
    console.log('in handleSubmit...');

    //var retVal = tryThis2('buffalo bob');
    //console.log('tryThis returns: ' + retVal);

    var retVal = submitContentToIPFS(buffer);
    console.log('back from submitContentToIPFS: ' + retVal);
  }

  var captureFiles = function captureFiles(event) { 
    event.preventDefault();
    //console.log('we are in captureFiles');
    const filesToUpload = event.target.files[0];
    
    // convert the file to a buffer fto prepare as an upload to IPFS
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(filesToUpload);
    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
      //console.log('buffer from state after: ' + {buffer});
    }
  }

  return (
    <div className="contact UploadFiles-bg">
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-8">
            <h3>Upload Sound Files and Questions JSON File to IFPS</h3>
            <hr/>
            <div>
              <form onSubmit={handleSubmit} className='text-left' >
                <p>&nbsp;</p>
                <h5>Choose a File To Upload</h5>
                <input type='file' id='filesToUpload' onChange={captureFiles} />&nbsp;&nbsp;
                <input type='submit' value='Upload File to IPFS' className='btn btn-outline-secondary btn-sm' style={{color: 'black'}}/>
              </form>
            </div>
            <br/>            
          </div>
          <br />
          <br />           
          <br />
        </div>
      </div>
    </div>
  );
}
export default UploadFiles;
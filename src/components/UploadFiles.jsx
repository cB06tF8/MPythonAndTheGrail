import React, {useState} from "react";
import {submitContentToIPFS} from './UploadFilesHelper.js';
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

  /** @dev function uploads the file chosen to IPFS. For now it is one at a time. Use the F12
    * tools to view and copy the returned IPFS address. See submitContentToIPFS function for 
    * more info. */  
  function handleSubmit(event) {
    event.preventDefault();

    var retVal = submitContentToIPFS(buffer);
    // async func - nothing is returned at first
    //console.log('back from submitContentToIPFS: ' + retVal);
  }

  /** @dev function prepares the file chosen for uploading by placing it in a Buffer */
  var captureFiles = function captureFiles(event) { 
    event.preventDefault();
    const filesToUpload = event.target.files[0];
    
    // convert the file to a buffer fto prepare as an upload to IPFS
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(filesToUpload);
    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
    }
  }

  return (
    <div className="contact UploadFiles-bg">
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-8">
            <h3>Upload Files to IFPS</h3>
            <hr/>
            <div>
              <form onSubmit={handleSubmit} className='text-left' >
                <p>&nbsp;</p>
                <h5>Choose sound files (or the questions JSON file) to Upload</h5>
                <input type='file' id='filesToUpload' onChange={captureFiles} />&nbsp;&nbsp;
                <input type='submit' value='Upload File to IPFS' className='btn btn-outline-secondary btn-sm' style={{color: 'black'}}/>
              </form>
              <br/>
              <hr/>
            </div>            
            Use F12 tools to view the result of a successful upload and record the IPFS address
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
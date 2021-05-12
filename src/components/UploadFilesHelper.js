import React, { Component } from 'react';

/** @dev https://www.npmjs.com/package/ipfs-http-client (v33.1.1) */
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'});

/** @dev function submits the file (in buffer) to IPFS and handles async return */
export const submitContentToIPFS = async(buffer) => {
  var returnMsg = '';
  console.log('The files will be Submitted!');
  let data = buffer;
  console.log('Submitting this: ', data);
    const options = {
        wrapWithDirectory: true // -w option
    }
    console.log('options: ' + options + ', data: ' + data); 
    if (data) {
        try{
          const postResponse = await ipfs.add(data, options);
          returnMsg = postResponse;       
          console.log("postResponse", postResponse);
        } catch(e) {
          returnMsg = 'Error: ' + e;
          console.log(returnMsg);
        }
    } else {
      returnMsg = 'No files submitted. Please try again.';
      alert(returnMsg);
      console.log('ERROR: No data to submit');      
    }
  /* example question1 (fate of the minstrels) address:
      example URL: https://ipfs.infura.io/ipfs/QmSr8fFpgMm4x9mFB3NTyctKjfHLpKpzUkKCxNXrisfu9e
      Folder/filename wrapper:
      https://ipfs.infura.io/ipfs/QmTAsn8GBQNthdnJnrUNdHgzk5SQnz1Ayby6DkqpCsdpR1
  */ 
}
export default submitContentToIPFS;
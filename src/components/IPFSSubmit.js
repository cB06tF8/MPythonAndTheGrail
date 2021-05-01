import React, { Component } from 'react';

/** @dev https://www.npmjs.com/package/ipfs-http-client (v33.1.1) */
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'});

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
  /* example question1 (fate of the minstrels) address: QmSr8fFpgMm4x9mFB3NTyctKjfHLpKpzUkKCxNXrisfu9e
      example URL: https://ipfs.infura.io/ipfs/QmSr8fFpgMm4x9mFB3NTyctKjfHLpKpzUkKCxNXrisfu9e
      TimTheEnchanter w/wrapper:
      https://ipfs.infura.io/ipfs/QmdoBFvW5N1HAJTjM6QaqLobaNJXJTkmuksbbkhXnpoVbk
  */ 
}
export default submitContentToIPFS;
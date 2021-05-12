# Monty Python and The Holy Grail Game

## Available Scripts
To start the game, navigate to the project directory and run:

### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Important Technical Details
Technical issues were encountered using the latest version of ipfs-http-client (currently 05/11/2021) along with 
some react components. Moving back to v33.1.1 solved these issues: 

npm install --save ipfs-http-client@v33.1.1

The project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Structure of the Game Application
The game consists of a React front end and IPFS (using the Infura gateway) as the backend. Audio clips from the movie 
have been uploaded to IPFS and their addresses saved locally. A json file containing the questions, answers and the IPFS
addresses for the corresponding audio files has also been uploaded to IPFS. 
When a question is answered correctly, the address of the audio clip is read from the json file, which was downloaded 
from IPFS and kept in state. It is sent to a hidden html audio player on the page.
If a question is answered incorrectly, the player looses the game. Another sound clip is played when this happens, one 
that corresponds to the final result in the movie where the character is thrown off the Bridge of Death into the Gorge
of Eternal Peril.

The game also contains a second tab labeled 'Upload Files', which enables expansion or modification of the game.

## How to Expand the Game for Yourself
The code for this game can easily be adapted for any trivia game that uses sound files. The 'Upload Files' tab allows for
uploading your own sound files and questions json file to IPFS. Use the F12 to display the result of the upload. Current
code also includes the '-w' option for IPFS uploads which will include the folder/filename wrapper in the return. (I'm not
using this information for the game, but it may be useful someday). The smaller of the two response objects (should be the
first object of the two) is the file contents, the second is the folder address. Copy the IPFS addresses and store locally
temporarily, as you are uploading.

The questions and their answers are also uploaded to IPFS. The json structure for this can be seen in the 'questions-fix2.json' 
file which is in the 'supplemental project info' folder at the base of this project. The 'questions and info.txt' contains 
the same questions in text form and the IPFS URI for the 'questions-fix2.json' itself and the sound clip played when the game 
is lost. Both of these addresses are hard coded at the top of the Home.jsx file.

### Known Issues and Possible Upgrades
I've been unable to find a way to save the javascript promise a(once fulfilled) to state after the file upload in order
to display the value as html. For now, the developer has to use the F12 development tools to display this information on
this page in order to copy it somewhere locally. Getting this to display as html would be great, as the IPFS address for 
each upload is extremely important, either being recorded in the questions json file itself or being hard coded in the 
Home.jsx file.

## This project is inteneded for educational purposes only 
All sounds and pictures are &copy; Python (Monty) Pictures, Ltd.

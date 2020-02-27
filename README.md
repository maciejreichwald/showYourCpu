# Show Your CPU
Show You CPU is a Chrome Extension which main purpose is to simulate cryptojacking process. Program checks client hardware data and generates simple BTC hashes to measure resources usage. Acquired data is sent to remote server. This program was made for science purposes and is used only as research tool to generate required statistics with agreement of involved users.

## Firefox version
There are separate versions for Firefox and Chrome. Since Firefox doesn't have chrome.system API, it has two input fields allowing user to input manually their CPU and RAM info.

## Variables
In files `prockiConfig.php` and `serverConfig.js` I removed credentials and server domain. In order to make this work, you need to fill them with your own credentials.

## Used Language
Code is written in English, but all labels are in Polish, since this project was developed mainly for Polish research.

## How to setup project by yourself
If you are curious how app works, you can setup extension locally with this steps (for chrome version):
1. Download code from Github
2. Navigate to chrome://extensions
3. Expand the Developer dropdown menu and click “Load Unpacked Extension”
4. Navigate to the local folder containing the extension’s code and click Ok
5. Assuming there are no errors, the extension should load into your browser

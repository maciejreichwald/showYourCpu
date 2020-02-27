var minerWorker = new Worker('bitcoinminer.js');

var HARDWARE_MAX = 4;
var hardwareCounter = 0;
var hardwareTextTable = new Array(HARDWARE_MAX);

var hardwareText =  "<h1>Dane sprzętowe</h1><br/>";
var titleDiv = document.getElementById('titleDiv');

var outputData = {};

var styleFirstColumn =
  "style=\"width: 8em;"+
  "min-width: 8em;"+
  "max-width: 8em;"+
  "text-align: right;"+
  "word-break: break-all;\"";

var styleHeader =
  "style=\"background: #000000;"+
  "color: #FFFFFF;"+
  "font-size: large;"+
  "font-weight: bold;"+
  "text-align: center;"+
  "column-span: 2;\"";

(function() {
  document.getElementById('hardwareClick').addEventListener('click', onHardwareClick);

  //chrome.system.network.getNetworkInterfaces(info => handleNetwork(info));

})();

function handleCPU() {
  var cpu = {};
  cpu.cores = navigator.hardwareConcurrency;
  cpu.name = document.getElementById('cpuInput').value;


  outputData.cpu = cpu;
  outputData.os = navigator.userAgent;
  outputData.browser = "FireFox";

  console.log("General: "+JSON.stringify(navigator.userAgent));
  console.log("CPU: "+JSON.stringify(cpu) + " System: " + navigator.oscpu);
}

function handleMemory() {
  var memory = {};
  memory.generated = navigator.deviceMemory;
  memory.input = document.getElementById('ramInput').value;
  console.log("Memory: " + JSON.stringify(memory));
  outputData.memory = memory;
}

function handleStorage() {
  outputData.storage = info;
  for (var i=0; i<info.length; i++) {
    console.log("Storage "+i+": "+fileSize(info[i].capacity));
  }

  var text =  "<table><tr><td "+styleHeader+" colspan=\"2\">Pamięć ROM</td></tr>";
  for (var i=0; i<info.length; i++) {
    text += "<tr><td "+styleFirstColumn+">"+info[i].name+"</td><td>"+fileSize(info[i].capacity)+"</td></tr>";
  }
  text += "</table>";
  manageText(text, 3);
}

function handleNetwork(info) {
  outputData.network = info;
  console.log("Network: "+JSON.stringify(info));

  var text =  "<table><tr><td "+styleHeader+" colspan=\"2\">Interfejsy Sieciowe</td></tr>";
  for (var i=0; i<info.length; i++) {
    text += "<tr><td "+styleFirstColumn+">"+info[i].name+"</td><td>"+info[i].address+"</td></tr>";
  }
  text += "</table>";
  manageText(text, 4);
}

function manageText(text, index) {
  hardwareTextTable[index] = text + "<br/>";
  hardwareCounter += 1;

  if (hardwareCounter >= HARDWARE_MAX) {
    for (var i=0; i<hardwareTextTable.length; i++) {
        hardwareText += hardwareTextTable[i];
    }
  }
}

function handleGPU() {
  var canvas = document.getElementById('canvas');
  var gl;
  var debugInfo;
  var vendor;
  var renderer;

  try {
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  } catch (e) {
    console.log("GPU ERROR"+e)
  }

  var text = "<table><tr><td class=\"table-header\" colspan=\"2\">GPU undetected</td></tr></table>";
  if (gl) {
    var vendorUnmasked = getUnmaskedInfo(gl).vendor;
    var rendererUnmasked = getUnmaskedInfo(gl).renderer;

    debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

    text =  "<table><tr><td  "+styleHeader+" colspan=\"2\">GPU</td></tr>" +
                "<tr><td "+styleFirstColumn+">Vendor</td><td>"+vendor+"</td></tr>" +
                "<tr><td "+styleFirstColumn+">Renderer</td><td>"+renderer+"</td></tr>" +
                "<tr><td "+styleFirstColumn+">Vendor 2</td><td>"+gl.VENDOR+"</td></tr>" +
                "<tr><td "+styleFirstColumn+">Renderer 2</td><td>"+gl.RENDERER+"</td></tr>";
    if (vendor !== vendorUnmasked) {
      text += "<tr><td "+styleFirstColumn+">Vendor 3</td><td>"+getUnmaskedInfo(gl).vendor+"</td></tr>"
    }

    if (renderer !== rendererUnmasked) {
      text += "<tr><td "+styleFirstColumn+">Renderer 3</td><td>"+getUnmaskedInfo(gl).renderer+"</td></tr>";
    }

    text += "</table>";

    var vendor1 = {};
    vendor1.vendor = vendor;
    vendor1.renderer = renderer;
    var vendor2 = {}
    vendor2.vendor = gl.VENDOR;
    vendor2.renderer = gl.RENDERER;
    var vendor3 = {}
    vendor3.vendor = getUnmaskedInfo(gl).vendor;
    vendor3.renderer = getUnmaskedInfo(gl).renderer;
    var gpuInfo = [vendor1, vendor2, vendor3];
    outputData.gpu = gpuInfo;

    console.log("GPU: "+vendor +" "+renderer);
  } else {
    console.log("GPU: not found");
  }

  manageText(text, 1);
}

function getUnmaskedInfo(gl) {
  var unMaskedInfo = {
    renderer: '',
    vendor: ''
  };

  var dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
  if (dbgRenderInfo != null) {
    unMaskedInfo.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
    unMaskedInfo.vendor = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
  }

  return unMaskedInfo;
}

function fileSize(bytes) {
  var exp = Math.log(bytes) / Math.log(1024) | 0;
  var result = (bytes / Math.pow(1024, exp)).toFixed(2);

  return result + ' ' + (exp == 0 ? 'bytes': 'KMGTPEZY'[exp - 1] + 'B');
}

async function infoHandler() {
  handleMemory();

  handleGPU();

  handleCPU();

  //chrome.system.storage.getInfo(info => handleStorage(info));

  chrome.system.display.getInfo(function(info){
     console.log("Display: "+JSON.stringify(info));
  });
}

function progressUpdate() {
  document.getElementById('progressContent').style.visibility = "visible";
  document.getElementById('hardwareClick').style.visibility = "hidden";
  document.getElementById('inputContainer').style.visibility = "hidden";
}

function finishProgress(message) {
  document.getElementById('buttonText').innerHTML = "Zamknij";
  document.getElementById('hardwareClick').style.visibility = "visible";
  document.getElementById('messageDiv').innerText = message;
  document.getElementById('titleDiv').style.visibility = "visible";
  document.getElementById('progressContent').style.visibility = "hidden";
  document.getElementById('okImg').style.visibility = "visible";
}

function sendOutputData(message, data) {
  var http = new XMLHttpRequest();
  var url = htmlLink;
  var params = 'orem=ipsum&name=binny';
  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
          alert(http.responseText);
      }
      finishProgress(message);
  }
  http.send("outputData="+JSON.stringify(data));
}

function showSpinner() {
  var opts = {
    lines: 13, // The number of lines to draw
    length: 12, // The length of each line
    width: 8, // The line thickness
    radius: 20, // The radius of the inner circle
    scale: 0.5, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    color: '#ffffff', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    speed: 0.7, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    className: 'spinner', // The CSS class to assign to the spinner
    top: '44%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 1px transparent', // Box-shadow for the lines
    position: 'absolute' // Element positioning
  };
  var target = document.getElementById('loader');
  var spinner = new Spinner(opts).spin(target);
}

function finishData(message, data) {
  outputData.hash = data;
  sendOutputData(message, outputData);
}

var wasClicked = false;
function onHardwareClick() {
  showSpinner();
  progressUpdate();
  minerWorker.onmessage = function(e) {
    if (e.data[0] == true) {
      document.getElementById('progressCount').value = e.data[1]*33.5;
      document.getElementById('time'+e.data[1]).innerText = e.data[2];
      return
    }

    finishData(e.data[1], e.data[2]);
    minerWorker.terminate();
  }
  minerWorker.postMessage(null);
  infoHandler();

  if (wasClicked) {
    window.close();
  } else {
    wasClicked = true;
  }
}

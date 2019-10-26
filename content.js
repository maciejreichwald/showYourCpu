chrome.system.display.getInfo(function(info){
    //alert(JSON.stringify(info));
  console.log(JSON.stringify(info));
});
chrome.system.memory.getInfo(function(info){
    //alert(JSON.stringify(info));
   console.log(JSON.stringify(info));
});
chrome.system.network.getNetworkInterfaces(function(info){
   console.log(JSON.stringify(info));
});
chrome.system.storage.getInfo(function(info){
  // alert(JSON.stringify(info));
   console.log(JSON.stringify(info));
});

var firstHref = $("a[href^='http']").eq(0).attr("href");

console.log(firstHref);

function fileSize(bytes) {
  var exp = Math.log(bytes) / Math.log(1024) | 0;
  var result = (bytes / Math.pow(1024, exp)).toFixed(2);

  return result + ' ' + (exp == 0 ? 'bytes': 'KMGTPEZY'[exp - 1] + 'B');
}

chrome.system.memory.getInfo(function(info){
  console.log("Memory changed .. " +  fileSize(info.availableCapacity));
});

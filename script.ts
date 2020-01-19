document.getElementById('meteo').onsubmit = buttonClickGET;
var callBackGetSuccess = function(data) {
  var element = document.getElementById("zone_meteo");
  element.innerHTML = "La temperature est de " + data.main.temp;
}
function buttonClickGET() {
  var url = "https://api.openweathermap.org/data/2.5/weather?q=Paris,fr&appid=c21a75b667d6f7abb81f118dcf8d4611&units=metric"

  $.get(url, callBackGetSuccess).done(function() {
      //alert( "second success" );
    })
    .fail(function() {
      alert( "error" );
    })
    .always(function() {
      //alert( "finished" );
    });
}


document.getElementById('fileForm').onsubmit = uploadFile;
var fetch = require('isomorphic-fetch'); // or another library of choice.
var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({ accessToken: 'VIGIWk8djhAAAAAAAAAA-4GG6KPuMmO_tEdHis5blKLHocA8rruGL0Ywms65hSND', fetch: fetch });
dbx.filesListFolder({path: ''})
.then(function(response) {
console.log(response);
})
.catch(function(error) {
console.log(error);
});

function uploadFile() {
    
  const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
  var ACCESS_TOKEN = document.getElementById('access-token').value;
  var dbx = new Dropbox({ accessToken: 'VIGIWk8djhAAAAAAAAAA-4GG6KPuMmO_tEdHis5blKLHocA8rruGL0Ywms65hSND' });
  var fileInput = document.getElementById('file-upload');
  var file = fileInput.files[0];


  if (file.size < UPLOAD_FILE_SIZE_LIMIT) { // File is smaller than 150 Mb - use filesUpload API
    dbx.filesUpload({path: '/' + file.name, contents: file})
      .then(function(response) {
        var results = document.getElementById('results');
        results.appendChild(document.createTextNode('File uploaded!'));
        console.log(response);
      })
      .catch(function(error) {
        console.error(error);
      });
  } else { // File is bigger than 150 Mb - use filesUploadSession* API
    const maxBlob = 8 * 1000 * 1000; // 8Mb - Dropbox JavaScript API suggested max file / chunk size

    var workItems = [];     

    var offset = 0;

    while (offset < file.size) {
      var chunkSize = Math.min(maxBlob, file.size - offset);
      workItems.push(file.slice(offset, offset + chunkSize));
      offset += chunkSize;
    } 
      
    const task = workItems.reduce((acc, blob, idx, items) => {
      if (idx == 0) {
        // Starting multipart upload of file
        return acc.then(function() {
          return dbx.filesUploadSessionStart({ close: false, contents: blob})
                    .then(response => response.session_id)
        });          
      } else if (idx < items.length-1) {  
        // Append part to the upload session
        return acc.then(function(sessionId) {
        var cursor = { session_id: sessionId, offset: idx * maxBlob };
        return dbx.filesUploadSessionAppendV2({ cursor: cursor, close: false, contents: blob }).then(() => sessionId); 
        });
      } else {
        // Last chunk of data, close session
        return acc.then(function(sessionId) {
          var cursor = { session_id: sessionId, offset: file.size - blob.size };
          var commit = { path: '/' + file.name, mode: 'add', autorename: true, mute: false };              
          return dbx.filesUploadSessionFinish({ cursor: cursor, commit: commit, contents: blob });           
        });
      }          
    }, Promise.resolve());
    
    task.then(function(result) {
      var results = document.getElementById('results');
      results.appendChild(document.createTextNode('File uploaded!'));
    }).catch(function(error) {
      console.error(error);
    });
    
  }
  return false;
}





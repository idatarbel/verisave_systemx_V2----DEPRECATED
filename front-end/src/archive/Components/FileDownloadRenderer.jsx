import React from 'react';

export default function FileDownloadRenderer (props) {
    function downloadRenderer() {
	var baseUrl = process.env.REACT_APP_API_BASE_URL;
        var fileLocation = baseUrl + props.value;
        var token = sessionStorage.getItem("token");
        var lastSlash = fileLocation.lastIndexOf("/");
        var length = fileLocation.length;
        var fileName = fileLocation.substring(lastSlash + 1, length);
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onreadystatechange = function() {
         if (xhr.readyState === 4) {
           console.log(xhr.response);
           var blob = new Blob([xhr.response], {type: 'image/pdf'});
           //Create a link element, hide it, direct it towards the blob, and then 'click' it programatically
           let a = document.createElement("a");
           a.style = "display: none";
           document.body.appendChild(a);
           //Create a DOMString representing the blob and point the link element towards it
           let url = window.URL.createObjectURL(blob);
           a.href = url;
           a.download = fileName;
           //programatically click the link to trigger the download
           a.click();
           //release the reference to the file by revoking the Object URL
           window.URL.revokeObjectURL(url);
         }
       }
       xhr.open('GET', fileLocation, true);
       xhr.setRequestHeader('Authorization', 'Bearer ' + token);
       xhr.send();
     }

    return (
      <span>
         <input type="image" src="/download.png" height="20px" alt="download" onClick={downloadRenderer} />
      </span>
    );

}

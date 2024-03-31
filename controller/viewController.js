import * as stringHandler from "./stringHandlers.js";

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("convertBtn").addEventListener("click", function () {
        var curlText = document.getElementById("curlInput").value;

        if (curlText) {
            try {
                stringHandler.convertCurl(curlText);
            } catch (error) {
                printResultToUser('Invalid CUrl. Verify and try again.' + error)
            }

        }
    });
});

document.getElementById('copyButton').addEventListener('click', function () {
    const textToCopy = document.getElementById('cyRequestOutput').value;

    navigator.clipboard.writeText(textToCopy).then(function () {
        console.log('Copied');
    }, function (err) {
        console.error('Error when try to copy: ', err);
    });
});

export function printResultToUser(cyRequestText) {

    let elementoOutput = document.getElementById('cyRequestOutput');
    elementoOutput.value = cyRequestText;

    elementoOutput.style.height = 'auto';
    elementoOutput.style.height = (elementoOutput.scrollHeight) + 'px';

}
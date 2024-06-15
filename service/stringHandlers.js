
export function convertCurl(curlCommand) {

    const curlObject = parseCurl(curlCommand)
    const cypressObjectModel = cypressObjectAdapter(curlObject)
    const cyRequestText = objectToCyRequest(cypressObjectModel)

    return cyRequestText
}

export function parseCurl(curlString) {

    let Request = getVerbAndUrl(curlString);
    let Headers = getHeaders(curlString);
    let body = getBody(curlString);

    return { Request, Headers, body };
}

export function getVerbAndUrl(curlString) {

    const VERBRegex = /--request\s+(\S+)\s+'([^']+)'/;
    const GETRegex = /--location\s+'([^']+)'/;
    let verbMethod;

    const is_PostPutPatch = curlString.match(VERBRegex) ? true : false

    if (is_PostPutPatch) {
        let requestMatch = curlString.match(VERBRegex)
        verbMethod = { method: requestMatch[1], url: requestMatch[2] };

    } else {
        let requestMatch = curlString.match(GETRegex)
        verbMethod = { method: 'GET', url: requestMatch[1] };

    }

    return verbMethod

}

export function getHeaders(curlString) {

    let Headers = [];
    let headerRegex = /--header\s+'([^:]+):\s*([^']+)'/g;
    let headerMatch;

    while ((headerMatch = headerRegex.exec(curlString)) !== null) {
        Headers.push({ key: headerMatch[1], value: headerMatch[2] });
    }

    return Headers

}

export function getBody(curlString) {

    let body = '';

    let dataRegex = /--data\s+'([^']+)'/;
    let dataMatch = curlString.match(dataRegex);
    if (dataMatch) {
        body = dataMatch[1];
    }

    return body

}

export function getQueryString(url) {
    let qs = {};
    let regex = /\?([^#]+)/;
    let match = url.match(regex);

    if (match && match[1]) {
        match[1].split('&').forEach(function (part) {
            let item = part.split('=');
            qs[decodeURIComponent(item[0])] = decodeURIComponent(item[1].replace(/\+/g, ' '));
        });
    }

    return qs;
}

export function removeQueryString(url) {

    let cleanedUrl = url.split('?')[0];
    return cleanedUrl;
}

export function cypressObjectAdapter(curlDataObjects) {
    let cypressObject = {}
    let cypressHeaders = curlDataObjects.Headers.reduce((acc, header) => {
        acc[header.key] = header.value;
        return acc;
    }, {});
    delete cypressHeaders["User-Agent"];

    let queryString = getQueryString(curlDataObjects.Request.url)
    curlDataObjects.Request.url = removeQueryString(curlDataObjects.Request.url)

    const cypressUrl = curlDataObjects.Request.url ? curlDataObjects.Request.url : 'Url not found'
    const cypressMethod = curlDataObjects.Request.method ? curlDataObjects.Request.method : 'Method not found'
    const cypressQs = queryString ? queryString : null
    const cypressBody = curlDataObjects.body ? curlDataObjects.body : null

    return cypressObject = {
        url: cypressUrl,
        method: cypressMethod,
        headers: cypressHeaders,
        qs: cypressQs,
        body: cypressBody
    }
}

export function objectToCyRequest(curlObject) {

    let cyRequestText = `cy.request({\n`;

    // add URL and method
    cyRequestText += `    url: '${curlObject.url}',\n`;
    cyRequestText += `    method: '${curlObject.method}',\n`;

    // add headers if exist
    if (Object.keys(curlObject.headers).length > 0) {
        cyRequestText += `    headers: {\n`;
        for (const [key, value] of Object.entries(curlObject.headers)) {
            cyRequestText += `        ${key}: '${value}',\n`;
        }
        cyRequestText += `    },\n`;
    }

    // add query string if exist
    if (Object.keys(curlObject.qs).length > 0) {
        cyRequestText += `    qs: {\n`;
        for (const [key, value] of Object.entries(curlObject.qs)) {
            cyRequestText += `        ${key}: '${value}',\n`;
        }
        cyRequestText += `    },\n`;
    }

    // add body if exist
    if (curlObject.body) {
        try {
            // if body was json, will format him
            const bodyObj = JSON.parse(curlObject.body);
            const formattedBody = JSON.stringify(bodyObj, null, 8).replace(/^/gm, ' ');
            cyRequestText += `    body: ${formattedBody}\n`;
        } catch (e) {
            // if not is json, add body like a string
            cyRequestText += `    body: ${curlObject.body}\n`;
        }
    }

    cyRequestText += `}).then((res) => {
        expect(res.status).to.equal(200)
    })`;

    return cyRequestText;
}


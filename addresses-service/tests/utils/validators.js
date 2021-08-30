const isApiGatewayResponse = response => {
    const { headers, body, statusCode } = response;

    if(!headers || !body || !statusCode) return false;
    if(typeof statusCode !== 'number') return false;
    if(typeof body !== 'string') return false;
    if(!isCorrectHeader(headers)) return false;

    return true;
}

const isCorrectHeader = headers =>{
    if (headers['Content-Type'] !== 'application/json') return false;
    if (headers['Access-Control-Allow-Methods'] !== '*') return false;
    if (headers['Access-Control-Allow-Origin'] !== '*') return false;

    return true;
}

module.exports = {
    isApiGatewayResponse,
    isCorrectHeader
}
const apiResponse = require('../../lambdas/common/apiResponses');

test('Responses is an object',()=>{
    expect(typeof apiResponse).toBe('object');
});

test('_200 works', () =>{
    const res = apiResponse._200({ id : '1234'});
    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe('string');
    expect(res.headers['Content-Type']).toBe('application/json');
})

test('_400 works', () =>{
    const res = apiResponse._400({ any : 'thing'});
    expect(res.statusCode).toBe(400);
    expect(typeof res.body).toBe('string');
    expect(res.headers['Content-Type']).toBe('application/json');
})

test('_404 works', () =>{
    const res = apiResponse._404({ any : 'thing'});
    expect(res.statusCode).toBe(404);
    expect(typeof res.body).toBe('string');
    expect(res.headers['Content-Type']).toBe('application/json');
})

test('_500 works', () =>{
    const res = apiResponse._500({ any : 'thing'});
    expect(res.statusCode).toBe(500);
    expect(typeof res.body).toBe('string');
    expect(res.headers['Content-Type']).toBe('application/json');
})

test('Define response works', () =>{
    const res = apiResponse._DefineResponse(382,{ any : 'thing'});
    expect(res.statusCode).toBe(382);
    expect(res.body).toBe(JSON.stringify({ any : 'thing'}));
    expect(res.headers['Content-Type']).toBe('application/json');
})
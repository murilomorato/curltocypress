const stringHandlers = require('./stringHandlers');

describe('Extract method from cURL string', () => {

    const cases = [
        { input: "curl --location 'https://example.com/api/v1/id/endpoint' --header 'client: abc' --header 'token: xyz'", expected: 'GET' },
        { input: "curl --location --request POST 'https://example.com/api/v1/id/endpoint' --header 'client: abc' --header 'token: xyz'", expected: 'POST' },
        { input: "curl --location --request PUT 'https://example.com/api/v1/id/endpoint' --header 'client: abc' --header 'token: xyz'", expected: 'PUT' },
    ];

    cases.forEach(testcase => {

        test('should extract method from cURL string', () => {

            const resultVerb = stringHandlers.getVerbAndUrl(testcase.input).method;
            const expectedVerb = testcase.expected;

            expect(resultVerb).toBe(expectedVerb);

        })

    });
});

describe('Url handler', () => {

    test('should extract Url from cURL string', () => {

        const exampleCurl = "curl --location 'https://example.com/api/v1/id/endpoint?query=abcdef' --header 'client: abc' --header 'token: xyz'"

        const resultUrl = stringHandlers.getVerbAndUrl(exampleCurl).url;
        const expectedUrl = 'https://example.com/api/v1/id/endpoint?query=abcdef';

        expect(resultUrl).toBe(expectedUrl);

    })

    test('should extract Query string from Url', () => {

        const exampleUrl = "https://example.com/api/v1/id/endpoint?find=abcdef&sort=asc"

        const resultQueryString = stringHandlers.getQueryString(exampleUrl);
        const expectedQueryString = { "find": "abcdef", "sort": "asc" };

        expect(resultQueryString).toStrictEqual(expectedQueryString);

    })

    test('should not found Query string in Url', () => {

        const exampleUrl = "https://example.com/api/v1/id/endpoint"

        const resultQueryString = stringHandlers.getQueryString(exampleUrl);
        const expectedQueryString = {};

        expect(resultQueryString).toStrictEqual(expectedQueryString);

    })

    test('should remove Query string from Url', () => {

        const exampleUrl = "https://example.com/api/v1/id/endpoint?find=abcdef&sort=asc"

        const resultUrl = stringHandlers.removeQueryString(exampleUrl);
        const expectedUrl = 'https://example.com/api/v1/id/endpoint';

        expect(resultUrl).toBe(expectedUrl);

    })



});

describe('Extract headers from cURL string', () => {

    const cases = [
        { input: "curl --location 'https://example.com/api/v1/id/endpoint' ", expected: [] },
        { input: "curl --location --request POST 'https://example.com/api/v1/id/endpoint' --header 'client: abc'", expected: [{ "key": "client", "value": "abc" }] },
        { input: "curl --location --request PUT 'https://example.com/api/v1/id/endpoint' --header 'client: abc' --header 'token: xyz' --header 'user: 150'", expected: [{ "key": "client", "value": "abc" }, { "key": "token", "value": "xyz" }, { "key": "user", "value": "150" }] },
    ];

    cases.forEach(testcase => {

        test('should extract headers from cURL string', () => {

            const resultHeader = stringHandlers.getHeaders(testcase.input);
            const expectedHeader = testcase.expected;

            expect(resultHeader).toStrictEqual(expectedHeader);

        })

    });
});


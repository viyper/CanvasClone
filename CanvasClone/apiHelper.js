var request = require('request-promise');
var Bottleneck = require('bottleneck');
var linkparser = require('parse-link-header');

const limiter = new Bottleneck({
    maxConcurrent: 20,
    minTime: 100
});

const requestObj = (url, token, include = []) => ({
    'method': 'GET',
    'uri': url,
    'json': true,
    'resolveWithFullResponse': true,
    'headers': {
        'Authorization': 'Bearer ' + token
    }
});

const fetch = (url, token) => request(requestObj(url, token)).then(response => response.body);

const fetchRateLimited = limiter.wrap(fetch);

const fetchAll = (url, token, result = []) => request(requestObj(url, token)).then(response => {
    result = [...result, ...response.body];
    const links = linkparser(response.headers.link);
    return links.next ? fetchAll(links.next.url, token, result) : result;
});

const fetchAllRateLimited = limiter.wrap(fetchAll);

const getCoursesByUser = (domain, token, userID) => fetchAllRateLimited(domain + `/users/${userID}/courses`, token);
const getCourseTeachers = (domain, token, courseID) => fetchAllRateLimited(domain + `/courses/${courseID}/users?enrollment_type=TeacherEnrollment`, token);
const getCourseAssignments = (domain, token, courseID) => fetchAllRateLimited(domain + `/courses/${courseID}/assignments?order_by=due_at&include[]=submission`, token);
const getCourseByID = (domain, token, courseID) => fetchAllRateLimiter(domain + `/courses/${courseID}`, token);

module.exports =  {
    "fetch": fetch,
    "fetchRateLimited": fetchRateLimited,
    "fetchAll": fetchAll,
    "fetchAllRateLimited": fetchAllRateLimited,
    "getCoursesByUser": getCoursesByUser,
    "getCourseTeachers": getCourseTeachers,
    "getCourseAssignments": getCourseAssignments,
    "getCourseByID": getCourseByID
}
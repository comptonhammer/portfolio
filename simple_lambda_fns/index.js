//@ts-check
const requestPromise = require('request-promise');
exports.handler = async (event) => {
    const {
        project,
        api_key,
        session
    } = event;
    const query = event["last user freeform input"] || event.query;

    if(query && project && api_key) 
    requestPromise
        .get(`/bing/default/spell?text=${query}`)
        .then(res => {
        const options = {
            uri:'/fb/default/chatfuel-dialogflow',
            headers:{
            'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                "last user freeform input": res,
                api_key,
                session,
                project
            })
        };
        requestPromise
            .post(options)
            .then((res) => {
                return res;
            });
        });
    else 
    return { error:"Malformed input" };
}

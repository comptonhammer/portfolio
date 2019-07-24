// Written June 2019
// Alec

const fs = require('fs');
const dialogflow = require('dialogflow');
const endpointApi = require('./models/api'); // MONGODB model

exports.handler = async (event) => {
    const { 
        project, 
        api_key, 
        session 
    } = event;
    const query = event['last user freeform input'] || event.query;
    const readBuffer = fs.readFileSync(__dirname + `/secrets/${project}.json`,'utf8');
    const jsonKeys = JSON.parse(readBuffer);

    endpointApi.findOne({ api_key }, (err, doc) => {
        if(!err && doc){
            console.log(`Chatfuel request recieved for ${project}`);
            doc.uses += 1;
            doc.save((err) => {
                if(err) 
                    console.log(err);
                else 
                    console.log('DB Updated');
            })

            const {
                project_id,
                private_key,
                client_email
            } = jsonKeys;

            if(project_id && private_key && client_email) 
                sendQuery(
                    project_id, 
                    private_key, 
                    client_email, 
                    session, 
                    query, 
                    (err, datum) => {
                        if(err) 
                            return `Chatfuel ERROR: ${err}`;
                        else 
                            return datum;
                    }
                );
            else{
                console.log('Could not read json file...');
                return 'Chatfuel ERROR: Corrupt JSON file';
            }
        }
		else 
			return (err ? `Chatfuel ERROR: ${err}` : `That account doesn't exist`);
    })
}

function sendQuery(projectId, key, client, sessionId, query, callback){
    const config = {
        credentials: {
            private_key: key,
            client_email: client
        }
    }
    const sessionClient = new dialogflow.SessionsClient(config);
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    const request = {
        session: sessionPath,
        queryInput:{
            text:{
                text: query,
                languageCode: 'en-US'
            }
        }
    }

    let promise = sessionClient.detectIntent(request);
    promise.then(responses => {
        let chatfuelPayload = {};
	    
        for(let i = 0; responses[0].queryResult.fulfillmentMessages[i]; i++){
		
            let fulfillmentMsg = responses[0].queryResult.fulfillmentMessages[i];
		
            if(fulfillmentMsg.platform == "PLATFORM_UNSPECIFIED"){
                switch(fulfillmentMsg.message){
                    case "text":
                        handleChatfuelText(chatfuelPayload, fulfillmentMsg);
                        break;
                    case "payload":
                        handleChatfuelPayload(chatfuelPayload, fulfillmentMsg);
                        break;
                }
            }
        }
	    
        console.log('Success...');
        callback(false, chatfuelPayload);
    })
    .catch(err => {
        console.error(err);
        callback(err);
    })
}

function handleChatfuelText(payload, fulfillmentMsg){ // Payload passes by ref
    if (!payload.messages) 
        payload.messages = [];
    payload.messages.push({
        text: fulfillmentMsg.text.text[0]
    });
}

function handleChatfuelPayload(payload, fulfillmentMsg){ // Payload passes by ref
    let formattedPayload = chatfuelify(fulfillmentMsg.payload.fields);
    let entries = Object.entries(formattedPayload);

    for(let [name, data] of entries){
        if(Array.isArray(payload[name])){
            if(Array.isArray(data)) 
                payload[name].push(data[0]);
            else 
                payload[name].push(data);
        }
        else 
            payload[name] = data;
    }
}

function chatfuelify(values){ // Convert Dialogflow API JSON to Chatfuel API JSON
    let newValues = {};
    let nameVal = Object.entries(values);
    for(let [name,data] of nameVal){
        newValues[name] = chatfuelifyHelper(data);
    }
    return newValues;
}

function chatfuelifyHelper(values){
    switch(values.kind){
        case "listValue": // Parse as Array
            for(let i = 0; values.listValue.values[i]; i++)
                values.listValue.values[i] = chatfuelifyHelper(values.listValue.values[i]);
            return values.listValue.values;
        case "structValue": // Parse as Obj
            const name = Object.entries(values.structValue.fields);
            for(let [variable, val] of name){
                values.structValue.fields[variable] = chatfuelifyHelper(val);
            }
            return values.structValue.fields;
        default:
            return values[values.kind] ? values[values.kind] : {}; 
    }
}

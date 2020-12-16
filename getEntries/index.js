module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var msg = cleanData(context.bindings.inputTable)

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: msg,
        headers: {
            "Content-Type": "application/json"
        }
    };
}

function cleanData(payload){

    var obj = []

    for (var i = 0; i < payload.length; i++) {
        try {
            payload[i].rawMessage ? payload[i].rawMessage = JSON.parse(payload[i].rawMessage) : payload[i].rawMessage = payload[i].rawMessage
            obj.push(payload[i]); 
        }
        catch (err){
            context.log(err)
            obj.push(payload[i])
        }
    }

    return obj
}
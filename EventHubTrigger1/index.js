const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");
const { TableClient, TablesSharedKeyCredential } = require("@azure/data-tables");
require('dotenv').config()

const credential = new DefaultAzureCredential();

const vaultName = process.env.VAULT_NAME;
const url = `https://${vaultName}.vault.azure.net`;

const client = new SecretClient(url, credential);

const secretName = process.env.SECRET_NAME;

/**
 * Storage tables SDK: 
 * https://azuresdkdocs.blob.core.windows.net/$web/javascript/azure-data-tables/1.0.0-beta.3/index.html#create-a-new-entity-and-add-it-to-a-table
 */
const account = process.env.ACCT;
const accountKey = process.env.ACCT_KEY;
const tableName = process.env.TABLE_NAME

const tableCredential = new TablesSharedKeyCredential(account, accountKey);
const tableClient = new TableClient(
`https://${account}.table.core.windows.net`,
tableName,
tableCredential
);

module.exports = async function (context, eventHubMessages) {
    context.log(`JavaScript eventhub trigger function called for message array  ${JSON.stringify(eventHubMessages)}`); //<-- this is an array of arrays

    var newSecret = secret(); //random string

    await saveToKeyvault(newSecret)

    let now = new Date()

    eventHubMessages.forEach(async (message, index) => {
        context.log(`Processed message ${JSON.stringify(message)}`); //<- this msg is an array

        const testEntity = {
            partitionKey: "secrets",
            rowKey: now.toString(),
            dateChanged: `${now.getUTCMonth() + 1}-${now.getUTCDate()}-${now.getUTCFullYear()}`,
            secretName: secretName,
            rawMessage: JSON.stringify(eventHubMessages[0]) ? JSON.stringify(eventHubMessages[0]) : 'error retrieving payload'
        }

        await addToTable(testEntity)
    });

    context.done();
};

async function addToTable(payload){

    try {
        await tableClient.createEntity(payload);
    } catch (error) {
        context.log("An error occured trying to add this entry to the table")
        context.log(error)
    }

}
async function saveToKeyvault(secret){
    const result = await client.setSecret(secretName, secret, {
        enabled: true
    })

    return result
}

/**
 * Generate a secret of length 10
 * @param {*} length 
 */
const secret = (length = 10) => {
    // Declare all characters
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

    // Pick characers randomly
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;

};
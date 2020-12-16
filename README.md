# Azure Keyvault Key Rotation

This sample code demonstrates how you can use Azure keyvault events to generate a new secret/key/certificate from event hubs and save details in an azure table that's accessible through an HTTP Azure functions endpoint. 

### please note that this is code is for sample purposes and not intended for production use. It is offered with no guarantees.

## Details
* Ensure your function has an identity with appropriate permissions in the keyvault access policies
* Ensure that your functions have the right bindings (edit the function.json files in each function folder)
* Ensure that your function app has the correct environment variables
    * `VAULT_NAME`
    * `SECRET_NAME`
    * `ACCT` <-- storage acct name for your table
    * `ACCT_KEY`
    * `TABLE_NAME`

## Recommendation
It is probably best to build the function with the correct bindings, copy code in the `index.js` files, then integrate the CI/CD pipeline.
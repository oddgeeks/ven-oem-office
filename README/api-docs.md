FORMAT: 1A
HOST: https://api-staging-oem.vendori.com

# Vendori API

This is the official Vendori API documentation and single source of truth for the endpoints 
on how the fontend integrates the API endpoints.

For **GET** requests, please see [this](https://github.com/nestjsx/crud/wiki/Requests#select)
documentation for all of the parameter options.

## Endpoints

+ PSQL
    - psql://db.oem.vendori.com - The base DB URL for contecting to both the *demo* & *clean demo* ENVs.

+ HTTP
    - https://api-staging-oem.vendori.com - The base *development* endpoint that will be used for the API.
    - https://api-demo-oem.vendori.com - The base *demo* endpoint for the API.
    - https://api-clean-oem.vendori.com - The base *clean demo* endpoint for the API.
        - ⚠️ Deprecated - in a future task, clean & demo will be consolidated on the demo ENV and will be accessed on a per company basis.

## Auto Generated Attributes

Most resources returned besides intermediary tables will have the following fields.

```javascript

    {
        "status": 200,
        "message": "Items Retrieved",
        "data": [ {
            "id": 1,
            "enabled": true,
            "created_at": 1468857698,
            "updated_at": 1468857698
        } ],
            
        // Only for list endpoints. Helps with pagnination.
        "count": 6,
        "total": 6,
        "page": 1,
        "pageCount": 1
    }

```

## Error States

Here are the common [HTTP Failure Response Status Codes](https://www.getpostman.com/collections/fba2400145e71f05d10c) 
that are used in the Vendori API:

| HTTP code | Reason | Formats |
| :---: | :---: | :---: |
| 400, 422 | The parameters sent were incorrectly formatted. | JSON |
| 401 | The authorization header is invalid. | JSON |
| 404, 405 | The requested resource could not be found. | JSON |
| 500, 502 | There was an internal server error. Details: ... | JSON, HTML |

## Headers - Authorization & Accept

For Vendori, every request except the Oauth redirect after login, 
will require the following authentication header format. 

The *Referrer* header is important to specify because it's used to identify the subdomain of the company.

| Header | Value |
| :---: | :---: |
| Authorization: | Bearer 1234567-1234567-1234567-1234567 |
| Accept: | application/json |
| Referrer: | https://staging.vendori.com |

# Data Structures

## ShadingRule (array)
+ (object)
    + id: 79 (number, required) - The id of the pricng rule

# API Calls

## Cloning [/]

The API used for copying entities on the platform.

⚠️ These endpoints recently underwent a update change following the implementation of 
[this](https://bloodandtreasure.atlassian.net/browse/VEN-1520) task. (VEN-1520).

+ Attributes (ShadingRule)

### Clone a Pricing Rule [POST /pricing-rules/{id}/clone]

+ Parameters

    + id: 79 (number, required) - The id of the pricng rule

+ Request (application/json)

    + Headers

            Content-Type: application/json
            Accept: application/json
            Authorization: Bearer {token}
            Referer: 'https://staging.vendori.com'

+ Response 201 (application/json)

    + Body

            {
                "status": 201,
                "message": "Shading Rule 79 is Cloned",
                "success": true,
                "data": {
                    "shadingRuleId": 1,
                    "companyId": 1,
                    "ownerUserId": 2,
                    "priority": 1,
                    "shadingRuleName": "Test rule",
                    "shadingRuleLogic": {
                        "antecedent": [
                            {
                                "unit": "units",
                                "scope": "quantity",
                                "value": "5",
                                "valueTo": null,
                                "matchRule": "contains",
                                "scopeCriteria": "a-line-item-in-a-quote-being-created",
                                "connectionType": "then",
                                "operationCriteria": "greater-than"
                            }
                        ],
                        "consequent": [
                            {
                                "value": "Text rule",
                                "matchRule": "should",
                                "shadingType": "shade-red",
                                "scopeCriteria": "the-violating-items",
                                "operationCriteria": "and-generate-a-comment-that-reads"
                            }
                        ]
                    },
                    "isActive": false,
                    "isEnabled": true,
                    "createdAt": "2023-02-07T10:02:41.115Z",
                    "updatedAt": "2023-02-07T10:02:41.115Z",
                    "ownerUser": {
                        "userId": 2,
                        "firstName": "Demo",
                        "lastName": "Admin"
                    }
                }
            }

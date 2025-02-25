## Getting Started

This project requires a valid Redis instance to be accessible.
This can be accomplished via Docker for example.

First, run the command to install dependencies:

```bash
npm i
# or
yarn
```

Next, copy the .env.example to .env and replace the desired SERVER_PORT and Redis connection details.

Then, run the development server:

```bash
npm run start
# or
yarn start
```

## Update the JSON of the vaults

### Required base params for both vaults supported

| **Attribute**     | **Description**                                                                                                                                                                                                                          |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **id**        | Must be unique, but this field is mainly there because it is the one that is then used to select the image for the vault. You can add up to number 27 for now.                                                                            |
| **name**      | Name of the vault.                                                                                                                                                                                                                        |
| **network**   | Network on which the vault operates. We support: <ul><li>"osmosis"</li><li>"ethereum"</li></ul>                                                                                                                                          |
| **provider**  | Provider of the strategy. We support: <ul><li>"osmosis"</li><li>"mellow"</li></ul>                                                                                                                                                       |
| **type**      | Type of vault, as defined in the VaultsType enum: <ul><li>"No IL"</li><li>"Volatile / Volatile"</li><li>"Volatile / Stable"</li></ul>                                                                                                    |
| **intention** | Vault intention, according to the Intention enum: <ul><li>"Moderate+"</li><li>"Aggressive+"</li><li>"Stable+"</li></ul>                                                                                                                  |
| **strategy**  | Vault strategy, defined in the VaultStrategy enum: <ul><li>"CL Strategy"</li><li>"Curated LRT"</li></ul>                                                                                                                                 |
| **address**   | Address of the vault contract.                                                                                                                                                                                                           |
| **slug**      | This will be the url that will be generated from the vault. It is a field that will then be visible to the user. Normally it is formed with the name of the vault, as it must be a UNIQUE field. <br> `Important:` If you add 'test-....' at the beginning of the field, this vault will only be visible in staging and not in production. So this way, for example, if one of the vaults has to be tested before going into production, you can add the test- in front of whatever follows it. |
| **thesis**    | Thesis of the vault. Someone from the team should provide you with this information.                                                                                                                                                     |

###### Example

```
{
      "id": 18,
      "name": "Name Example",
      "network": "osmosis",
      "provider":"osmosis",
      "type": "Volatile / Volatile",
      "intention": "Aggressive+",
      "strategy": "CL Strategy",
      "address": "osmoXXXXXXX",
      "slug": "example-cl-vault",
      "thesis": "Vault thesis. This text describes the strategy and intention of the vault and should be provided by the team"
}
```


## Optional base params for both vaults supported


| **Attribute**         | **Description**                                                                                                                                                                                                                                                                                                                                                                  |
|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **noGraph**       | Sometimes it is necessary to hide the graph from the vault view and show an "Is coming" when the vault is new. So if this attribute is set to true, the graph will not be displayed. By default, it will always show.                                                                                                                                                            |
| **isEstimated**   | The isEstimated causes the FE to display the "~" and the hover of the tooltip to change and display the message that it is estimated. Normally it is estimated when we overwrite the APY data, and this usually happens when the vault is new.                                                                                                                                    |
| **isFeatured**    | isFeatured is an attribute that if set to true we will see a tag in the FE of that vault in order to draw the user's attention. It is only used to display this tag.                                                                                                                                                                                                             |
| **isAutocompound**| isAutocompound is an attribute that if set to true we will set the vault to <<autocompound>> and people won't be able to claim manually that vault. We will have it permanent once we finalize the migration of all CL Vaults to autocompound.                                                                                                                                    |
| **isHidden**| isHidden is an attribute that, when set to true, hides the vault from the vault list. However, this vault will still be visible to users with a balance in it and will also appear on their dashboard page. Additionally, it will remain accessible to users who have the vault's URL.                                                                                                                                    |
| **disableDeposits**| disableDeposits is an attribute that if set to true we will disable the deposits for this vault.                                                                                                                                    |


###### Example

```
{
    "noGraph":true,
    "isEstimated":true,
    "isFeatured":true,
    "isAutocompound":true,
    "isHidden":true,
    "disableDeposits":true
}
```

## Required params for CL Strategy

| **Attribute**         | **Description**                                                                                                                                                                                                                                                                                                                   |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **extra**         | Parameters specific for CL Vault:                                                                                                                                                                                                                                                                                                |
| &nbsp;&nbsp;&nbsp;&nbsp;**poolId**      | This field refers to the pool to which this vault is assigned. It is very important as it is used in the osmosis front end to display the link that refers to a specific pool. There is a method ***getVaultsByPool*** that searches by pool and returns the vaults that refer to the Osmosis pool. This field can be repeated in more than one vault. |
| &nbsp;&nbsp;&nbsp;&nbsp;**maxCap**      | Refers to the maximum cap of the vault, in DOLLARS. If present, the progress bar will be displayed on the FE, and the vault will be disabled when the TVL has reached the cap. If no cap exists, this field can be omitted.                                                                                 |
| &nbsp;&nbsp;&nbsp;&nbsp;**haveAirdrop** | Some vaults will be rewarded with an airdrop. If this property is present on the vault, a tag will be shown.                                                                                                                                                                                                 |


###### Example
```
    "extra": {
        "poolId": 1314,
        "maxCap": 500000
        "haveAirdrop": 500000
    }
```

## Required params for Curated LRT

| **Attribute**         | **Description**                                                                                                                                       |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| **depositUrl**    | URL to the mellow page for the user to deposit into the vault.                                                                                        |

###### Example
```
    "depositUrl": "https://app.mellow.finance/restake/ethereum-rsteth"
```

const Moralis = require("moralis/node")
require("dotenv").config()

const contractAddresses = require("./constants/networkMapping.json")

let chainId = process.env.chainId || 31337
let moralisChainId = chainId == "31337" ? "1337" : chainId

const contractAddress = contractAddresses[chainId]["NftMarketplace"][0]

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
const appId = process.env.NEXT_PUBLIC_APP_ID
const masterKey = process.env.masterKey

async function main() {
    await Moralis.start({ serverUrl, appId, masterKey })
    console.log(`Working with the contract address ${contractAddress}`)

    let itemListedOptions = {
        chainId: moralisChainId,
        sync_historical: true,
        topic: "itemListed(address,address,uint256,uint256)",
        address: contractAddress,
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemListed",
            type: "event",
        },
        tableName: "ItemListed",
    }

    let itemBoughtOptions = {
        chainId: moralisChainId,
        sync_historical: true,
        topic: "itemBought(address,address,uint256,uint256)",
        address: contractAddress,
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "itemBought",
            type: "event",
        },
        tableName: "ItemBought",
    }

    let itemCanceledOptions = {
        chainId: moralisChainId,
        sync_historical: true,
        topic: "itemCanceled(address,address,uint256)",
        address: contractAddress,
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "itemCanceled",
            type: "event",
        },
        tableName: "ItemCanceled",
    }

    const listedResponse = await Moralis.Cloud.run("watchContractEvent", itemListedOptions, {
        useMasterKey: true,
    })
    const boughtResponse = await Moralis.Cloud.run("watchContractEvent", itemBoughtOptions, {
        useMasterKey: true,
    })
    const canceledResponse = await Moralis.Cloud.run("watchContractEvent", itemCanceledOptions, {
        useMasterKey: true,
    })

    if (listedResponse.success && boughtResponse.success && canceledResponse.success) {
        console.log("Success Database Updated with watching Events!")
    } else {
        console.log("Something went Wrong...")
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

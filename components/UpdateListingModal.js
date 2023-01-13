import { useState } from "react"
import { Modal, Input, useNotification } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import NftMarketplace from "../constants/NftMarketplaceAbi.json"
import { ethers } from "ethers"

export default function UpdateListingPrice({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
}) {
    const [priceToUpdateListingWith, setpriceToUpdateListingWith] = useState(0)
    const dispatch = useNotification()

    const handleUpdateListingAddress = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Listing Updated",
            title: "Listing updated - Please refrest (and move Blocks)",
            position: "topR",
        })
        onClose && onClose()
        setpriceToUpdateListingWith("0")
    }

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: NftMarketplace,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
        },
    })

    return (
        <div>
            <Modal
                isVisible={isVisible}
                onCancel={onClose}
                onCloseButtonPressed={onClose}
                onOk={() => {
                    updateListing({
                        onError: (error) => {
                            console.log(error)
                        },
                        onSuccess: handleUpdateListingAddress,
                    })
                }}
            >
                <Input
                    label="Update listing Price in L1 Currency (ETH)"
                    name="New Listing Price"
                    type="number"
                    onChange={(event) => {
                        setpriceToUpdateListingWith(event.target.value)
                    }}
                />
            </Modal>
        </div>
    )
}

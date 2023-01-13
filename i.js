async function approveAndList(data) {
    console.log("Approving...")
    const nftAddress = data.data[0].inputResult
    const tokenId = data.data[1].inputResult
    const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

    const approveOptions = {
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "approve",
        params: {
            to: marketplaceAddress,
            tokenId: tokenId,
        },
    }

    await runContractFunction({
        params: approveOptions,
        onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
        onError: (error) => {
            console.log(error)
        },
    })
}

async function handleApproveSuccess(nftAddress, tokenId, price) {
    console.log("Ok! Now time to list")
    const listOptions = {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "listItem",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            price: price,
        },
    }

    await runContractFunction({
        params: listOptions,
        onSuccess: handleListSuccess,
        onError: (error) => console.log(error),
    })
}

async function handleListSuccess(tx) {
    await tx.wait(1)
    dispatch({
        type: "success",
        message: "NFT listing",
        title: "NFT listed",
        position: "topR",
    })
}

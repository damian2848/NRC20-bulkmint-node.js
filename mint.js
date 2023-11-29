const nearAPI = require('near-api-js');
const { connect, KeyPair } = nearAPI;

async function callContractMethod() {
    // 配置连接参数
    const config = {
        networkId: "mainnet"
        keyStore: new nearAPI.keyStores.InMemoryKeyStore(), 
        nodeUrl: "----", // NEAR节点URL，去ankr获取 https://www.ankr.com/rpc/projects
        walletUrl: "https://wallet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.mainnet.near.org",
    };

    const near = await connect(config);

    // 配置账户和密钥
    const privateKey = '----'; // 你的私钥
    const keyPair = KeyPair.fromString(privateKey);
    await config.keyStore.setKey(config.networkId, '----', keyPair);//你的地址 or username.near

    const account = await near.account('----');//你的地址 or username.near

    const contractName = 'inscription.near';
    const methodName = 'inscribe';
    const args = {
        "p": "nrc-20",
        "op": "mint",
        "tick": "neat",
        "amt": "100000000"
    };

    const totalMintCount = 10000; // 你想要发送的次数
    let successfulMintCount = 0;

    for (let i = 1; i <= totalMintCount; i++) {
        try {
            const result = await account.functionCall({
                contractId: contractName,
                methodName: methodName,
                args,
                gas: '30000000000000', //这里是gas
                attachedDeposit: 0,
            });

            if (result && result.status && result.status.SuccessValue === '') {
                successfulMintCount++;
                console.log(`已mint ${successfulMintCount}次,${result.transaction.hash}`);
            }
        } catch (error) {
            console.error('Contract method call failed:', error);
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

callContractMethod();

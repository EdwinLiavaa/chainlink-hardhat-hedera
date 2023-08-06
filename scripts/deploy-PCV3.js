console.clear();
require("dotenv").config();
const {
	AccountId,
	PrivateKey,
	Client,
	FileCreateTransaction,
	ContractCreateTransaction,
	ContractFunctionParameters,
	ContractExecuteTransaction,
	ContractCallQuery,
	Hbar,
} = require("@hashgraph/sdk");
const fs = require("fs");

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
	// Import the compiled contract bytecode
	const contractBytecode = fs.readFileSync('./contracts/bin/contracts_PriceConsumerV3_sol_PriceConsumerV3.bin');

	// Create a file on Hedera and store the bytecode
	const fileCreateTx = new FileCreateTransaction()
		.setContents(contractBytecode)
		.setKeys([operatorKey])
		.freezeWith(client);
	const fileCreateSign = await fileCreateTx.sign(operatorKey);
	const fileCreateSubmit = await fileCreateSign.execute(client);
	const fileCreateRx = await fileCreateSubmit.getReceipt(client);
	const bytecodeFileId = fileCreateRx.fileId;
	console.log(`- The bytecode file ID is: ${bytecodeFileId} \n`);
}
main();
const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')


class Transaction {
	constructor(fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress
		this.toAddress = toAddress
		this.amount = amount
		this.timestamp = Date.now()
	}

	calculateHash() {
		return SHA256(this.fromAddress + this.toAddress + this.amount + this.timestamp).toString()
	}

	signTransaction(signingKey) {
		if(signingKey.getPublic('hex') !== this.fromAddress) {
			throw new Error('You cannot sign transactions for other wallets!')
		}

		const hashTx = this.calculateHash()
		const sig = signingKey.sign(hashTx, 'base64')
		this.signature = sig.toDER('hex')
	}

	isValid() {
		if(this.fromAddress === null) return true
		
		if(!this.signature || this.signature.length === 0) {
			throw new Error('No signature in this transaction')
		}

		const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
		return publicKey.verify(this.calculateHash(), this.signature)
	}
}

class Block {
	constructor(timestamp, transactions, previousHash = '') {
		this.timestamp = timestamp
		this.transactions = transactions
		this.previousHash = previousHash
		this.hash = this.calculateHash()
		this.nonce = 0
	}

	calculateHash() {
		return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString()
	}

	mineBlock(difficulty) {
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
			this.nonce++
			this.hash = this.calculateHash()
		}

		console.log("Block mimed: " + this.hash)
	}

	hasValidTransactions() {
		for(const tx of this.transactions) {
			if(!tx.isValid()) {
				return false
			}
		}

		return true
	}
}

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()]
		// 2, 4, 5 => 00XXX, 0000XXX, 00000XXX
		this.difficulty = 2
		this.pendingTransactions = []
		this.miningReward = 100
	}

	createGenesisBlock() {
		// return new Block("01/01/2019", "Genesis block", "0")
		return new Block(Date.parse('2019-01-01'), [], "0")
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1]
	}

	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash
		newBlock.mineBlock(this.difficulty)
		this.chain.push(newBlock)
	}

	minePendingTransactions(miningRewardAddress) {
		const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward)
		this.pendingTransactions.push(rewardTx)

		let block = new Block(Date.now(), this.pendingTransactions)
		block.mineBlock(this.difficulty)

		console.log('Block successfully mined!')
		this.chain.push(block)

		this.pendingTransactions = [
			new Transaction(null, miningRewardAddress, this.miningReward)
		]
	}

	addTransaction(transaction) {
		if(!transaction.fromAddress || !transaction.toAddress) {
			throw new Error('Transaction must include from and to address')
		}

		if(!transaction.isValid()) {
			throw new Error('Cannot add invalid transaction to chain')
		}

		this.pendingTransactions.push(transaction)
	}

	getBalanceOfAddress(address) {
		let balance = 0
		
		for(const block of this.chain) {
			for(const trans of block.transactions) {
				if(trans.fromAddress === address) {
					balance -= trans.amount
				}

				if(trans.toAddress === address) {
					balance += trans.amount
				}
			}
		}

		return balance
	}

	getAllTransactionForWallet(address) {
		const txs = []
		
		for(const block of this.chain) {
			for(const tx of block.transactions) {
				if(tx.fromAddress === address || tx.toAddress === address) {
					txs.push(tx)
				}
			}
		}
		return txs
	}

	isChainValid() {
		for(let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i]
			const previousBlock = this.chain[i - 1]

			if(!currentBlock.hasValidTransactions()) {
				return false
			}

			if(currentBlock.hash !== currentBlock.calculateHash()) {
				return false
			}

			if(currentBlock.previousHash !== previousBlock.calculateHash()) {
				return false
			}
		}
		
		return true
	}
}

module.exports.Blockchain = Blockchain
module.exports.Block = Block
module.exports.Transaction = Transaction

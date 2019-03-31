const SHA256 = require('crypto-js/sha256')

class Block {
	constructor(index, timestamp, data, previousHash = '') {
		this.index = index
		this.timestamp = timestamp
		this.data = data
		this.previousHash = previousHash
		this.hash = this.calculateHash()
		this.nonce = 0
	}

	calculateHash() {
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
	}

	mineBlock(difficulty) {
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
			this.nonce++
			this.hash = this.calculateHash()
		}

		console.log("Block mimed: " + this.hash)
	}
}

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()]
		// 2, 4, 5 => 00XXX, 0000XXX, 00000XXX
		this.difficulty = 2
	}

	createGenesisBlock() {
		return new Block(0, "01/01/2019", "Genesis block", "0")
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1]
	}

	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash
		newBlock.mineBlock(this.difficulty)
		//newBlock.hash = newBlock.calculateHash()
		this.chain.push(newBlock)
	}

	isChainValid() {
		for(let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i]
			const previousBlock = this.chain[i - 1]

			if(currentBlock.hash !== currentBlock.calculateHash()) {
				return false
			}

			if(currentBlock.previousHash !== previousBlock.hash) {
				return false
			}
		}
		
		return true
	}
}

let jibbyCoin = new Blockchain()

console.log('Mining block 1...')
jibbyCoin.addBlock(new Block(1, "30/03/2019", { amount: 10 }))
console.log('Mining block 2...')
jibbyCoin.addBlock(new Block(2, "30/03/2019", { amount: 5 }))


// console.log('Is blockchain valid? ' + jibbyCoin.isChainValid())

// Inject a Chain
// jibbyCoin.chain[1].data = { amount: 100 }
// jibbyCoin.chain[1].hash = jibbyCoin.chain[1].calculateHash()
// console.log('Is blockchain valid? ' + jibbyCoin.isChainValid())

// console.log(JSON.stringify(jibbyCoin, null, 2))

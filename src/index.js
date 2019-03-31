const SHA256 = require('crypto-js/sha256')

class Block {
	constructor(index, timestamp, data, previousHash = '') {
		this.index = index
		this.timestamp = timestamp
		this.data = data
		this.previousHash = previousHash
		this.hash = this.calculateHash()
	}

	calculateHash() {
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString()
	}
}

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()]
	}

	createGenesisBlock() {
		return new Block(0, "01/01/2019", "Genesis block", "0")
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1]
	}

	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash
		newBlock.hash = newBlock.calculateHash()
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
jibbyCoin.addBlock(new Block(1, "30/03/2019", { amount: 10 }))
jibbyCoin.addBlock(new Block(2, "30/03/2019", { amount: 5 }))

console.log('Is blockchain valid? ' + jibbyCoin.isChainValid())

// Inject a Chain
jibbyCoin.chain[1].data = { amount: 100 }
jibbyCoin.chain[1].hash = jibbyCoin.chain[1].calculateHash()
console.log('Is blockchain valid? ' + jibbyCoin.isChainValid())

console.log(JSON.stringify(jibbyCoin, null, 2))

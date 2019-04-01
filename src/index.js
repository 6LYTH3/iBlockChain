const { Blockchain, Transaction } = require('./blockchain')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')

// Private key from KeyGenerator.js
const myKey = ec.keyFromPrivate('55611467bb934da8d8cfb156be546514c1cfee1ace8593c6a483e63c4c1ddacd')
const myWalletAddress = myKey.getPublic('hex')


let jibbyCoin = new Blockchain()
const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10)
tx1.signTransaction(myKey)
jibbyCoin.addTransaction(tx1)


console.log('\nStaring the miner...')
jibbyCoin.minePendingTransactions(myWalletAddress)

console.log('\nBalance of Blythe is ', jibbyCoin.getBalanceOfAddress(myWalletAddress))
console.log('Is chain valid?', jibbyCoin.isChainValid())

console.log(JSON.stringify(jibbyCoin.getAllTransactionForWallet(myKey), null, 2))

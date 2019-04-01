const { Blockchain, Transaction } = require('./blockchain')

let jibbyCoin = new Blockchain()
jibbyCoin.createTransaction(new Transaction('address1', 'address2', 100))
jibbyCoin.createTransaction(new Transaction('address2', 'address1', 50))

console.log('\nStaring the miner...')
jibbyCoin.minePendingTransactions('blythe-address')

console.log('\nBalance of Blythe is ', jibbyCoin.getBalanceOfAddress('blythe-address'))

console.log('\nStaring the miner again...')
jibbyCoin.minePendingTransactions('blythe-address')

console.log('\nBalance of Blythe is ', jibbyCoin.getBalanceOfAddress('blythe-address'))

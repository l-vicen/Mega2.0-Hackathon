const Block = require('./Block')
const fs = require('fs')
const path = require('path')

class Blockchain {
  
  constructor() {
    this.chain = []

    const files = fs.readdirSync(path.join(__dirname, './data'));
    files.forEach(f => 
      this.chain.push(JSON.parse(fs.readFileSync(path.join(__dirname, `./data/${f}`))))
    )
  }

  addBlock(data) {
    const index = this.chain.length
    const prevHash = this.chain.length !== 0 ? this.chain[this.chain.length - 1].hash : 0
    const block = new Block(index, data, prevHash)
    this.chain.push(block)
    block.serialize();
    return block.hash
  }

  chainIsValid() {
    for (let i = 0; i < this.chain.length; i++){
      if(this.chain[i].hash !== this.chain[i].getHash())
        return false
      if(i > 0 && this.chain[i].prevHash !== this.chain[i-1].hash)
        return false
    }
    return true
  }

  get(hash) {
    const block = this.chain.filter(b => b.hash === hash)[0]
    return block ? block.data : null;
  }
}

module.exports = new Blockchain()
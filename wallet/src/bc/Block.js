const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

class Block {
  constructor(index, data, prevHash) {
    this.index = index
    this.timestamp = Math.floor(Date.now() / 1000)
    this.data = data
    this.prevHash = prevHash
    this.hash = this.getHash()
  }

  getHash() {
    const encrypt = JSON.stringify(this.data) + this.prevHash + this.index + this.timestamp
   
    return crypto.createHmac('sha256', "secret")
        .update(encrypt)
        .digest('HEX')
  }

  serialize() {
    fs.writeFileSync(path.join(__dirname, `./data/${this.index}.mcbc`), JSON.stringify(this))
  }
}

module.exports = Block
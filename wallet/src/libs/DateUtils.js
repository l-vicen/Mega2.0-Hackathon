module.exports = {
  isExpired(dateToCompare, lifeTimeInSeconds) {
    const expirationDate = new Date(dateToCompare || "1970-01-01");
    expirationDate.setSeconds(expirationDate.getSeconds() + lifeTimeInSeconds);

    return expirationDate < Date.now();
  }
}
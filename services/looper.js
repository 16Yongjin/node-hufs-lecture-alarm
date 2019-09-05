class Looper {
  constructor(f, interval) {
    this.f = f
    this.loop = setInterval(f, interval)
  }

  setInterval(interval) {
    clearInterval(this.loop)
    this.loop = setInterval(this.f, interval)
  }
}

module.exports = Looper

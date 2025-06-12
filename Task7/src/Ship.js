class Ship {
  constructor(locations, length = 3) {
    this.locations = locations; // Array of coordinate strings like ['00', '01', '02']
    this.hits = new Array(length).fill(false);
    this.length = length;
  }

  hit(location) {
    const index = this.locations.indexOf(location);
    if (index !== -1 && !this.hits[index]) {
      this.hits[index] = true;
      return true;
    }
    return false;
  }

  isSunk() {
    return this.hits.every(hit => hit);
  }

  isHit(location) {
    const index = this.locations.indexOf(location);
    return index !== -1 && this.hits[index];
  }

  hasLocation(location) {
    return this.locations.includes(location);
  }
}

export default Ship; 
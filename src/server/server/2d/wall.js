class Wall {
  constructor(pA, pB) {
    this.pA = pA;
    this.pB = pB;
  }

  check_collision(entity, padding) {
    const entity_fx = entity.x + entity.vx;
    const entity_fy = entity.y + entity.vy;
    padding = padding || 0;


  }
}

module.exports = Wall;

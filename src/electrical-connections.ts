import Blueprint from './';
import Entity from './entity';

export function generateElectricalConnections(bp: Blueprint) {
  const entityData = Blueprint.getEntityData();

  const poles = bp.entities.filter(
    (ent) => 'maxElectricReach' in entityData[ent.name],
  );

  for (const pole of poles) {
    pole.neighbours = [];
  }

  for (const pole of poles) {
    const sortedPotentialNeighbors = poles
      .filter(
        (otherPole) =>
          otherPole.id < pole.id &&
          pole.position.distance(otherPole.position) <=
            Math.min(
              entityData[pole.name].maxElectricReach || 0,
              entityData[otherPole.name].maxElectricReach || 0,
            ),
      )
      .sort((a, b) => {
        const aSqDist = pole.position.distanceSq(a.position);
        const bSqDist = pole.position.distanceSq(b.position);

        if (aSqDist === bSqDist) {
          return a.position.y === b.position.y
            ? a.position.x < b.position.x
              ? -1
              : 1
            : a.position.y < b.position.y
            ? -1
            : 1;
        } else {
          return aSqDist < bSqDist ? -1 : 1;
        }
      });

    const doNotConnectPoles: Entity[] = [];
    for (const neighbor of sortedPotentialNeighbors) {
      if (doNotConnectPoles.includes(neighbor)) {
        continue;
      } else if (pole.neighbours.includes(neighbor)) {
        doNotConnectPoles.push(...neighbor.neighbours);
        continue;
      }

      doNotConnectPoles.push(...neighbor.neighbours);
      pole.neighbours.push(neighbor);
      neighbor.neighbours.push(pole);
    }
  }
}

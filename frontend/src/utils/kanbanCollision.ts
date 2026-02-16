import { rectIntersection, closestCenter, type CollisionDetection } from '@dnd-kit/core';

const isCardId = (id: string | number) => {
    const s = String(id);
    return s.length > 20 && s.includes('-');
};

export const kanbanCollision: CollisionDetection = (args) => {
    const cardContainers = args.droppableContainers.filter(c => isCardId(c.id));
    const columnContainers = args.droppableContainers.filter(c => !isCardId(c.id));

    // Phase 1: pointer actually overlapping a card? → reorder
    if (cardContainers.length > 0) {
        const hits = rectIntersection({ ...args, droppableContainers: cardContainers });
        if (hits.length > 0) return hits;
    }

    // Phase 2: no card overlap → find closest column (handles empty columns + cross-column)
    if (columnContainers.length > 0) {
        const cols = closestCenter({ ...args, droppableContainers: columnContainers });
        if (cols.length > 0) return cols;
    }

    return closestCenter(args);
};

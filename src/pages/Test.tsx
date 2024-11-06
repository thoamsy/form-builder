'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable item component
const SortableItem = ({ id }: { id: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 m-1 bg-gray-100 rounded border border-gray-300 select-none"
    >
      {id}
    </div>
  );
};

// Container component
const Container = ({
  id,
  items,
  activeId,
  overItemId,
}: {
  id: string;
  items: string[];
  activeId: string | null;
  overItemId: string | null;
}) => {
  console.log(items, overItemId, activeId);
  return (
    <div className="border p-4 m-2 w-64 bg-white shadow-md rounded">
      <h2 className="text-lg font-bold mb-2">{id}</h2>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((itemId) => (
          <React.Fragment key={itemId}>
            {overItemId === itemId && id === 'B' && (
              <div className="h-8 my-1 border-2 border-dashed border-blue-500 rounded" />
            )}
            <SortableItem id={itemId} />
          </React.Fragment>
        ))}
        {overItemId === 'bottom' && id === 'B' && (
          <div className="h-8 my-1 border-2 border-dashed border-blue-500 rounded" />
        )}
        {id === 'B' && (
          <DragOverlay>
            {activeId ? (
              <div className="p-2 m-1 bg-blue-100 rounded border border-blue-300 shadow-lg">
                {activeId}
              </div>
            ) : null}
          </DragOverlay>
        )}
      </SortableContext>
    </div>
  );
};

export default function Component() {
  const [containerA, setContainerA] = useState<string[]>([]);
  const [containerB, setContainerB] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overItemId, setOverItemId] = useState<string | null>(null);
  const [isDndInitialized, setIsDndInitialized] = useState(false);

  useEffect(() => {
    setContainerA(['A1', 'A2', 'A3']);
    setContainerB(['B1', 'B2', 'B3']);
    setIsDndInitialized(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = containerA.includes(active.id as string)
      ? 'A'
      : 'B';
    const overContainer = containerB.includes(over.id as string) ? 'B' : 'A';

    if (activeContainer === 'A' && overContainer === 'B') {
      setOverItemId(over.id as string);
    } else {
      setOverItemId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeContainer = containerA.includes(active.id as string)
        ? 'A'
        : 'B';
      const overContainer = containerB.includes(over.id as string) ? 'B' : 'A';

      if (activeContainer === 'A' && overContainer === 'B') {
        // Clone from A to B
        setContainerB((items) => {
          const newItems = [...items];
          const overIndex =
            over.id === 'bottom'
              ? newItems.length
              : newItems.indexOf(over.id as string);
          newItems.splice(
            overIndex,
            0,
            (String(Date.now()) + active.id) as string,
          );
          return newItems;
        });
      } else if (activeContainer === overContainer) {
        // Reorder within the same container
        const setContainer =
          activeContainer === 'A' ? setContainerA : setContainerB;
        setContainer((items) => {
          const oldIndex = items.indexOf(active.id as string);
          const newIndex = items.indexOf(over.id as string);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }

    setActiveId(null);
    setOverItemId(null);
  };

  if (!isDndInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">拖拽示例</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-wrap">
          <Container
            id="A"
            items={containerA}
            activeId={activeId}
            overItemId={null}
          />
          <Container
            id="B"
            items={containerB}
            activeId={activeId}
            overItemId={overItemId}
          />
        </div>
      </DndContext>
    </div>
  );
}

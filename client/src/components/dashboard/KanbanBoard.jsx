import { useState, useMemo } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import JobCard from './JobCard';
import { Plus } from 'lucide-react';

const COLUMNS = [
  { id: 'saved', title: 'Saved', color: 'bg-slate-300' },
  { id: 'applied', title: 'Applied', color: 'bg-[var(--accent-purple)]' },
  { id: 'screening', title: 'Screening', color: 'bg-[var(--accent-blue)]' },
  { id: 'interviewing', title: 'Interviewing', color: 'bg-[var(--accent-yellow)]' },
  { id: 'offer', title: 'Offer', color: 'bg-[var(--accent-green)]' },
  { id: 'rejected', title: 'Rejected', color: 'bg-[var(--accent-red)]' },
];

const KanbanBoard = ({ jobs, updateJobStatus, toggleStar, onAddJob, addToast, onEditJob, onDeleteJob }) => {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = () => {
    // Handling drag over can be used if we want to visually update before drop
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeJobId = active.id;
    const overId = over.id;

    const activeJob = jobs.find((j) => j.id === activeJobId);
    if (!activeJob) return;

    // Check if dropping over a column or another card
    const isOverAColumn = COLUMNS.some((col) => col.id === overId);
    let newStatus = isOverAColumn ? overId : jobs.find((j) => j.id === overId)?.status;

    if (newStatus && newStatus !== activeJob.status) {
      updateJobStatus(activeJob.id, newStatus);
      addToast(`Moved ${activeJob.company} to ${newStatus.toUpperCase()}`, 'success');
    }
  };

  const activeJob = useMemo(() => jobs.find(j => j.id === activeId), [jobs, activeId]);

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart} 
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto h-full kanban-scroll pb-4 min-h-[500px]">
        {COLUMNS.map((col, idx) => (
          <Column 
            key={col.id} 
            col={col} 
            jobs={jobs.filter(j => j.status === col.id)} 
            toggleStar={toggleStar} 
            onAddJob={() => onAddJob(col.id)}
            idx={idx}
            onEditJob={onEditJob}
            onDeleteJob={onDeleteJob}
          />
        ))}
      </div>
      <DragOverlay>
        {activeJob ? <JobCard job={activeJob} toggleStar={() => {}} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};

const Column = ({ col, jobs, toggleStar, onAddJob, idx, onEditJob, onDeleteJob }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: col.id,
    data: { type: 'Column', column: col }
  });

  return (
    <div 
      className={`w-[280px] shrink-0 h-full flex flex-col bg-slate-50 border border-slate-200 rounded-2xl animate-fadeUp transition-all duration-300 ${isOver ? 'border-[var(--accent-purple)] border-dashed bg-slate-50' : ''}`}
      style={{ animationDelay: `${idx * 0.1}s` }}
    >
      {/* Column Header */}
      <div className="p-4 flex justify-between items-center border-b border-slate-200 sticky top-0 bg-[var(--surface)]/95 backdrop-blur z-10 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full shadow-[0_0_2px_currentColor] ${col.color}`} style={{ color: col.color === 'bg-slate-100' ? 'rgba(15,23,42,0.1)': 'inherit'}}></div>
          <h3 className="font-bold text-sm tracking-wide text-slate-900 uppercase">{col.title}</h3>
        </div>
        <div className="bg-slate-100 px-2 py-0.5 rounded-full text-xs font-bold text-slate-500 border border-slate-200">
          {jobs.length}
        </div>
      </div>

      {/* Column Body / Droppable Area */}
      <div 
        ref={setNodeRef} 
        className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto kanban-scroll"
      >
        <SortableContext items={jobs.map(j => j.id)}>
          {jobs.map(job => (
            <JobCard key={job.id} job={job} toggleStar={toggleStar} onEdit={() => onEditJob(job)} onDelete={() => onDeleteJob(job.id)} />
          ))}
        </SortableContext>
        
        {jobs.length === 0 && !isOver && (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30 mt-4 h-24 border-2 border-dashed border-slate-200 rounded-xl">
            <span className="text-xs font-medium uppercase tracking-widest text-slate-500">Drop Here</span>
          </div>
        )}

        {/* Add Button at bottom of column */}
        <button 
          onClick={onAddJob}
          className="mt-2 w-full py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-500 hover:bg-slate-100 hover:border-slate-200 transition-all font-bold text-sm flex items-center justify-center gap-2 group"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform" />
          Add Job
        </button>
      </div>
    </div>
  );
};

export default KanbanBoard;

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Building2, MapPin, DollarSign, Star, Briefcase, Edit2, Trash2 } from 'lucide-react';

const JobCard = ({ job, toggleStar, isOverlay, isList, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: sortableIsDragging } = useSortable({
    id: isOverlay ? `overlay-${job.id}` : job.id,
    data: { ...job },
    disabled: isOverlay || isList
  });

  const isDragging = isOverlay ? true : (isList ? false : sortableIsDragging);

  const style = {
    transform: (isOverlay || isList) ? undefined : CSS.Transform.toString(transform),
    transition: (isOverlay || isList) ? undefined : transition,
    zIndex: isDragging ? 50 : 1,
    opacity: job.status === 'rejected' && (!isOverlay && !isList) ? 0.6 : (isOverlay ? 1 : (isDragging ? 0.5 : 1)),
    scale: isDragging ? 1.05 : 1,
    rotate: isDragging ? '2deg' : '0deg',
  };

  const getWorkTypeColor = (type) => {
    switch(type) {
      case 'Remote': return 'bg-[var(--accent-green)]/10 text-[var(--accent-green)] border-[var(--accent-green)]/20';
      case 'Hybrid': return 'bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)] border-[var(--accent-yellow)]/20';
      case 'On-site': return 'bg-[var(--accent-red)]/10 text-[var(--accent-red)] border-[var(--accent-red)]/20';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div 
      ref={isList ? undefined : setNodeRef} 
      style={style} 
      {...(isList ? {} : attributes)} 
      {...(isList ? {} : listeners)} 
      className={`relative bg-[var(--surface)] p-4 rounded-xl border ${isDragging && !isList ? 'border-[var(--accent-purple)] shadow-[0_0_20px_rgba(124,111,239,0.3)]' : 'border-slate-200 shadow-sm hover:border-slate-200'} transition-colors ${isList ? '' : 'cursor-grab active:cursor-grabbing'} group group/card`}
    >
      {/* Notifications pulse */}
      {job.hasNotif && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-purple)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent-purple)] border-2 border-[var(--surface)]"></span>
        </span>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {/* Logo square */}
          <div className="w-10 h-10 rounded-lg bg-[var(--bg-dashboard)] border border-slate-200 flex items-center justify-center font-bold text-lg text-white shadow-inner group-hover/card:bg-slate-100 transition-colors">
            {job.company.charAt(0)}
          </div>
          <div className="flex flex-col">
            <h4 className="font-bold text-slate-900 text-sm leading-tight group-hover/card:text-[var(--accent-purple)] transition-colors">{job.role}</h4>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
              <Building2 size={10} className="text-slate-500" /> {job.company}
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center -mr-1 z-20">
          <button 
            onPointerDown={(e) => { e.stopPropagation(); onEdit && onEdit(); }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[var(--accent-blue)] transition-all opacity-0 group-hover/card:opacity-100 focus:opacity-100"
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onPointerDown={(e) => { e.stopPropagation(); onDelete && onDelete(); }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[var(--accent-red)] transition-all opacity-0 group-hover/card:opacity-100 focus:opacity-100"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
          <button 
            onPointerDown={(e) => { e.stopPropagation(); toggleStar(job.id); }}
            className={`p-1.5 rounded-full hover:bg-slate-100 transition-colors ${job.starred ? 'text-[var(--accent-yellow)]' : 'text-slate-400 hover:text-slate-500'}`}
          >
            <Star size={14} fill={job.starred ? 'currentColor' : 'none'} className={job.starred ? 'drop-shadow-[0_0_5px_rgba(245,181,63,0.5)]' : ''} />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getWorkTypeColor(job.workType)}`}>
          {job.workType}
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-[var(--accent-blue)]/20 bg-[var(--accent-blue)]/5 text-[var(--accent-blue)]">
          {job.salary}
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-500 flex items-center justify-center">
          <MapPin size={10} className="mr-0.5 text-slate-500" /> {job.location.split(',')[0]}
        </span>
      </div>

      {/* Progress / Footer */}
      <div className="mt-auto pt-3 border-t border-slate-200 flex flex-col gap-2">
        {job.progress && job.status === 'offer' ? (
          <div className="w-full">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
              <span className="text-[var(--accent-green)]">{job.progress.split(' ')[0]}</span>
              <span>{job.progress.split(' ')[1]}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-blue)] rounded-full w-[75%]"></div>
            </div>
          </div>
        ) : (
          <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-100"></div> {job.date}
          </span>
        )}
      </div>
    </div>
  );
};

export default JobCard;

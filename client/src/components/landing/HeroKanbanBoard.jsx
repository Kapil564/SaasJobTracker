import React from 'react';

const Card = ({ title, company, tag, initials, borderColor, delay }) => (
  <div 
    className={`bg-card-bg rounded-lg p-4 shadow-sm border-l-[3px] ${borderColor} mb-3 transform hover:-translate-y-1 hover:-rotate-[0.5deg] transition-all duration-300 animate-fade-up`}
    style={{ animationDelay: delay }}
  >
    <div className="text-[10px] font-mono uppercase text-muted tracking-wider mb-1">{company}</div>
    <div className="font-sans font-medium text-ink text-sm mb-3 leading-tight">{title}</div>
    <div className="flex justify-between items-center">
      <div className="bg-paper border border-border px-2 py-0.5 rounded-full text-[10px] font-medium text-ink/70">
        {tag}
      </div>
      <div className="w-5 h-5 rounded-full bg-cream text-ink text-[9px] font-bold flex items-center justify-center">
        {initials}
      </div>
    </div>
  </div>
);

export default function HeroKanbanBoard() {
  return (
    <div className="grid grid-cols-3 gap-3 p-4 bg-[#ffffff] rounded-xl border border-[rgba(15,23,42,0.08)] shadow-2xl relative z-10 w-full overflow-visible">
      
      {/* Wishlist Column */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center mb-1">
          <span className="font-sans font-medium text-ink text-sm">Wishlist</span>
          <span className="bg-cream text-muted text-xs px-1.5 py-0.5 rounded">2</span>
        </div>
        <Card title="Frontend Developer" company="Stripe" tag="Remote" initials="JS" borderColor="border-muted" delay="100ms" />
        <Card title="Product Designer" company="Linear" tag="San Francisco" initials="AB" borderColor="border-muted" delay="200ms" />
      </div>

      {/* Applied Column */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center mb-1">
          <span className="font-sans font-medium text-ink text-sm">Applied</span>
          <span className="bg-cream text-muted text-xs px-1.5 py-0.5 rounded">3</span>
        </div>
        <Card title="React Engineer" company="Vercel" tag="Remote" initials="MS" borderColor="border-navy" delay="150ms" />
        <Card title="Full Stack Dev" company="Supabase" tag="Singapore" initials="JD" borderColor="border-navy" delay="250ms" />
        <Card title="UI Engineer" company="Figma" tag="London" initials="KL" borderColor="border-navy" delay="350ms" />
      </div>

      {/* Interview Column */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center mb-1">
          <span className="font-sans font-medium text-ink text-sm">Interview</span>
          <span className="bg-cream text-muted text-xs px-1.5 py-0.5 rounded">1+</span>
        </div>
        <div className="bg-card-bg rounded-lg p-4 shadow-sm border-l-[3px] border-gold mb-3 transform hover:-translate-y-1 transition-all duration-300 animate-fade-up" style={{ animationDelay: '300ms' }}>
          <div className="text-[10px] font-mono uppercase text-muted tracking-wider mb-1">Airbnb</div>
          <div className="font-sans font-medium text-ink text-sm mb-3">Senior Frontend Eng</div>
          
          {/* Progress Bar Card inner */}
          <div className="mt-2 mb-3">
            <div className="flex justify-between text-[10px] font-sans text-muted mb-1">
              <span>Stage 3 of 4</span>
              <span className="text-gold font-medium">Technical</span>
            </div>
            <div className="w-full h-1.5 bg-paper rounded-full overflow-hidden flex gap-0.5">
              <div className="h-full bg-gold w-1/4 rounded-full"></div>
              <div className="h-full bg-gold w-1/4 rounded-full"></div>
              <div className="h-full bg-gold w-1/4 rounded-full"></div>
              <div className="h-full bg-paper w-1/4 rounded-full border border-border"></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="bg-cream border border-gold/20 text-gold px-2 py-0.5 rounded-full text-[10px] font-medium">Next: System Design</div>
          </div>
        </div>

        {/* Offer Mini Section */}
        <div className="mt-2 pt-2 border-t border-border border-dashed">
          <div className="flex justify-between items-center mb-2">
            <span className="font-sans font-medium text-green text-sm">Offer</span>
            <span className="bg-green/10 text-green font-medium text-xs px-1.5 py-0.5 rounded">1</span>
          </div>
          <Card title="Software Engineer" company="Discord" tag="$140k + Equity" initials="PK" borderColor="border-green" delay="400ms" />
        </div>
      </div>
      
    </div>
  );
}

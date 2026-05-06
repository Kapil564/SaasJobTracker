import React, { useEffect, useRef, useState } from 'react';

const stepsData = [
  { title: "Save the job", desc: "Paste a URL and drop it straight into your Kanban setup." },
  { title: "Update stages", desc: "Drag cards forward to automatically trigger analytics updates." },
  { title: "Prep effortlessly", desc: "Keep all your interview notes contextually tied to the role." },
  { title: "Land the offer", desc: "Ace your negotiations fully equipped with your data." }
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const timeoutIds = useRef([]);
  
  const headingText = "How it actually works";
  
  const [hasTriggered, setHasTriggered] = useState(false);
  
  // Animation states
  const [labelVisible, setLabelVisible] = useState(false);
  const [typedHeading, setTypedHeading] = useState("");
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  
  const [activeSteps, setActiveSteps] = useState({});
  const [counters, setCounters] = useState({});

  const clearAllTimeouts = () => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
  };

  useEffect(() => {
    return clearAllTimeouts;
  }, []);

  const runSequence = () => {
    // Reset state
    clearAllTimeouts();
    setLabelVisible(false);
    setTypedHeading("");
    setSubtitleVisible(false);
    setActiveSteps({});
    setCounters({});
    
    // Start timing sequence
    const schedule = (delay, callback) => {
      const id = setTimeout(callback, delay);
      timeoutIds.current.push(id);
    };

    // 1. Label fades in
    schedule(100, () => setLabelVisible(true));
    
    // 2. Typewriter effect
    const typeStart = 400;
    const charDelay = 46;
    for (let i = 0; i <= headingText.length; i++) {
      schedule(typeStart + (i * charDelay), () => {
        setTypedHeading(headingText.substring(0, i));
      });
    }
    
    const subtitleStart = typeStart + (headingText.length * charDelay) + 200;
    // 3. Subtitle fades up
    schedule(subtitleStart, () => setSubtitleVisible(true));
    
    // 4. Steps sequential reveal
    const stepStart = subtitleStart + 400;
    const stepDelay = 480;
    
    stepsData.forEach((_, index) => {
      const currentStepTime = stepStart + (index * stepDelay);
      
      schedule(currentStepTime, () => {
        setActiveSteps(prev => ({ ...prev, [index]: true }));
      });
      
      // 5. Counters from 0 to index+1
      const countDuration = 400;
      const countSteps = 10;
      const targetNumber = index + 1;
      
      for(let step = 0; step <= countSteps; step++) {
        const timeOffset = currentStepTime + (step * (countDuration / countSteps));
        const currentVal = Math.round((step / countSteps) * targetNumber);
        schedule(timeOffset, () => {
          setCounters(prev => ({ ...prev, [index]: currentVal }));
        });
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasTriggered) {
        setHasTriggered(true);
        runSequence();
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.2 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [hasTriggered]);


  return (
    <section ref={sectionRef} id="how" className="py-12 md:py-16 bg-[#0B1225] text-white relative overflow-hidden font-sans">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <div className={`text-[#5B6BE8] text-sm font-bold uppercase tracking-widest mb-4 transition-all duration-700 ease-out transform ${labelVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Process
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 min-h-[1.2em]">
            {typedHeading}<span className="animate-pulse border-r-2 border-[#5B6BE8] ml-1"></span>
          </h2>
          <p className={`text-[#7880A0] text-lg max-w-2xl mx-auto transition-all duration-700 ease-out transform ${subtitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Tracking jobs doesn't have to be a mess of spreadsheets. We've streamlined the entire workflow into four simple steps.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 md:pl-10">
          
          {stepsData.map((step, index) => {
            const isActive = activeSteps[index];
            const isLast = index === stepsData.length - 1;
            const slideClass = index % 2 === 0 ? '-translate-x-8' : 'translate-x-8';
            const count = counters[index] !== undefined ? counters[index] : 0;
            
            return (
              <div key={index} className="relative pb-10 md:pb-12 last:pb-0">
                
                {/* Line segment to next dot */}
                {!isLast && (
                  <div className="absolute left-[11px] md:left-[19px] top-10 bottom-0 w-[2px] bg-[#1A2250] overflow-hidden">
                    <div 
                      className={`w-full bg-[#5B6BE8] transition-all duration-[600ms] ease-out origin-top ${isActive ? 'h-full' : 'h-0'}`}
                    />
                  </div>
                )}
                
                {/* Dot Node */}
                <div 
                  className={`absolute left-0 top-0 w-6 h-6 md:w-10 md:h-10 rounded-full border-2 bg-[#1A2250] border-[#8A9CF0] flex items-center justify-center transition-all duration-500 shadow-[0_0_15px_rgba(91,107,232,0.3)] ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                  style={{
                    transitionTimingFunction: isActive ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'ease-out'
                  }}
                >
                  <span className="text-[#8A9CF0] text-xs md:text-sm font-bold">{count}</span>
                </div>
                
                {/* Step Card */}
                <div 
                  className={`ml-10 md:ml-16 bg-[#1A2250]/40 backdrop-blur-sm border border-[#5B6BE8]/20 rounded-2xl p-6 md:p-8 transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${slideClass} translate-y-4`}`}
                >
                  <h3 className="text-xl md:text-2xl font-serif font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#6A7899] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        

      </div>
    </section>
  );
}

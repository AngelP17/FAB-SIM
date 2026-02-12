import { useState } from 'react';
import { FileText, CheckCircle, ChevronRight, Hash, Shield, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';

interface EntityHighlight {
  text: string;
  type: 'material' | 'quantity' | 'location' | 'date' | 'value';
  start: number;
  end: number;
}

const MOCK_EMAIL_TEXT = `Subject: Material Loss Incident Report - Factory B

Hi Team,

We experienced a material loss incident yesterday at our Taiwan facility (Building 3).

During the morning shift, we discovered that approximately 2,500 units of semiconductor wafers (Grade A, 300mm) were damaged due to a cooling system malfunction. The estimated value of the loss is $127,500.

The incident occurred on January 15, 2026 at approximately 08:30 local time. Production line B-7 was affected.

We have secured the remaining inventory and initiated our standard loss reporting procedure. Please process this for duty recovery purposes.

Best regards,
Sarah Chen
Operations Manager`;

const MOCK_ENTITIES: EntityHighlight[] = [
  { text: 'Taiwan facility', type: 'location', start: 115, end: 130 },
  { text: '2,500 units', type: 'quantity', start: 210, end: 221 },
  { text: 'semiconductor wafers', type: 'material', start: 225, end: 245 },
  { text: '$127,500', type: 'value', start: 345, end: 353 },
  { text: 'January 15, 2026', type: 'date', start: 392, end: 408 },
];

const MOCK_EXTRACTED_EVENT = {
  materialType: 'Semiconductor Wafers (Grade A, 300mm)',
  quantity: 2500,
  unitValue: 51.00,
  totalValue: 127500,
  location: 'Taiwan - Building 3',
  incidentDate: '2026-01-15T08:30:00Z',
  productionLine: 'B-7',
  cause: 'Cooling system malfunction',
};

const ENTITY_COLORS: Record<string, string> = {
  material: 'bg-neutral-700/50 border-neutral-500/50 text-neutral-200',
  quantity: 'bg-neutral-700/50 border-neutral-500/50 text-neutral-200',
  location: 'bg-neutral-700/50 border-neutral-500/50 text-neutral-200',
  date: 'bg-neutral-700/50 border-neutral-500/50 text-neutral-200',
  value: 'bg-neutral-700/50 border-neutral-500/50 text-neutral-200',
};

export function LangExtractDemo() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [highlightedEntities, setHighlightedEntities] = useState<number[]>([]);
  
  const { displayText: hashText, startTyping: startHashTyping, reset: resetHash } = useTypingAnimation({
    text: '0x4d8e...a127',
    speed: 50,
    delay: 1500
  });

  const handleRunExtraction = () => {
    setIsProcessing(true);
    setShowResults(false);
    setHighlightedEntities([]);
    resetHash();

    // Highlight entities one by one
    MOCK_ENTITIES.forEach((_, index) => {
      setTimeout(() => {
        setHighlightedEntities(prev => [...prev, index]);
      }, 500 + index * 400);
    });

    // Complete after 3 seconds
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
      startHashTyping();
    }, 3000);
  };

  const renderHighlightedText = () => {
    let lastEnd = 0;
    const elements: React.ReactElement[] = [];

    // Sort entities by start position
    const sortedEntities = [...MOCK_ENTITIES].sort((a, b) => a.start - b.start);

    sortedEntities.forEach((entity, idx) => {
      // Add text before this entity
      if (entity.start > lastEnd) {
        elements.push(
          <span key={`text-${idx}`} className="text-neutral-300">
            {MOCK_EMAIL_TEXT.slice(lastEnd, entity.start)}
          </span>
        );
      }

      // Add highlighted entity
      const isHighlighted = highlightedEntities.includes(idx);
      elements.push(
        <span
          key={`entity-${idx}`}
          className={cn(
            "px-1 py-0.5 rounded border transition-all duration-300",
            ENTITY_COLORS[entity.type],
            isHighlighted ? "opacity-100 scale-100" : "opacity-40 scale-95"
          )}
        >
          {entity.text}
        </span>
      );

      lastEnd = entity.end;
    });

    // Add remaining text
    if (lastEnd < MOCK_EMAIL_TEXT.length) {
      elements.push(
        <span key="text-end" className="text-neutral-300">
          {MOCK_EMAIL_TEXT.slice(lastEnd)}
        </span>
      );
    }

    return elements;
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 h-full">
      {/* Left: Text Input */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-neutral-800/50 border-b border-neutral-700 flex items-center gap-3">
          <FileText className="w-4 h-4 text-neutral-400" />
          <span className="text-xs font-mono text-neutral-300">incident_report.txt</span>
          <span className="ml-auto text-[10px] text-neutral-500">892 B</span>
        </div>
        
        <div className="p-4">
          <div className="bg-neutral-950 rounded-lg p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {isProcessing || showResults ? renderHighlightedText() : (
              <span className="text-neutral-300">{MOCK_EMAIL_TEXT}</span>
            )}
          </div>
          
          {/* Entity Legend */}
          {(isProcessing || showResults) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(ENTITY_COLORS).map(([type, colorClass]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div className={cn("w-2 h-2 rounded", colorClass.split(' ')[0])} />
                  <span className="text-[10px] text-neutral-400 capitalize">{type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Extraction Results */}
      <div className="flex flex-col gap-4">
        {/* Pipeline Badge */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 px-1">
          <span className="text-neutral-400">Text</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-300">NER</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-300">Schema Map</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-300">Hash</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">Seal</span>
        </div>

        {/* Run Button or Results */}
        {!showResults ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-neutral-900/30 border border-neutral-800 rounded-lg p-8">
            {isProcessing ? (
              <>
                <div className="relative">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                  <div className="absolute -inset-2 bg-white/20 rounded-full animate-ping" />
                </div>
                <span className="text-xs text-neutral-400">Running NER extraction...</span>
                <div className="flex gap-1">
                  {MOCK_ENTITIES.map((entity, i) => (
                    <div
                      key={i}
                      className={cn(
                        "px-2 py-1 rounded text-[10px] font-mono transition-all duration-300",
                        highlightedEntities.includes(i)
                          ? "bg-white/10 text-white border border-white/20"
                          : "bg-neutral-800 text-neutral-600"
                      )}
                    >
                      {entity.type}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <button
                onClick={handleRunExtraction}
                className="group flex items-center gap-2 px-6 py-3 bg-white hover:bg-neutral-100 text-black text-sm font-medium rounded-lg transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Run LangExtract
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-neutral-800/50 border-b border-neutral-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-xs font-mono text-neutral-300">NER Extraction Complete</span>
              <span className="ml-auto text-[10px] text-neutral-500">3.2s</span>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Extracted Entities */}
              <div>
                <span className="text-[10px] text-neutral-500 uppercase mb-2 block">Extracted Entities</span>
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_ENTITIES.map((entity, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "p-2 rounded border",
                        ENTITY_COLORS[entity.type]
                      )}
                    >
                      <span className="text-[9px] uppercase opacity-70">{entity.type}</span>
                      <p className="text-xs font-medium">{entity.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* MaterialLossEvent Output */}
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-3.5 h-3.5 text-white" />
                  <span className="text-[10px] font-mono text-white uppercase">MaterialLossEvent Generated</span>
                </div>
                <pre className="text-[11px] font-mono text-neutral-300 overflow-x-auto">
{JSON.stringify(MOCK_EXTRACTED_EVENT, null, 2)}
                </pre>
              </div>

              {/* Hash Badge */}
              <div className="flex items-center gap-3 p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                <Hash className="w-4 h-4 text-neutral-500" />
                <div className="flex-1">
                  <span className="text-[10px] text-neutral-500 uppercase">Event Hash</span>
                  <p className="text-sm font-mono text-white">{hashText}</p>
                </div>
                <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] rounded border border-white/20">
                  SEALED
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

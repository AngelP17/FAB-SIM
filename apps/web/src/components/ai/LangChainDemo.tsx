import { useState } from 'react';
import { Loader2, CheckCircle, FileText, Cpu, Shield, Hash, Database, ArrowRight, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMultiLineTyping } from '@/hooks/useTypingAnimation';

interface PipelineNode {
  id: string;
  label: string;
  icon: React.ElementType;
  status: 'pending' | 'active' | 'complete';
  description: string;
}

const PIPELINE_STEPS: PipelineNode[] = [
  { id: 'loader', label: 'Document Loader', icon: FileText, status: 'pending', description: 'Loading document from source...' },
  { id: 'extraction', label: 'Extraction Chain', icon: Cpu, status: 'pending', description: 'Running extraction pipeline...' },
  { id: 'validation', label: 'Validation Agent', icon: Shield, status: 'pending', description: 'Validating extracted data...' },
  { id: 'schema', label: 'Schema Inference', icon: Database, status: 'pending', description: 'Mapping to schema...' },
  { id: 'seal', label: 'Hash & Seal', icon: Hash, status: 'pending', description: 'Generating cryptographic proof...' },
];

const AGENT_LOGS = [
  "Initializing LangChain pipeline...",
  "Loading document from S3 bucket...",
  "Detected format: PDF (scanned)",
  "Running OCR extraction...",
  "Extracted 5 key entities",
  "Running confidence validation...",
  "All entities above threshold (0.90)",
  "Mapping to MaterialLossEvent schema...",
  "Schema validation passed",
  "Computing SHA-256 hash...",
  "Merkle root updated",
  "Event sealed to ledger",
  "✓ Pipeline complete - 2.8s"
];

export function LangChainDemo() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const { displayLines, isTyping, startTyping, reset } = useMultiLineTyping({
    lines: AGENT_LOGS,
    speed: 25,
    lineDelay: 300
  });

  const handleRunPipeline = () => {
    setIsProcessing(true);
    setShowResults(false);
    setActiveStep(0);
    setCompletedSteps([]);
    reset();

    // Animate through pipeline steps
    PIPELINE_STEPS.forEach((_, index) => {
      // Activate step
      setTimeout(() => {
        setActiveStep(index);
      }, index * 600);

      // Complete step
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, index]);
      }, index * 600 + 400);
    });

    // Start agent logs
    setTimeout(() => {
      startTyping();
    }, 500);

    // Complete after 4 seconds
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
    }, 4000);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Pipeline Visualization */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-white">LangChain Orchestration Pipeline</h3>
          {!isProcessing && !showResults && (
            <button
              onClick={handleRunPipeline}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-100 text-black text-xs font-medium rounded-lg transition-all"
            >
              <Cpu className="w-3.5 h-3.5" />
              Run Pipeline
            </button>
          )}
          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Processing...
            </div>
          )}
          {showResults && (
            <div className="flex items-center gap-2 text-xs text-white">
              <CheckCircle className="w-3.5 h-3.5" />
              Complete
            </div>
          )}
        </div>

        {/* Pipeline Nodes */}
        <div className="flex items-center gap-2">
          {PIPELINE_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index && isProcessing;
            const isComplete = completedSteps.includes(index) || showResults;
            const isPending = !isActive && !isComplete;

            return (
              <div key={step.id} className="flex-1 flex items-center">
                <div 
                  className={cn(
                    "flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-500",
                    isActive && "bg-white/10 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
                    isComplete && "bg-white/5 border-white/20",
                    isPending && "bg-neutral-800/30 border-neutral-700"
                  )}
                >
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
                      isActive && "bg-white text-black animate-pulse",
                      isComplete && "bg-white/20 text-white",
                      isPending && "bg-neutral-700 text-neutral-500"
                    )}
                  >
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span 
                    className={cn(
                      "text-[10px] font-medium text-center",
                      isActive && "text-white",
                      isComplete && "text-white",
                      isPending && "text-neutral-500"
                    )}
                  >
                    {step.label}
                  </span>
                  
                  {/* Connection Arrow */}
                  {index < PIPELINE_STEPS.length - 1 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                      <ArrowRight 
                        className={cn(
                          "w-4 h-4 transition-colors duration-300",
                          isComplete ? "text-white" : "text-neutral-700"
                        )} 
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agent Log & Output */}
      <div className="flex-1 grid lg:grid-cols-2 gap-4">
        {/* Agent Log */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-neutral-500" />
            <span className="text-xs font-mono text-neutral-400">Agent Log</span>
          </div>
          <div className="p-4 font-mono text-xs space-y-1 h-48 overflow-y-auto">
            {(isProcessing || showResults) ? (
              displayLines.map((line, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-neutral-600">[{String(i + 1).padStart(2, '0')}]</span>
                  <span 
                    className={cn(
                      "text-neutral-300",
                      line.includes('✓') && "text-white",
                      line.includes('Error') && "text-neutral-500"
                    )}
                  >
                    {line}
                    {i === displayLines.length - 1 && isTyping && (
                      <span className="inline-block w-2 h-4 bg-white ml-0.5 animate-pulse" />
                    )}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-600">
                <span>Click "Run Pipeline" to start</span>
              </div>
            )}
          </div>
        </div>

        {/* Output Preview */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-neutral-800/50 border-b border-neutral-700 flex items-center gap-2">
            <Database className="w-4 h-4 text-neutral-500" />
            <span className="text-xs font-mono text-neutral-400">Output Preview</span>
          </div>
          <div className="p-4">
            {!showResults ? (
              <div className="flex items-center justify-center h-48 text-neutral-600">
                <span className="text-sm">Pipeline output will appear here</span>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Success Badge */}
                <div className="flex items-center gap-2 p-2 bg-white/10 border border-white/20 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-xs text-white">Pipeline completed successfully</span>
                  <span className="ml-auto text-[10px] text-neutral-500">2.8s</span>
                </div>

                {/* Generated Event */}
                <div className="p-3 bg-neutral-950 rounded border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase mb-2 block">Generated Event</span>
                  <pre className="text-[11px] font-mono text-neutral-300">
{`{
  "eventType": "MATERIAL_LOSS",
  "materialType": "Semiconductor Wafers",
  "quantity": 2500,
  "unitValue": 51.00,
  "location": "Taiwan-B3",
  "extractionSource": "PDF/OCR",
  "confidence": 0.96,
  "hash": "0x8f2a...b847",
  "merkleRoot": "0x3d9e...c251",
  "status": "SEALED"
}`}
                  </pre>
                </div>

                {/* Pipeline Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-neutral-950 rounded border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-500">Entities</span>
                    <p className="text-lg font-mono text-white">5</p>
                  </div>
                  <div className="p-2 bg-neutral-950 rounded border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-500">Avg Confidence</span>
                    <p className="text-lg font-mono text-white">96%</p>
                  </div>
                  <div className="p-2 bg-neutral-950 rounded border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-500">Latency</span>
                    <p className="text-lg font-mono text-white">2.8s</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

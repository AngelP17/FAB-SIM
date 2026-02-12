import { useState } from 'react';
import { FileText, Loader2, CheckCircle, ChevronRight, Hash, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';

interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
}

const MOCK_PDF_CONTENT = {
  title: 'Customs Declaration Form',
  fields: [
    { label: 'HS Code', value: '8471.30.01', confidence: 0.98 },
    { label: 'Material Type', value: 'Computer Parts (CPU)', confidence: 0.95 },
    { label: 'Quantity', value: '1,250 units', confidence: 0.97 },
    { label: 'Unit Value', value: '$45.00', confidence: 0.99 },
    { label: 'Country of Origin', value: 'Taiwan', confidence: 0.96 },
    { label: 'Import Duty Rate', value: '2.5%', confidence: 0.94 },
  ] as ExtractedField[],
  materialLossEvent: {
    materialType: 'Computer Parts (CPU)',
    quantity: 1250,
    unitValue: 45.00,
    totalValue: 56250.00,
    hsCode: '8471.30.01',
    origin: 'TW',
  }
};

export function PdfExtractDemo() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const { displayText: hashText, startTyping: startHashTyping, reset: resetHash } = useTypingAnimation({
    text: '0x7a3f...e291',
    speed: 50,
    delay: 2000
  });

  const handleRunExtraction = () => {
    setIsProcessing(true);
    setShowResults(false);
    setProgress(0);
    resetHash();

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4;
      });
    }, 100);

    // Complete after 2.5 seconds
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
      startHashTyping();
    }, 2500);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 h-full">
      {/* Left: PDF Preview */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-neutral-800/50 border-b border-neutral-700 flex items-center gap-3">
          <FileText className="w-4 h-4 text-neutral-400" />
          <span className="text-xs font-mono text-neutral-300">customs_declaration_001.pdf</span>
          <span className="ml-auto text-[10px] text-neutral-500">2.3 MB</span>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Mock PDF Content */}
          <div className="bg-white rounded-sm p-6 shadow-lg text-neutral-800">
            <div className="border-b-2 border-neutral-800 pb-4 mb-4">
              <h3 className="text-lg font-bold uppercase tracking-wider">Customs Declaration</h3>
              <p className="text-xs text-neutral-600 mt-1">Form C-120 • Entry No. 47832</p>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-neutral-500 uppercase">HS Code</span>
                  <p className="font-mono">8471.30.01</p>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase">Origin</span>
                  <p>Taiwan</p>
                </div>
              </div>
              
              <div>
                <span className="text-xs text-neutral-500 uppercase">Description</span>
                <p>Computer Processing Units (CPU) - Electronic Components</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-neutral-500 uppercase">Qty</span>
                  <p className="font-mono">1,250</p>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase">Unit Value</span>
                  <p className="font-mono">$45.00</p>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase">Duty Rate</span>
                  <p className="font-mono">2.5%</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-neutral-300">
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-500">Authorized Signature</span>
                <div className="w-32 h-8 border-b border-neutral-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Extraction Results */}
      <div className="flex flex-col gap-4">
        {/* Pipeline Badge */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 px-1">
          <span className="text-neutral-400">PDF</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-300">LangExtract</span>
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
                <Loader2 className="w-8 h-8 text-white animate-spin" />
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs text-neutral-400 mb-2">
                    <span>Extracting fields...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={handleRunExtraction}
                className="group flex items-center gap-2 px-6 py-3 bg-white hover:bg-neutral-100 text-black text-sm font-medium rounded-lg transition-all"
              >
                <FileText className="w-4 h-4" />
                Run Extraction
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-neutral-800/50 border-b border-neutral-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-xs font-mono text-neutral-300">Extraction Complete</span>
              <span className="ml-auto text-[10px] text-neutral-500">2.4s</span>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Extracted Fields */}
              <div className="space-y-2">
                {MOCK_PDF_CONTENT.fields.map((field, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between p-2 bg-neutral-950 rounded border border-neutral-800"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase">{field.label}</span>
                      <p className="text-sm font-mono text-white">{field.value}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        field.confidence > 0.95 ? "bg-white" : "bg-neutral-500"
                      )} />
                      <span className="text-[10px] text-neutral-500">{(field.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* MaterialLossEvent Output */}
              <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-3.5 h-3.5 text-white" />
                  <span className="text-[10px] font-mono text-white uppercase">MaterialLossEvent Generated</span>
                </div>
                <pre className="text-[11px] font-mono text-neutral-300 overflow-x-auto">
{JSON.stringify(MOCK_PDF_CONTENT.materialLossEvent, null, 2)}
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

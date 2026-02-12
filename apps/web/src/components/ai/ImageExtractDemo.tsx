import { useState, useEffect } from 'react';
import { Image, CheckCircle, ChevronRight, ScanLine, Hash, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';

interface OcrResult {
  text: string;
  confidence: number;
  bbox: { x: number; y: number; w: number; h: number };
}

const MOCK_IMAGE_RESULTS: OcrResult[] = [
  { text: 'LOT: A-2847', confidence: 0.98, bbox: { x: 20, y: 30, w: 120, h: 25 } },
  { text: 'QTY: 500 units', confidence: 0.96, bbox: { x: 20, y: 70, w: 140, h: 25 } },
  { text: 'MAT: Copper Wire', confidence: 0.94, bbox: { x: 20, y: 110, w: 160, h: 25 } },
  { text: 'SN: 8X-992-774', confidence: 0.97, bbox: { x: 20, y: 150, w: 150, h: 25 } },
];

const MOCK_EXTRACTED_DATA = {
  lotId: 'A-2847',
  quantity: 500,
  materialType: 'Copper Wire',
  serialNumber: '8X-992-774',
  eventHash: '0x9b2c...f847',
};

export function ImageExtractDemo() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scanPosition, setScanPosition] = useState(0);
  const [revealedEntities, setRevealedEntities] = useState<number[]>([]);
  
  const { displayText: hashText, startTyping: startHashTyping, reset: resetHash } = useTypingAnimation({
    text: MOCK_EXTRACTED_DATA.eventHash,
    speed: 50,
    delay: 1500
  });

  useEffect(() => {
    if (!isProcessing) {
      setScanPosition(0);
      return;
    }

    // Animate scan line
    const scanInterval = setInterval(() => {
      setScanPosition(prev => {
        if (prev >= 100) {
          clearInterval(scanInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(scanInterval);
  }, [isProcessing]);

  const handleRunExtraction = () => {
    setIsProcessing(true);
    setShowResults(false);
    setRevealedEntities([]);
    resetHash();

    // Reveal entities one by one during scan
    MOCK_IMAGE_RESULTS.forEach((_, index) => {
      setTimeout(() => {
        setRevealedEntities(prev => [...prev, index]);
      }, 600 + index * 300);
    });

    // Complete after 3 seconds
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
      startHashTyping();
    }, 3000);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 h-full">
      {/* Left: Image Preview */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-neutral-800/50 border-b border-neutral-700 flex items-center gap-3">
          <Image className="w-4 h-4 text-neutral-400" />
          <span className="text-xs font-mono text-neutral-300">inventory_label_2847.jpg</span>
          <span className="ml-auto text-[10px] text-neutral-500">1.8 MB</span>
        </div>
        
        <div className="p-6 relative">
          {/* Mock Inventory Label */}
          <div className="relative bg-gradient-to-br from-neutral-100 to-white rounded-lg p-6 shadow-lg max-w-sm mx-auto">
            {/* Barcode */}
            <div className="flex justify-center mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div 
                    key={i}
                    className="bg-neutral-800"
                    style={{ 
                      width: Math.random() > 0.5 ? '3px' : '1px',
                      height: '40px'
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Label Content */}
            <div className="space-y-3 font-mono text-neutral-800">
              <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                <span className="text-xs text-neutral-600">LOT NUMBER</span>
                <span className="text-lg font-bold">A-2847</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-neutral-600 block">QUANTITY</span>
                  <span className="text-sm font-semibold">500 units</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-600 block">MATERIAL</span>
                  <span className="text-sm font-semibold">Copper Wire</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-neutral-200">
                <span className="text-[10px] text-neutral-600 block">SERIAL NO</span>
                <span className="text-sm">8X-992-774</span>
              </div>
            </div>
            
            {/* Scan Line Effect */}
            {isProcessing && (
              <div 
                className="absolute left-0 right-0 h-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10"
                style={{ top: `${scanPosition}%` }}
              >
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse" />
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            )}
            
            {/* Highlight Boxes for Detected Text */}
            {isProcessing && revealedEntities.map((idx) => {
              const result = MOCK_IMAGE_RESULTS[idx];
              return (
                <div
                  key={idx}
                  className="absolute border-2 border-white bg-white/20 rounded animate-pulse"
                  style={{
                    left: `${result.bbox.x}px`,
                    top: `${result.bbox.y}px`,
                    width: `${result.bbox.w}px`,
                    height: `${result.bbox.h}px`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: OCR Results */}
      <div className="flex flex-col gap-4">
        {/* Pipeline Badge */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 px-1">
          <span className="text-neutral-400">Image</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-300">OCR</span>
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
                <div className="relative">
                  <ScanLine className="w-8 h-8 text-white" />
                  <div className="absolute inset-0 animate-ping">
                    <ScanLine className="w-8 h-8 text-white/50" />
                  </div>
                </div>
                <span className="text-xs text-neutral-400 animate-pulse">Scanning image...</span>
                
                {/* Live entity detection */}
                <div className="w-full max-w-xs space-y-1">
                  {revealedEntities.map((idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2 text-xs p-1.5 bg-white/5 border border-white/10 rounded"
                    >
                      <CheckCircle className="w-3 h-3 text-white" />
                      <span className="text-neutral-300">{MOCK_IMAGE_RESULTS[idx].text}</span>
                      <span className="ml-auto text-[10px] text-neutral-500">
                        {(MOCK_IMAGE_RESULTS[idx].confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <button
                onClick={handleRunExtraction}
                className="group flex items-center gap-2 px-6 py-3 bg-white hover:bg-neutral-100 text-black text-sm font-medium rounded-lg transition-all"
              >
                <ScanLine className="w-4 h-4" />
                Run OCR Extraction
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-neutral-800/50 border-b border-neutral-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-xs font-mono text-neutral-300">OCR Complete</span>
              <span className="ml-auto text-[10px] text-neutral-500">3.1s</span>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Detected Entities */}
              <div>
                <span className="text-[10px] text-neutral-500 uppercase mb-2 block">Detected Entities</span>
                <div className="space-y-2">
                  {MOCK_IMAGE_RESULTS.map((result, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between p-2 bg-neutral-950 rounded border border-neutral-800"
                    >
                      <span className="text-sm font-mono text-white">{result.text}</span>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-16 h-1.5 rounded-full overflow-hidden",
                          result.confidence > 0.95 ? "bg-neutral-800" : "bg-neutral-800"
                        )}>
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              result.confidence > 0.95 ? "bg-white" : "bg-neutral-500"
                            )}
                            style={{ width: `${result.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-neutral-500 w-8 text-right">
                          {(result.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
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
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-1.5 bg-neutral-950 rounded">
                    <span className="text-neutral-500">lotId:</span>
                    <span className="text-white ml-2">"{MOCK_EXTRACTED_DATA.lotId}"</span>
                  </div>
                  <div className="p-1.5 bg-neutral-950 rounded">
                    <span className="text-neutral-500">quantity:</span>
                    <span className="text-white ml-2">{MOCK_EXTRACTED_DATA.quantity}</span>
                  </div>
                  <div className="p-1.5 bg-neutral-950 rounded col-span-2">
                    <span className="text-neutral-500">materialType:</span>
                    <span className="text-white ml-2">"{MOCK_EXTRACTED_DATA.materialType}"</span>
                  </div>
                </div>
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

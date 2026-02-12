import { useState } from 'react';
import { ArrowLeft, FileText, Image, Sparkles, Cpu, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PdfExtractDemo } from '@/components/ai/PdfExtractDemo';
import { ImageExtractDemo } from '@/components/ai/ImageExtractDemo';
import { LangExtractDemo } from '@/components/ai/LangExtractDemo';
import { LangChainDemo } from '@/components/ai/LangChainDemo';

type TabId = 'pdf' | 'image' | 'langextract' | 'langchain';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
  description: string;
}

const TABS: Tab[] = [
  { id: 'pdf', label: 'PDF Extract', icon: FileText, description: 'Extract structured data from PDF documents' },
  { id: 'image', label: 'Image Extract', icon: Image, description: 'OCR and entity extraction from images' },
  { id: 'langextract', label: 'LangExtract', icon: Sparkles, description: 'NER and text extraction' },
  { id: 'langchain', label: 'LangChain', icon: Cpu, description: 'End-to-end orchestration pipeline' },
];

export default function AiDemoPage() {
  const [activeTab, setActiveTab] = useState<TabId>('pdf');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeTabData = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="relative min-h-screen tradeos-atmo text-neutral-400 font-sans">
      <div className="pointer-events-none absolute inset-0 tradeos-atmo-grid opacity-15" />
      <div className="relative z-10">
      {/* Header */}
      <header className="border-b border-neutral-900">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <a href="/#/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-mono text-sm font-bold text-white tracking-wide">
                  TRADEOS<span className="text-neutral-500">::</span>AI
                </h1>
                <p className="text-[10px] text-neutral-600 font-mono">AI Customs Agent Service Layer</p>
              </div>
            </a>
          </div>

          {/* Desktop Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-950 rounded-lg p-1 border border-neutral-900">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-2 rounded-md text-[11px] font-mono transition-all flex items-center gap-2",
                    activeTab === tab.id
                      ? "bg-neutral-800 text-white border border-neutral-700"
                      : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Back button */}
          <a 
            href="/#/"
            className="hidden md:flex px-3 py-2 rounded-md text-[11px] font-mono text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors items-center gap-2 border border-neutral-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </a>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded text-[11px] font-mono bg-neutral-900 text-white border border-neutral-800"
            >
              {(() => {
                const Icon = activeTabData.icon;
                return <Icon className="w-3.5 h-3.5" />;
              })()}
              {activeTabData.label}
              <ChevronDown className={cn("w-3 h-3 transition-transform", mobileMenuOpen && "rotate-180")} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-neutral-900 px-4 py-2 space-y-1 bg-neutral-950">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 rounded text-[11px] font-mono transition-colors flex items-center gap-2",
                    activeTab === tab.id
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-500"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
            <a
              href="/#/"
              className="w-full px-3 py-2 rounded text-[11px] font-mono text-neutral-500 flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Landing
            </a>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="p-4 h-[calc(100vh-64px)]">
        <div className="h-full flex flex-col">
          {/* Tab Description */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">{activeTabData.label}</h2>
            <p className="text-sm text-neutral-500">{activeTabData.description}</p>
          </div>

          {/* Demo Content */}
          <div className="flex-1 min-h-0">
            {activeTab === 'pdf' && <PdfExtractDemo />}
            {activeTab === 'image' && <ImageExtractDemo />}
            {activeTab === 'langextract' && <LangExtractDemo />}
            {activeTab === 'langchain' && <LangChainDemo />}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

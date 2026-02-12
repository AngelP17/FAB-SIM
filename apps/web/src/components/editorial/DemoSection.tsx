import { useState, useRef } from "react";
import { Check, ArrowRight, Mail, Building2, User, MessageSquare, Shield, Clock, Terminal } from "lucide-react";
import { useGsapReveal } from "@/hooks/useGsapReveal";

// Demo Form Component
function DemoForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    message: "",
    walkthrough: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12 px-6">
        <div className="w-16 h-16 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">Request Received</h3>
        <p className="text-sm text-neutral-400 max-w-md mx-auto mb-6">
          We'll reply within 24 hours with a demo slot and a replay seed you can verify locally.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-mono text-neutral-400">Confirmation sent to {formData.email}</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-mono text-neutral-500 mb-1.5 uppercase tracking-wider">Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg pl-10 pr-3 py-3 sm:py-2.5 text-base sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors min-h-[44px]"
              placeholder="Your name"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-mono text-neutral-500 mb-1.5 uppercase tracking-wider">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg pl-10 pr-3 py-3 sm:py-2.5 text-base sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors min-h-[44px]"
              placeholder="you@company.com"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-mono text-neutral-500 mb-1.5 uppercase tracking-wider">Company</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
            <input
              type="text"
              required
              value={formData.company}
              onChange={e => setFormData({...formData, company: e.target.value})}
              className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg pl-10 pr-3 py-3 sm:py-2.5 text-base sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors min-h-[44px]"
              placeholder="Company name"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-mono text-neutral-500 mb-1.5 uppercase tracking-wider">Role</label>
          <input
            type="text"
            value={formData.role}
            onChange={e => setFormData({...formData, role: e.target.value})}
            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-3 py-3 sm:py-2.5 text-base sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors min-h-[44px]"
            placeholder="Your role"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-[11px] font-mono text-neutral-500 mb-1.5 uppercase tracking-wider">What system are you replacing?</label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-neutral-600" />
          <textarea
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
            className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/30 transition-colors resize-none"
            rows={3}
            placeholder="Current process, tools, or compliance requirements..."
          />
        </div>
      </div>
      
      <label className="flex items-start gap-3 cursor-pointer group py-1">
        <input
          type="checkbox"
          checked={formData.walkthrough}
          onChange={e => setFormData({...formData, walkthrough: e.target.checked})}
          className="w-5 h-5 rounded border-neutral-700 bg-neutral-900/50 text-white focus:ring-white/20 mt-0.5 flex-shrink-0"
        />
        <span className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors leading-relaxed">
          Include console walkthrough (Merkle verification + lineage tracing)
        </span>
      </label>
      
      <button
        type="submit"
        data-press
        className="w-full bg-white hover:bg-neutral-100 text-black font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm group"
      >
        Request Demo
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </form>
  );
}

// Benefit Item
function BenefitItem({ icon: Icon, title, description }: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex gap-4 p-4 rounded-lg hover:bg-neutral-900/30 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h4 className="text-sm font-medium text-white mb-1">{title}</h4>
        <p className="text-xs text-neutral-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export function DemoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useGsapReveal(sectionRef, []);

  return (
    <section 
      ref={sectionRef}
      id="demo" 
      className="py-24 px-4 sm:px-6 lg:px-8 bg-black border-t border-white/10"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Info */}
          <div data-reveal>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-4 block">
              Get Started
            </span>
            <h2 className="font-display text-4xl lg:text-5xl text-white mb-6">
              See it in action
            </h2>
            <p className="text-neutral-400 mb-8 leading-relaxed">
              Get a personalized 15-minute walkthrough of the TradeOS platform. 
              We'll demonstrate deterministic replay, Merkle verification, and the 
              complete event-to-seal lineage on a realistic manufacturing scenario.
            </p>
            
            <div className="space-y-2">
              <BenefitItem 
                icon={Terminal}
                title="Live Console Demo"
                description="Watch real-time event generation, hash verification, and claim sealing in the browser."
              />
              <BenefitItem 
                icon={Shield}
                title="Cryptographic Verification"
                description="See how Merkle roots are computed and verified without trusting our servers."
              />
              <BenefitItem 
                icon={Clock}
                title="Deterministic Replay"
                description="Receive a seed to replay the exact same events and verify the results yourself."
              />
            </div>
          </div>
          
          {/* Right: Form */}
          <div data-reveal>
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 lg:p-8">
              <h3 className="text-lg font-semibold text-white mb-6">Request a demo</h3>
              <DemoForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

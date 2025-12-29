import Image from "next/image";
import { Check, ChevronLeft, Mic, Settings2, Sparkles } from "lucide-react";

// Backup of the current job seeker hero section. Not used in runtime.
export function IndividualHeroBackup() {
  return (
    <section
      id="individual-hero-backup"
      className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[60vh] overflow-hidden"
    >
      <div className="hero-wash absolute inset-0 -z-10" />
      <div className="flex flex-col items-start space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/50 border border-purple-200/50 text-xs font-medium text-purple-800 tracking-wide">
          <Sparkles className="w-3 h-3" />
          AI-Powered Mock Interviews
        </div>

        <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-[#003366]">
          Ace the interview before you{" "}
          <span className="italic text-[#FF7F50]">enter the room.</span>
        </h1>

        <p className="text-lg text-[#003366]/70 leading-relaxed max-w-md">
          Get real-time feedback on your voice, pacing, and answers. Clarivue is your private interview coach that never
          sleeps.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="coral-btn text-white px-8 py-3.5 rounded-full font-medium text-sm tracking-wide shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
            Start Practicing Free
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative flex justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#f0f9ff] via-[#f5f3ff] to-transparent opacity-60 blur-3xl rounded-full" />
        <div className="w-72 bg-[#003366] rounded-[40px] p-3 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white/20 ring-1 ring-black/5 relative z-10">
          <div className="bg-slate-50 rounded-[32px] h-full overflow-hidden relative">
            <div className="bg-white p-4 flex justify-between items-center shadow-sm">
              <ChevronLeft className="w-5 h-5 text-gray-400" />
              <span className="text-xs font-semibold text-gray-800">Practice Session</span>
              <Settings2 className="w-4 h-4 text-gray-400" />
            </div>

            <div className="p-4 flex flex-col items-center pt-8 space-y-4">
              <div className="w-24 h-24 rounded-full border-4 border-indigo-100 p-1 overflow-hidden">
                <Image
                  src="https://i.pravatar.cc/150?img=32"
                  className="w-full h-full rounded-full object-cover"
                  alt="Practitioner"
                  width={96}
                  height={96}
                />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-bold text-gray-800">Tell me about yourself.</h4>
                <p className="text-xs text-gray-500 mt-1">Listening...</p>
              </div>

              <div className="flex items-center gap-1 h-8">
                <div className="w-1 bg-[#FF7F50] h-3 rounded-full animate-pulse" />
                <div className="w-1 bg-[#FF7F50] h-6 rounded-full animate-pulse delay-75" />
                <div className="w-1 bg-[#FF7F50] h-4 rounded-full animate-pulse delay-150" />
                <div className="w-1 bg-[#FF7F50] h-8 rounded-full animate-pulse" />
                <div className="w-1 bg-[#FF7F50] h-5 rounded-full animate-pulse delay-100" />
              </div>
            </div>

            <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur-sm p-4 rounded-t-2xl border-t border-gray-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Great pacing!</p>
                  <p className="text-[10px] text-gray-500 leading-tight mt-1">
                    You are speaking at 140wpm, which projects confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

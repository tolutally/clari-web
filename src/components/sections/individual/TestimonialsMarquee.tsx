import Image from "next/image";

type Testimonial = {
  quote: string;
  name: string;
  title: string;
  avatar: string;
};

const testimonialsCol1: Testimonial[] = [
  {
    quote:
      "I did one mock interview and immediately saw what was missing in my answers. My next interview felt… calm.",
    name: "Aisha G.",
    title: "Career Switcher",
    avatar:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=256&auto=format&fit=crop",
  },
  {
    quote:
      "Clarivue called out my weak STAR structure and gave me a simple fix. I stopped rambling and started landing the point.",
    name: "Priya P.",
    title: "New Grad",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=256&auto=format&fit=crop",
  },
  {
    quote:
      "The feedback isn’t generic. It’s specific to the job link I pasted — and it helped me tailor my stories fast.",
    name: "Jonas W.",
    title: "Ops & Admin",
    avatar:
      "https://images.unsplash.com/photo-1546456073-6712f79251bb?q=80&w=256&auto=format&fit=crop",
  },
];

const testimonialsCol2: Testimonial[] = [
  {
    quote:
      "I finally understood why my answers sounded ‘right’ but weren’t convincing. The confidence + clarity score made it obvious.",
    name: "Michael C.",
    title: "IT / Support",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256&auto=format&fit=crop",
  },
  {
    quote:
      "I used to practice alone and hope for the best. Now I practice with structure and measurable progress.",
    name: "Rachel A.",
    title: "Product & Growth",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
  },
  {
    quote:
      "The ‘weak points’ panel saved me. It told me exactly what to fix next — not 20 random tips.",
    name: "Liam O.",
    title: "Customer Success",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=256&auto=format&fit=crop",
  },
];

const testimonialsCol3: Testimonial[] = [
  {
    quote:
      "I practiced 30 minutes before the real interview. The follow-ups felt familiar because Clarivue drilled them.",
    name: "Carlos R.",
    title: "Last-Minute Prep",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
  },
  {
    quote:
      "The advisory made my experience sound relevant to the role. It translated my background into their language.",
    name: "Sofia M.",
    title: "Career Switcher",
    avatar:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=256&auto=format&fit=crop",
  },
  {
    quote:
      "I’m getting better each session. Seeing progress tracking made me keep practicing instead of avoiding it.",
    name: "Noah B.",
    title: "Analyst",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256&auto=format&fit=crop",
  },
];

function StarsInline() {
  return (
    <span className="ml-2 inline-flex items-center gap-1 text-sm text-[#003366]">
      {[0, 1, 2, 3].map((i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-amber-600"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-amber-600"
      >
        <path d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2" />
      </svg>
      <span className="ml-1 text-[#003366]/70">4.9/5 • 2,431 reviews</span>
    </span>
  );
}

function AvatarRow() {
  const avatars = [
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
  ];

  return (
    <span className="inline-flex items-center -space-x-2">
      {avatars.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`Reviewer ${i + 1}`}
          width={24}
          height={24}
          className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
        />
      ))}
    </span>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="rounded-2xl border border-[#003366]/10 p-6 bg-white/75 backdrop-blur shadow-md shadow-blue-900/5">
      <blockquote className="text-[16px] sm:text-[18px] text-[#003366] leading-relaxed">
        <span className="inline-flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-[#ff686c]"
          >
            <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
            <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
          </svg>
          <span>&quot;{t.quote}&quot;</span>
        </span>
      </blockquote>

      <div className="mt-5 flex items-center gap-3">
        <Image
          src={t.avatar}
          alt={t.name}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover ring-2 ring-[#003366]/10"
        />
        <div>
          <div className="text-sm font-semibold text-[#003366]">{t.name}</div>
          <div className="text-xs text-[#003366]/60">{t.title}</div>
        </div>
      </div>
    </article>
  );
}

function Column({ testimonials, scrollDir }: { testimonials: Testimonial[]; scrollDir: "up" | "down" }) {
  const dataAttr = scrollDir === "up" ? { "data-scroll-column": "up" } : { "data-scroll-column": "down" };

  return (
    <div className="overflow-hidden">
      <div {...dataAttr} className="space-y-6 will-change-transform">
        {testimonials.map((t, idx) => (
          <TestimonialCard key={`${t.name}-${idx}`} t={t} />
        ))}
        {testimonials.map((t, idx) => (
          <TestimonialCard key={`${t.name}-dup-${idx}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export function TestimonialsMarquee() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(to_right,rgba(0,51,102,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,51,102,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#003366] bg-white/80 border border-[#003366]/10 px-3 py-1.5 rounded-full shadow-sm">
          WALL OF LOVE 
        </span>
        <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#003366]">
          Real stories from people who interview with confidence.
        </h2>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 border-[#003366]/10 bg-white/80 shadow-sm">
          <AvatarRow />
          <StarsInline />
        </div>
      </div>

      <style>{`
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-33.33%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-33.33%); }
          100% { transform: translateY(0); }
        }
        [data-scroll-column="up"] { animation: scrollUp 22s linear infinite; }
        [data-scroll-column="down"] { animation: scrollDown 22s linear infinite; }
        [data-scroll-column]:hover { animation-play-state: paused; }
      `}</style>

      <div
        className="grid grid-cols-1 md:grid-cols-3 py-10 gap-x-6 gap-y-6 overflow-hidden"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 35%, black 65%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 35%, black 65%, transparent)",
        }}
      >
        <Column testimonials={testimonialsCol1} scrollDir="up" />
        <Column testimonials={testimonialsCol2} scrollDir="down" />
        <Column testimonials={testimonialsCol3} scrollDir="up" />
      </div>
    </section>
  );
}

import { BellRing, CheckCircle2, ShieldCheck } from "lucide-react";

export function SecurityCompliance() {
  return (
    <section className="w-full text-[#003366]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="px-0 py-9 sm:py-10 lg:py-11">
          <div className="text-center mb-7 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-[3rem] font-semibold tracking-[-0.04em] text-[#042b53] leading-[1.05]">
              Enterprise Grade Security
            </h2>
          </div>

          <div className="grid gap-3 lg:grid-cols-3 lg:gap-3">
            <article className="rounded-[24px] border border-[#042b53]/12 bg-white/90 p-5 shadow-[0_16px_36px_-34px_rgba(4,43,83,0.24)] backdrop-blur-sm">
              <h3 className="text-[1.45rem] leading-none tracking-[-0.03em] font-medium text-[#042b53]">
                Built for Trust
              </h3>
              <p className="mt-2 text-base leading-[1.45] text-[#042b53]/72 max-w-sm">
                Protect student and program data with privacy standards built for institutional scrutiny.
              </p>

              <div className="mt-5 rounded-[18px] border border-[#042b53]/8 bg-[#fcfcfc] px-4 py-5">
                <div className="mx-auto flex max-w-[220px] flex-col gap-2.5">
                  {[
                    { label: "FERPA Compliant", icon: ShieldCheck },
                    { label: "HECVAT Ready", icon: CheckCircle2 },
                    { label: "SOC 2 Aligned", icon: CheckCircle2 },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center justify-center gap-2 rounded-full border border-[#042b53]/16 bg-white px-4 py-2 text-[#042b53] shadow-[0_1px_0_rgba(255,255,255,0.9)]"
                      >
                        <Icon className="h-4 w-4 text-[#ff6b57]" strokeWidth={1.8} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>

            <article className="rounded-[24px] border border-[#042b53]/12 bg-white/90 p-5 shadow-[0_16px_36px_-34px_rgba(4,43,83,0.24)] backdrop-blur-sm">
              <h3 className="text-[1.45rem] leading-none tracking-[-0.03em] font-medium text-[#042b53]">
                Controlled Access
              </h3>
              <p className="mt-2 text-base leading-[1.45] text-[#042b53]/72 max-w-sm">
                Institutions retain full ownership and role-based control over every workflow.
              </p>

              <div className="mt-5 overflow-hidden rounded-[18px] border border-[#042b53]/8 bg-[#fcfcfc] p-0">
                <svg
                  viewBox="0 0 360 220"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-labelledby="controlled-access-title controlled-access-desc"
                  className="block h-auto w-full"
                >
                  <title id="controlled-access-title">Role-based access</title>
                  <desc id="controlled-access-desc">
                    A card showing four user avatars connected by curved lines to a central institution icon, illustrating role-based access.
                  </desc>

                  <rect x="0" y="0" width="360" height="220" fill="#F8FAFD" />

                  <g stroke="#B8CCF4" strokeWidth="0.5" opacity="0.4">
                    <line x1="0" y1="44" x2="360" y2="44" />
                    <line x1="0" y1="88" x2="360" y2="88" />
                    <line x1="0" y1="132" x2="360" y2="132" />
                    <line x1="0" y1="176" x2="360" y2="176" />
                    <line x1="60" y1="0" x2="60" y2="220" />
                    <line x1="120" y1="0" x2="120" y2="220" />
                    <line x1="180" y1="0" x2="180" y2="220" />
                    <line x1="240" y1="0" x2="240" y2="220" />
                    <line x1="300" y1="0" x2="300" y2="220" />
                  </g>

                  <text
                    x="180"
                    y="40"
                    textAnchor="middle"
                    fontFamily="DM Sans, system-ui, sans-serif"
                    fontSize="14"
                    fill="#5B7393"
                  >
                    role-based access
                  </text>

                  <path d="M 78 86 Q 130 92 160 110" fill="none" stroke="#FE686D" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 282 86 Q 230 92 200 110" fill="none" stroke="#FE686D" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 78 154 Q 130 148 160 130" fill="none" stroke="#102C64" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 282 154 Q 230 148 200 130" fill="none" stroke="#102C64" strokeWidth="2" strokeLinecap="round" />

                  {[
                    { x: 50, y: 70 },
                    { x: 268, y: 70 },
                    { x: 50, y: 138 },
                    { x: 268, y: 138 },
                  ].map((avatar) => (
                    <g key={`${avatar.x}-${avatar.y}`} transform={`translate(${avatar.x} ${avatar.y})`}>
                      <circle cx="14" cy="14" r="14" fill="#FFFFFF" stroke="#102C64" strokeOpacity="0.18" strokeWidth="1" />
                      <circle cx="14" cy="11" r="4" fill="#102C64" opacity="0.65" />
                      <path d="M 6 22 Q 14 16 22 22" fill="none" stroke="#102C64" strokeWidth="1.6" strokeLinecap="round" opacity="0.65" />
                    </g>
                  ))}

                  <g transform="translate(150 86)">
                    <rect x="0" y="0" width="60" height="60" rx="10" fill="#FFFFFF" stroke="#102C64" strokeOpacity="0.18" strokeWidth="1" />
                    <g transform="translate(14 16)" fill="#102C64">
                      <polygon points="16,0 0,10 32,10" />
                      <rect x="0" y="10" width="32" height="3" />
                      <rect x="3" y="14" width="3" height="14" />
                      <rect x="10" y="14" width="3" height="14" />
                      <rect x="19" y="14" width="3" height="14" />
                      <rect x="26" y="14" width="3" height="14" />
                      <rect x="0" y="28" width="32" height="3" />
                    </g>
                  </g>
                </svg>
              </div>
            </article>

            <article className="rounded-[24px] border border-[#042b53]/12 bg-white/90 p-5 shadow-[0_16px_36px_-34px_rgba(4,43,83,0.24)] backdrop-blur-sm">
              <h3 className="text-[1.45rem] leading-none tracking-[-0.03em] font-medium text-[#042b53]">
                Proactive Protection
              </h3>
              <p className="mt-2 text-base leading-[1.45] text-[#042b53]/72 max-w-sm">
                Real-time monitoring and audit visibility keep institutional data review-ready.
              </p>

              <div className="mt-5 rounded-[18px] border border-[#042b53]/8 bg-[#fcfcfc] px-4 py-4">
                <div className="flex items-center gap-3 pb-3">
                  <div className="h-10 w-10 rounded-[10px] border border-[#042b53]/18 bg-white flex items-center justify-center">
                    <BellRing className="h-4.5 w-4.5 text-[#444444]" strokeWidth={1.8} />
                  </div>
                  <p className="text-[14px] font-medium text-[#042b53]">24/7 Notifications and Testing</p>
                </div>

                <div className="relative mt-2 pl-7">
                  <div className="absolute left-[8px] top-1 bottom-1 w-[1.5px] bg-[#042b53]/16" />
                  <div className="space-y-5">
                    {[
                      { label: "1 user logged in", color: "bg-[#5aa595]" },
                      { label: "Full Database is secure", color: "bg-[#5aa595]" },
                      { label: "1 new user alert", color: "bg-[#df8a35]" },
                    ].map((item) => (
                      <div key={item.label} className="relative text-[14px] text-[#042b53]">
                        <span className={`absolute -left-[20px] top-1.5 h-3 w-3 rounded-full ${item.color}`} />
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

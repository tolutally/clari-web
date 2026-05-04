import Link from "next/link";
import { BellRing, Building2, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";

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

              <div className="mt-5 rounded-[18px] border border-[#042b53]/8 bg-[#fcfcfc] px-4 py-4">
                <div className="text-center text-[13px] font-medium text-[#042b53]">role-based access</div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <div className="flex flex-col gap-5 pt-0.5">
                    {[0, 1].map((item) => (
                      <div key={item} className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-[9px] border border-[#042b53]/18 bg-white flex items-center justify-center shadow-[0_1px_0_rgba(255,255,255,0.9)]">
                          <LockKeyhole className="h-3.5 w-3.5 text-[#444444]" strokeWidth={1.8} />
                        </div>
                        <svg width="42" height="18" viewBox="0 0 42 18" className="overflow-visible">
                          <path d="M1 9 C10 9, 12 1, 21 1 S32 17, 41 17" fill="none" stroke="#0ea5e9" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </div>
                    ))}
                  </div>

                  <div className="h-[60px] w-[60px] rounded-[12px] border border-[#042b53]/18 bg-white flex items-center justify-center shadow-[0_1px_0_rgba(255,255,255,0.9)]">
                    <Building2 className="h-7 w-7 text-[#444444]" strokeWidth={1.7} />
                  </div>

                  <div className="flex flex-col gap-5 pt-0.5">
                    {[0, 1].map((item) => (
                      <div key={item} className="flex items-center gap-2.5">
                        <svg width="42" height="18" viewBox="0 0 42 18" className="overflow-visible">
                          <path d="M1 17 C10 17, 12 1, 21 1 S32 9, 41 9" fill="none" stroke="#ff6b57" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                        <div className="h-7 w-7 rounded-[9px] border border-[#042b53]/18 bg-white flex items-center justify-center shadow-[0_1px_0_rgba(255,255,255,0.9)]">
                          <LockKeyhole className="h-3.5 w-3.5 text-[#444444]" strokeWidth={1.8} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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

          <div className="mt-6 flex justify-center">
            <Link
              href="/book-demo"
              className="inline-flex items-center justify-center rounded-xl bg-[#ff686c] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#f05a46]"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

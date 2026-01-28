import Header from "@/components/layout/header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto pt-20">
        <section className="relative  pb-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 dark:opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full"></div>
          </div>
          <div className="max-w-240 mx-auto px-6 relative text-center">
            <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 rounded-full mb-6">
              Redefining Global Commerce
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-[#0d121b] dark:text-white leading-[1.1] tracking-tight mb-8">
              Invoicing for Modern Traders.{" "}
              <span className="text-primary">Simplified.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#4c669a] dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-display">
              Experience the power of automated tax calculations and
              multi-currency support in a clean, editorial interface designed
              for speed and compliance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold rounded-xl shadow-xl shadow-primary/25 hover:-translate-y-1 transition-all">
                Start Free Trial
              </button>
              <button className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-white/5 border border-[#e7ebf3] dark:border-white/10 text-[#0d121b] dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
                Watch Demo
              </button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-background-dark/50">
          <div className="max-w-300 mx-auto px-6 flex flex-col gap-32">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
              <div className="flex-1 w-full">
                <div
                  className="aspect-video bg-linear-to-br from-[#135bec]/5 to-primary/20 rounded-2xl overflow-hidden border border-[#135bec]/10 shadow-2xl relative group"
                  data-alt="Screenshot showing automated tax calculation dashboard"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-6xl opacity-40 group-hover:scale-110 transition-transform">
                      percent
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 h-24 bg-white/80 dark:bg-black/40 backdrop-blur rounded-lg border border-white/20 p-4">
                    <div className="w-1/2 h-4 bg-primary/20 rounded mb-2"></div>
                    <div className="w-1/3 h-4 bg-primary/10 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <div className="size-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                  <span className="material-symbols-outlined">calculate</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Automated Tax Calculations
                </h2>
                <p className="text-lg text-[#4c669a] dark:text-gray-400 leading-relaxed font-display">
                  Stop worrying about cross-border compliance. Our built-in tax
                  engine automatically applies local rules, VAT, and customs
                  duties in real-time, ensuring your trade documents are always
                  legally sound.
                </p>
                <ul className="flex flex-col gap-3">
                  <li className="flex items-center gap-2 text-sm font-medium text-[#0d121b] dark:text-gray-200">
                    <span className="material-symbols-outlined text-primary text-xl">
                      check_circle
                    </span>
                    Real-time VAT/GST validation
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium text-[#0d121b] dark:text-gray-200">
                    <span className="material-symbols-outlined text-primary text-xl">
                      check_circle
                    </span>
                    Dynamic nexus threshold tracking
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24">
              <div className="flex-1 w-full">
                <div
                  className="aspect-video bg-linear-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/10 dark:to-indigo-500/10 rounded-2xl overflow-hidden border border-indigo-200/20 shadow-2xl relative group"
                  data-alt="Interface with multiple currency dropdown and live exchange rates"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-indigo-500 text-6xl opacity-40 group-hover:scale-110 transition-transform">
                      currency_exchange
                    </span>
                  </div>
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-white/5 p-4 flex flex-col gap-3">
                    <div className="h-8 w-full bg-gray-50 dark:bg-white/5 rounded flex items-center px-2 text-[10px] font-bold">
                      USD → EUR
                    </div>
                    <div className="h-8 w-full bg-gray-50 dark:bg-white/5 rounded flex items-center px-2 text-[10px] font-bold">
                      GBP → JPY
                    </div>
                    <div className="h-8 w-full bg-primary/10 rounded flex items-center px-2 text-[10px] font-bold text-primary">
                      AUD → SGD
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <div className="size-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Multi-currency Support
                </h2>
                <p className="text-lg text-[#4c669a] dark:text-gray-400 leading-relaxed font-display">
                  Trade across borders with support for over 150 currencies. Our
                  platform synchronizes with live market exchange rates so your
                  invoices reflect current values exactly when they are issued.
                </p>
                <div className="flex gap-4">
                  <div className="p-4 bg-[#f8f9fc] dark:bg-white/5 rounded-lg flex-1 border border-transparent hover:border-indigo-500/30 transition-all">
                    <div className="text-xl font-bold mb-1">150+</div>
                    <div className="text-xs text-[#4c669a]">
                      Global Currencies
                    </div>
                  </div>
                  <div className="p-4 bg-[#f8f9fc] dark:bg-white/5 rounded-lg flex-1 border border-transparent hover:border-indigo-500/30 transition-all">
                    <div className="text-xl font-bold mb-1">0.1s</div>
                    <div className="text-xs text-[#4c669a]">Live Rate Sync</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
              <div className="flex-1 w-full">
                <div
                  className="aspect-4/3 bg-gray-100 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl relative group"
                  data-alt="A clean professional PDF invoice template preview"
                >
                  <div className="absolute inset-x-8 top-8 bottom-0 bg-white dark:bg-gray-800 rounded-t-lg shadow-2xl border border-gray-100 dark:border-white/5 p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="size-12 bg-primary rounded-lg"></div>
                      <div className="text-right">
                        <div className="w-24 h-4 bg-gray-200 dark:bg-white/10 rounded mb-2 ml-auto"></div>
                        <div className="w-16 h-3 bg-gray-100 dark:bg-white/5 rounded ml-auto"></div>
                      </div>
                    </div>
                    <div className="space-y-2 pt-8">
                      <div className="w-full h-10 bg-gray-50 dark:bg-white/5 rounded"></div>
                      <div className="w-full h-10 bg-gray-50 dark:bg-white/5 rounded"></div>
                      <div className="w-full h-10 bg-gray-50 dark:bg-white/5 rounded"></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <button className="bg-white text-[#0d121b] px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">
                        download
                      </span>{" "}
                      Export PDF
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <div className="size-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                  <span className="material-symbols-outlined">
                    picture_as_pdf
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Instant PDF Exports
                </h2>
                <p className="text-lg text-[#4c669a] dark:text-gray-400 leading-relaxed font-display">
                  Generate professional, branded invoices ready for global
                  distribution in just one click. Customize templates to match
                  your brand&apos;s editorial style while maintaining all
                  required trade data.
                </p>
                <a
                  className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all"
                  href="#"
                >
                  Explore templates{" "}
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-background-light dark:bg-background-dark">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center text-center mb-16">
              <h2 className="text-3xl font-black mb-4">
                Trusted by Traders Worldwide
              </h2>
              <p className="text-[#4c669a] dark:text-gray-400 max-w-xl">
                Join thousands of trade professionals who have streamlined their
                billing operations with TraderFlow.
              </p>
            </div>
            <div className="flex gap-8 pb-10 scrollbar-hide overflow-x-auto xl:overflow-hidden snap-x">
              <div className="min-w-[320px] md:min-w-100 bg-white dark:bg-white/5 p-8 rounded-2xl shadow-sm border border-[#e7ebf3] dark:border-white/10 snap-center flex flex-col gap-6">
                <div className="text-primary opacity-20">
                  <span className="material-symbols-outlined text-5xl">
                    format_quote
                  </span>
                </div>
                <p className="text-lg font-medium italic leading-relaxed text-[#0d121b] dark:text-gray-200">
                  &quot;TraderFlow has transformed our billing cycle from days
                  to minutes. The editorial layouts make our invoices stand out
                  to premium clients.&quot;
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div
                    className="size-14 rounded-full bg-cover bg-center ring-4 ring-primary/5"
                    data-alt="Headshot of Sarah Jenkins, Export Director"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCVZdFOM_cIR-IkUJgsltcjYzg99Xc96KxxKE-oCZiUiCdNNAQJUe3oFElKMwM_dd3ZlaEZO_1FvljRTTFd1gYxqEKPIt7tJKwYXv2Vj69TwfDvoUuVjmCegTUeMXRpYHPaHIS8varXcSbzKBAB8TKWjN6ntzK-05Z8NdE2WvX9XU1Pf0GKT9OeyMHgYibI8uGC4CP537kjGA3rxE-RkrU1IbupJCBQbPS-2OOke0bX1BrRQo53RdXv9qVJWQ8XaMmWbCITeMfblQ');",
                    }}
                  ></div>
                  <div>
                    <h4 className="font-bold">Sarah Jenkins</h4>
                    <p className="text-sm text-[#4c669a]">
                      Export Director, GlobalLink Ltd.
                    </p>
                  </div>
                </div>
              </div>

              <div className="min-w-[320px] md:min-w-100 bg-white dark:bg-white/5 p-8 rounded-2xl shadow-sm border border-[#e7ebf3] dark:border-white/10 snap-center flex flex-col gap-6">
                <div className="text-primary opacity-20">
                  <span className="material-symbols-outlined text-5xl">
                    format_quote
                  </span>
                </div>
                <p className="text-lg font-medium italic leading-relaxed text-[#0d121b] dark:text-gray-200">
                  &quot;The multi-currency support is the most robust I&apos;ve
                  seen. Handling JPY to EUR conversions with live rates has
                  saved us thousands.&quot;
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div
                    className="size-14 rounded-full bg-cover bg-center ring-4 ring-primary/5"
                    data-alt="Headshot of Marcus Thorne, Commodities Trader"
                    style={{
                      backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAOSEfd8e4WWsR6LkCGmwIrSpF_agt4HpGy3ZHrFEYGHnxm52UCBhe4-F_LDK6akJVrSTbEbirD480aTOJSQQC7lAEeXEXSSYVpJmR60TdCZrsDev02PvrTd9Ffya3WD4HWQQC7RA8rPQFuMbwrfbL4WIYiA03eDMhZ0P7LbPgs0KraUXql2lXFkI_cN-WyNXNTJfdrAyb_HLTVYeRT5A0ntoJjdD_m7VvWCJMHOsTEENRfuAZd4GnF6LEtnXXnNu8lUT0sn49vag')`,
                    }}
                  ></div>
                  <div>
                    <h4 className="font-bold">Marcus Thorne</h4>
                    <p className="text-sm text-[#4c669a]">
                      Independent Commodities Trader
                    </p>
                  </div>
                </div>
              </div>

              <div className="min-w-[320px] md:min-w-100 bg-white dark:bg-white/5 p-8 rounded-2xl shadow-sm border border-[#e7ebf3] dark:border-white/10 snap-center flex flex-col gap-6">
                <div className="text-primary opacity-20">
                  <span className="material-symbols-outlined text-5xl">
                    format_quote
                  </span>
                </div>
                <p className="text-lg font-medium italic leading-relaxed text-[#0d121b] dark:text-gray-200">
                  &quot;Clean, intuitive, and compliant. Exactly what our team
                  needed to scale our South East Asian operations
                  effortlessly.&quot;
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div
                    className="size-14 rounded-full bg-cover bg-center ring-4 ring-primary/5"
                    data-alt="Headshot of Elena Rodriguez, Logistics Head"
                    style={{
                      backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCAElwbwnGPnJXasoTcM24BvPtAfuAaTu0JbazQtRUxeSFOiSCwIKiZEmMj-TdkPzirm4skpCXPtBSXay7y5a1dq9_-mJlvc_OAOKqpplP8vWLK_uUjyGEmwmKc4elmcRTwY4W3jtr8vrh3iAb6ZIxn61c9pY_ghgGYlM1ZqajsUxxahTpEviU-M3pzhxqheZkyuU7mRRcpZJn98aSVfImHsp2v9-rKPZQXGS85fvDwUBWXw_wAyEcbwpv2xyB1RW5YzThZRWoPsw')`,
                    }}
                  ></div>
                  <div>
                    <h4 className="font-bold">Elena Rodriguez</h4>
                    <p className="text-sm text-[#4c669a]">
                      Head of Logistics, ViaTrade
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

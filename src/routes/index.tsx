import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FlaskConical,
  MapPin,
  Menu,
  Microscope,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import bloodAsset from "@/assets/blood-gh900.png.asset.json";
import cobasAsset from "@/assets/cobas-e411.png.asset.json";
import founderAsset from "@/assets/founder.png.asset.json";
import logoAsset from "@/assets/global-lab-logo.png.asset.json";
import iflashAsset from "@/assets/iflash-3000.png.asset.json";
import mindrayAsset from "@/assets/mindray-h50p.png.asset.json";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "حجز التحاليل | معامل جلوبال لاب" },
      {
        name: "description",
        content: "احجز تحاليلك في معامل جلوبال لاب بفروع فرشوط ونجع حمادي، المعمل المركزي الأول في صعيد مصر.",
      },
      { property: "og:title", content: "معامل جلوبال لاب — موقع حجز التحاليل" },
      {
        property: "og:description",
        content: "حجز سريع للتحاليل الطبية في فرشوط ونجع حمادي، وسيتواصل معك المختص لتأكيد الموعد.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GlobalLabPage,
});

const devices = [
  { image: iflashAsset.url, name: "iFlash 3000", type: "نظام التحاليل المناعية المتطور" },
  { image: mindrayAsset.url, name: "Mindray H50P", type: "جهاز تحليل صورة الدم الكاملة" },
  { image: bloodAsset.url, name: "Blood GH 900 Plus", type: "جهاز قياس السكر التراكمي HBA1C" },
  { image: cobasAsset.url, name: "Roche Cobas e 411", type: "نظام التحاليل الهرمونية والمناعية" },
];

const branches = [
  {
    name: "فرشوط",
    lines: ["شارع خور الحليمي", "أعلى استوديو جولد ستار ومطعم الشيف للأسماك", "بجوار صيدلية الإسعاف الجديدة"],
    phone: "01033444994",
    map: "https://maps.app.goo.gl/3CHxYUGdqjPVMDWk8?g_st=ac",
  },
  {
    name: "نجع حمادي",
    lines: ["شارع حسني مبارك أمام بيع المصنوعات", "بجوار شركة الوضيحي"],
    phone: "01122295220",
    map: "https://maps.app.goo.gl/n8pe9WUjFuHz5Gbg9?g_st=ac",
  },
];

function useAutoSlide(length: number, delay: number) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setCurrent((value) => (value + 1) % length), delay);
    return () => window.clearInterval(timer);
  }, [delay, length]);
  return { current, setCurrent };
}

function GlobalLabPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const deviceSlider = useAutoSlide(devices.length, 4200);
  const branchSlider = useAutoSlide(branches.length, 6200);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.14 },
    );
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const submitBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const patientName = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "")
      .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
      .replace(/\s|-/g, "");
    const branch = String(form.get("branch") ?? "");

    if (patientName.length < 2) {
      setError("من فضلك اكتب الاسم بشكل صحيح.");
      return;
    }
    if (!/^01[0125][0-9]{8}$/.test(phone)) {
      setError("من فضلك اكتب رقم موبايل مصري صحيح مكوّن من 11 رقمًا.");
      return;
    }
    if (!branches.some((item) => item.name === branch)) {
      setError("من فضلك اختر الفرع الأقرب لك.");
      return;
    }

    setSubmitting(true);
    const { error: bookingError } = await supabase.from("lab_bookings").insert({
      patient_name: patientName,
      phone,
      branch,
    });
    setSubmitting(false);
    if (bookingError) {
      setError("تعذر تسجيل طلبك الآن. يمكنك الاتصال بالفرع مباشرة وسنساعدك فورًا.");
      return;
    }
    setSubmitted(true);
  };

  const device = devices[deviceSlider.current];
  const branch = branches[branchSlider.current];

  if (!device || !branch) return null;

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 lg:flex lg:justify-between lg:px-8">
          <a href="#top" className="flex min-w-0 items-center gap-3" aria-label="الصفحة الرئيسية">
            <img src={logoAsset.url} alt="جلوبال لاب للخدمات الطبية" className="h-14 w-14 shrink-0 object-contain" />
            <div className="min-w-0">
              <strong className="block truncate text-lg text-primary">معامل جلوبال لاب</strong>
              <span className="block truncate text-xs text-muted-foreground">للخدمات الطبية</span>
            </div>
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="التنقل الرئيسي">
            <button type="button" onClick={() => scrollTo("founder")} className="nav-link">عن المعمل</button>
            <button type="button" onClick={() => scrollTo("devices")} className="nav-link">أجهزتنا</button>
            <button type="button" onClick={() => scrollTo("branches")} className="nav-link">فروعنا</button>
            <Button onClick={() => scrollTo("booking")}><CalendarCheck className="size-5" />احجز تحليلك</Button>
          </nav>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
        {menuOpen && (
          <nav className="animate-menu-in border-t border-border bg-background px-4 py-4 lg:hidden" aria-label="قائمة الموبايل">
            <div className="mx-auto grid max-w-7xl gap-2">
              {[
                { id: "founder", label: "عن المعمل" },
                { id: "devices", label: "أجهزتنا" },
                { id: "branches", label: "فروعنا" },
                { id: "booking", label: "احجز تحليلك" },
              ].map(({ id, label }) => (
                <Button key={id} variant="ghost" className="justify-start" onClick={() => scrollTo(id)}>{label}</Button>
              ))}
            </div>
          </nav>
        )}
      </header>

      <section id="top" className="hero-grid relative min-h-[760px] pt-32 lg:min-h-screen lg:pt-28">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div className="relative z-10 animate-hero-copy">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-4 py-2 text-sm font-bold text-primary shadow-soft backdrop-blur">
              <Sparkles className="size-4 text-brand-red" />
              ثقة ودقة في كل نتيجة
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.2] text-primary sm:text-6xl lg:text-7xl">
              معامل جلوبال
              <span className="mt-2 block text-brand-red">موقع حجز التحاليل</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl font-bold leading-9 text-foreground sm:text-2xl">
              المعمل المركزي الأول في صعيد مصر
            </p>
            <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              أحدث أجهزة التحاليل الطبية وفريق متخصص لضمان أعلى مستويات الدقة والسرعة.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => scrollTo("booking")}><CalendarCheck className="size-5" />احجز تحليلك الآن</Button>
              <Button size="lg" variant="secondary" onClick={() => scrollTo("branches")}><MapPin className="size-5" />اختر أقرب فرع</Button>
            </div>
            <div className="mt-9 grid max-w-xl grid-cols-3 gap-3 border-t border-border pt-6">
              <div><strong className="block text-2xl text-primary">2</strong><span className="text-xs text-muted-foreground sm:text-sm">فرع في صعيد مصر</span></div>
              <div><strong className="block text-2xl text-primary">4+</strong><span className="text-xs text-muted-foreground sm:text-sm">أنظمة تحليل متطورة</span></div>
              <div><strong className="block text-2xl text-primary">دقة</strong><span className="text-xs text-muted-foreground sm:text-sm">في كل خطوة</span></div>
            </div>
          </div>

          <div id="founder" className="relative mx-auto w-full max-w-xl animate-hero-image scroll-mt-28">
            <div className="portrait-frame">
              <div className="absolute right-5 top-5 z-10 flex items-center gap-2 rounded-full bg-background/90 px-3 py-2 text-xs font-bold text-primary shadow-soft backdrop-blur">
                <BadgeCheck className="size-4 text-brand-red" /> خبرة طبية موثوقة
              </div>
              <img src={founderAsset.url} alt="د. مصطفى ماضي مدير ومؤسس معامل جلوبال لاب" className="h-full w-full object-cover object-top" />
            </div>
            <div className="founder-caption">
              <span className="mb-1 block text-sm font-bold text-brand-red">مدير ومؤسس معامل جلوبال لاب</span>
              <h2 className="text-2xl font-black text-primary sm:text-3xl">د. مصطفى ماضي</h2>
            </div>
          </div>
        </div>
        <button type="button" onClick={() => scrollTo("devices")} className="scroll-cue" aria-label="انتقل إلى أجهزتنا"><ChevronDown className="size-6" /></button>
      </section>

      <section className="trust-strip" aria-label="مميزات المعمل">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { Icon: Microscope, title: "أجهزة عالمية", text: "تقنيات حديثة لنتائج أكثر دقة" },
            { Icon: ShieldCheck, title: "جودة موثوقة", text: "معايير صارمة داخل جميع مراحل التحليل" },
            { Icon: Clock3, title: "سرعة واستجابة", text: "حجز بسيط وتواصل سريع من المختص" },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-md bg-background/10"><Icon className="size-6" /></div>
              <div><h3 className="font-black">{title}</h3><p className="mt-1 text-sm text-primary-foreground/75">{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id="devices" className="section-shell scroll-mt-20" data-reveal>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="section-heading">
            <span>تقنيات جلوبال لاب</span>
            <h2>أجهزة متطورة لنتائج تستحق الثقة</h2>
            <p>نستخدم أنظمة تحليل عالمية حديثة لدعم دقة النتائج وسرعة إنجازها.</p>
          </div>
          <div className="device-stage">
            <div className="device-image-wrap" key={device.image}>
              <img src={device.image} alt={`${device.name} في معامل جلوبال لاب`} className="h-full w-full object-cover" />
              <div className="device-counter"><strong>{String(deviceSlider.current + 1).padStart(2, "0")}</strong><span>/ 04</span></div>
            </div>
            <div className="device-copy" key={device.name}>
              <FlaskConical className="size-10 text-brand-red" />
              <p className="mt-8 text-sm font-bold text-brand-red">منظومة تشخيصية متقدمة</p>
              <h3 className="mt-3 text-3xl font-black text-primary sm:text-5xl">{device.name}</h3>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">{device.type}</p>
              <div className="mt-10 flex items-center gap-3">
                <Button variant="secondary" size="icon" onClick={() => deviceSlider.setCurrent((deviceSlider.current - 1 + devices.length) % devices.length)} aria-label="الجهاز السابق"><ArrowRight className="size-5" /></Button>
                <Button variant="primary" size="icon" onClick={() => deviceSlider.setCurrent((deviceSlider.current + 1) % devices.length)} aria-label="الجهاز التالي"><ArrowLeft className="size-5" /></Button>
              </div>
              <div className="mt-8 flex gap-2" aria-label="اختيار الجهاز">
                {devices.map((item, index) => (
                  <Button key={item.name} variant="ghost" size="icon" className="size-8" onClick={() => deviceSlider.setCurrent(index)} aria-label={`عرض ${item.name}`}>
                    <span className={index === deviceSlider.current ? "carousel-dot carousel-dot-active" : "carousel-dot"} />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="branches" className="section-shell bg-section scroll-mt-20" data-reveal>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="section-heading">
            <span>أقرب إليك</span>
            <h2>فروع معامل جلوبال لاب</h2>
            <p>اختر فرعك، اتصل مباشرة أو افتح الموقع على خرائط Google.</p>
          </div>
          <div className="branch-carousel">
            <div className="branch-map-art" aria-hidden="true">
              <div className="map-ring map-ring-one" />
              <div className="map-ring map-ring-two" />
              <div className="map-pin-pulse"><MapPin className="size-11" /></div>
              <span>قنا</span>
            </div>
            <article key={branch.name} className="branch-card">
              <div className="flex items-center justify-between gap-4">
                <div><span className="text-sm font-bold text-brand-red">فرع جلوبال لاب</span><h3 className="mt-1 text-4xl font-black text-primary">{branch.name}</h3></div>
                <div className="branch-number">{String(branchSlider.current + 1).padStart(2, "0")}</div>
              </div>
              <div className="mt-8 space-y-3">
                {branch.lines.map((line) => <p key={line} className="flex items-start gap-3 leading-7 text-foreground"><MapPin className="mt-1 size-4 shrink-0 text-brand-red" />{line}</p>)}
              </div>
              <a href={`tel:${branch.phone}`} dir="ltr" className="mt-7 inline-flex items-center gap-3 text-2xl font-black text-primary"><Phone className="size-5 text-brand-red" />{branch.phone}</a>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Button asChild><a href={branch.map} target="_blank" rel="noreferrer"><MapPin className="size-5" />افتح موقع الفرع</a></Button>
                <Button variant="secondary" asChild><a href={`tel:${branch.phone}`}><Phone className="size-5" />اتصل بالفرع</a></Button>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{branchSlider.current + 1} من {branches.length}</span>
                <div className="flex gap-2">
                  <Button variant="secondary" size="icon" onClick={() => branchSlider.setCurrent((branchSlider.current - 1 + branches.length) % branches.length)} aria-label="الفرع السابق"><ArrowRight className="size-5" /></Button>
                  <Button size="icon" onClick={() => branchSlider.setCurrent((branchSlider.current + 1) % branches.length)} aria-label="الفرع التالي"><ArrowLeft className="size-5" /></Button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="booking" className="booking-section scroll-mt-20" data-reveal>
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8 lg:py-28">
          <div className="booking-copy">
            <span className="text-sm font-bold text-primary-foreground/70">خطوة واحدة تفصلك عن الحجز</span>
            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">سجل بياناتك<br />وسوف نتواصل معك</h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-primary-foreground/75">اترك اسمك ورقم تليفونك، وسيقوم المختص بالتواصل معك لتأكيد الحجز ومساعدتك في اختيار التحاليل.</p>
            <div className="mt-9 space-y-4">
              <p className="flex items-center gap-3"><CheckCircle2 className="size-5 text-brand-sky" />تأكيد سريع من فريق المعمل</p>
              <p className="flex items-center gap-3"><CheckCircle2 className="size-5 text-brand-sky" />اختيار الفرع الأقرب لك</p>
              <p className="flex items-center gap-3"><CheckCircle2 className="size-5 text-brand-sky" />بياناتك محفوظة بأمان</p>
            </div>
          </div>

          <div className="booking-panel">
            {submitted ? (
              <div className="grid min-h-[430px] place-items-center text-center" role="status">
                <div>
                  <div className="mx-auto grid size-20 place-items-center rounded-full bg-success-soft"><CheckCircle2 className="size-10 text-success" /></div>
                  <h3 className="mt-6 text-3xl font-black text-primary">تم تسجيل طلبك بنجاح</h3>
                  <p className="mx-auto mt-3 max-w-sm leading-7 text-muted-foreground">شكرًا لثقتك في جلوبال لاب. سيتواصل معك المختص في أقرب وقت لتأكيد الحجز.</p>
                  <Button className="mt-7" variant="secondary" onClick={() => setSubmitted(false)}>تسجيل حجز آخر</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submitBooking} noValidate>
                <div className="mb-8"><span className="text-sm font-bold text-brand-red">احجز الآن</span><h3 className="mt-2 text-3xl font-black text-primary">بيانات الحجز</h3></div>
                <label className="form-label" htmlFor="name">الاسم بالكامل</label>
                <input id="name" name="name" className="form-input" autoComplete="name" placeholder="اكتب اسمك" required minLength={2} />
                <label className="form-label mt-5" htmlFor="phone">رقم التليفون</label>
                <input id="phone" name="phone" className="form-input" dir="ltr" inputMode="tel" autoComplete="tel" placeholder="01xxxxxxxxx" required />
                <label className="form-label mt-5" htmlFor="branch">الفرع الأقرب</label>
                <select id="branch" name="branch" className="form-input" defaultValue="" required>
                  <option value="" disabled>اختر الفرع</option>
                  {branches.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
                </select>
                {error && <p className="mt-4 rounded-md bg-error-soft p-3 text-sm font-bold text-destructive" role="alert">{error}</p>}
                <Button type="submit" size="lg" className="mt-7 w-full" disabled={submitting}>
                  {submitting ? "جارٍ تسجيل الحجز..." : <><CalendarCheck className="size-5" />سجل طلب الحجز</>}
                </Button>
                <p className="mt-4 text-center text-xs leading-6 text-muted-foreground">بالضغط على تسجيل الحجز، أنت توافق على تواصل فريق المعمل معك لتأكيد الموعد.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-9 text-center sm:px-6 md:flex-row md:text-right lg:px-8">
          <div className="flex items-center gap-3"><img src={logoAsset.url} alt="" className="size-14 object-contain" /><div><strong className="block text-primary">معامل جلوبال لاب</strong><span className="text-sm text-muted-foreground">المعمل المركزي الأول في صعيد مصر</span></div></div>
          <p className="text-sm text-muted-foreground">© 2026 معامل جلوبال لاب. جميع الحقوق محفوظة.</p>
        </div>
      </footer>

      <Button className="fixed bottom-4 left-4 right-4 z-40 shadow-brand sm:hidden" onClick={() => scrollTo("booking")}><CalendarCheck className="size-5" />احجز تحليلك الآن</Button>
    </main>
  );
}
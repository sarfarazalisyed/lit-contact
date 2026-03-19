"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

/* ─────────────────────────────────────────────
   FAQ Data
   ───────────────────────────────────────────── */
const mainFaqs = [
  {
    q: "How is The LIT School different from other colleges?",
    a: "At The LIT School, students don't just study marketing or entrepreneurship — they live it by working directly with brands, solving 50–100+ real briefs, and learning from industry leaders.",
  },
  {
    q: "What programs are offered by LIT School?",
    a: "LIT School has 2 Undergraduate programmes:\n- Next Gen Business Programme\n- CreatorPreneur Programme\n\nAlong with 2 Evening School Programmes:\n- Creator Marketer Programme\n- Creator Plus Programme",
  },
  {
    q: "What is the duration of the programmes?",
    a: "The CreatorPreneur Programme & Next Gen Business Programmes are 3 year programmes that will consist of 24 months of Experiential Learning + 6 months of Paid Internship + 6 months of Business Incubation.\n\nThe Creator Marketer Programme is a 15 month Programme that will consist of 12 months of Experiential Learning + 3 months of Paid Internship.\n\nThe Creator + Programme is a 12 month programme that consists of 10 months of Experiential Learning + 2 months of Paid Internship.",
  },
];

const additionalFaqs = [
  {
    q: "Is the programme conducted online or offline?",
    a: "The Creator Marketer Programme is an experiential learning programme thus it would be a completely offline programme.",
  },
  {
    q: "What are the Programme timings?",
    a: "The UG Programme timings would be 10:30am to 4:30pm. The Evening School programmes would be from 4:30pm to 7:30pm.",
  },
  {
    q: "Who are some industry experts that have visited The LIT School?",
    a: "Varun Mayya, Raj Shamani, Ganesh Prasad (ThinkSchool), Kusha Kapila, Sabeer Bhatia, Orry, and more!",
  },
  {
    q: "What are EPICs?",
    a: "EPICs (Experiential Programmes in an Integrated Curriculum) replace traditional subjects. The Creator Marketer Programme consists of 6 EPICs throughout the course of 12 months.",
  },
  {
    q: "How detailed are EPICs?",
    a: "Each EPIC lasts around 45-60 days, giving students enough time to deeply understand each topic.",
  },
  {
    q: "What if I miss a class?",
    a: "Don't Worry! All classes are recorded and uploaded to a shared Google Drive, along with notes, so you can catch up anytime!",
  },
  {
    q: "How many students are there per batch?",
    a: "The LIT School only takes in 50 students per batch.",
  },
  {
    q: "What is the application process?",
    a: "Step 1: Fill in the application with details along with answering the SOP Questions on the basis of which your applications may or may not be shortlisted. Step 2: If your application has been shortlisted, your Interview will be scheduled for you and the details will be sent to you via email. Step 3: If you get accepted through the interview round for The LIT School, the final steps would be to reserve your seat by paying the admission fees.",
  },
  {
    q: "Does The LIT School offer scholarships?",
    a: "Yes, through the LITMUS Test and an interview, which evaluates creativity, originality, relatability, and pitch of a solution to a brand brief. Through this process, the students can avail a 5%, 8%, 12%, or 15% based on their performance.",
  },
  {
    q: "Does The LIT School offer placement assistance?",
    a: "Yes – The LIT School provides 100% lifelong placement assistance!",
  },
  {
    q: "Does LIT School offer scholarships?",
    a: "Yes, through the LITMUS Test and an interview, which evaluates creativity, originality, relatability, and pitch of a solution to a brand brief. Through this process, the students can avail a 5%, 8%, 12%, or 15% based on their performance. LIT School also has special category scholarships, these scholarships recognise execution, impact, and initiative beyond academics.",
  },
  {
    q: "Do the evening school programmes offer a diploma?",
    a: "Yes, the evening school students would receive a diploma from NAAC A+ Accredited University.",
  },
  {
    q: "Does the UG programme offer a Bachelors Degree?",
    a: "Yes, the Next Gen Business and CreatorPreneur Programme offer Bachelor's Degree from a NAAC A+ accredited University.",
  },
  {
    q: "Does LIT provide hostel facilities?",
    a: "No, LIT School does not have its own hostel facility however LIT does have a dedicated Admin Team that assists with looking for accommodation based on your budget and preferences.",
  },
  {
    q: "What will I receive at the end of the programme?",
    a: "A Degree/Diploma and a LIT Profile showcasing all brand briefs solved, solutions provided, and mentor endorsements via LinkedIn.",
  },
];

/* ─────────────────────────────────────────────
   Countdown Timer Component
   ───────────────────────────────────────────── */
const BATCH_CLOSE_DATE = new Date("2026-04-20T23:59:59").getTime();

function CountdownDigit({ value, label }: { value: number; label: string }) {
  const prevRef = useRef(value);
  const [flip, setFlip] = useState<{ from: string; to: string; key: number } | null>(null);
  const keyRef = useRef(0);

  useEffect(() => {
    if (value !== prevRef.current) {
      const from = String(prevRef.current).padStart(2, "0");
      const to = String(value).padStart(2, "0");
      prevRef.current = value;
      keyRef.current += 1;
      setFlip({ from, to, key: keyRef.current });
      const t = setTimeout(() => setFlip(null), 750);
      return () => clearTimeout(t);
    }
  }, [value]);

  const display = String(value).padStart(2, "0");

  return (
    <div className="countdown-unit">
      <div className="flip-card">
        {/* Static bottom half - shows current value (revealed when bottom flap lands) */}
        <div className="flip-panel flip-panel-bottom">
          <div className="flip-panel-inner">
            <span>{display}</span>
          </div>
        </div>
        {/* Static top half - always shows current value */}
        <div className="flip-panel flip-panel-top">
          <div className="flip-panel-inner">
            <span>{display}</span>
          </div>
        </div>
        {/* Animated top flap - shows OLD value, flips down to reveal new top underneath */}
        {flip && (
          <div className="flip-panel flip-panel-top flip-anim-top" key={`t${flip.key}`}>
            <div className="flip-panel-inner">
              <span>{flip.from}</span>
            </div>
          </div>
        )}
        {/* Animated bottom flap - shows NEW value, flips up into place */}
        {flip && (
          <div className="flip-panel flip-panel-bottom flip-anim-bottom" key={`b${flip.key}`}>
            <div className="flip-panel-inner">
              <span>{flip.to}</span>
            </div>
          </div>
        )}
        {/* Center line */}
        <div className="flip-card-line" />
      </div>
      <span className="countdown-label">{label}</span>
    </div>
  );
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, BATCH_CLOSE_DATE - Date.now());
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="countdown-section">
      <p className="countdown-title">Next batch closes in</p>
      <div className="countdown-row">
        <CountdownDigit value={timeLeft.days} label="Days" />
        <span className="countdown-colon">:</span>
        <CountdownDigit value={timeLeft.hours} label="Hours" />
        <span className="countdown-colon">:</span>
        <CountdownDigit value={timeLeft.minutes} label="Minutes" />
        <span className="countdown-colon">:</span>
        <CountdownDigit value={timeLeft.seconds} label="Seconds" />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Intersection Observer Hook
   ───────────────────────────────────────────── */
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    const el = ref.current;
    if (el) {
      const targets = el.querySelectorAll(".animate-on-scroll");
      targets.forEach((t) => observer.observe(t));
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ─────────────────────────────────────────────
   Main Page Component
   ───────────────────────────────────────────── */
export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    dob: "",
    phone: "",
    gender: "",
    location: "",
    enquiryType: "",
    courseInterest: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [serverError, setServerError] = useState("");
  const [openFaq, setOpenFaq] = useState<Set<number>>(new Set([0, 1, 2]));
  const [openAdditionalFaq, setOpenAdditionalFaq] = useState<Set<number>>(
    new Set(),
  );
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useScrollAnimation();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Update a form field and clear its error
  const updateField = useCallback(
    (field: string, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (prev[field]) {
          const next = { ...prev };
          delete next[field];
          return next;
        }
        return prev;
      });
      if (serverError) setServerError("");
    },
    [serverError],
  );

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    else if (form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters";
    else if (form.name.trim().length > 200) e.name = "Name is too long";

    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Enter a valid email";

    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[\d\s\+\-\(\)]{7,20}$/.test(form.phone.trim()))
      e.phone = "Enter a valid phone number";

    if (form.message.length > 2000)
      e.message = "Message must be under 2000 characters";

    return e;
  }, [form]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Prevent double submission
    if (status === "loading") return;

    const errs = validate();
    setErrors(errs);
    setServerError("");
    if (Object.keys(errs).length) return;

    // Abort any previous in-flight request
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controller.signal,
      });

      if (res.ok) {
        setStatus("success");
      } else {
        let errorMsg = "Something went wrong. Please try again.";
        try {
          const data = await res.json();
          if (data.error) errorMsg = data.error;
        } catch {
          /* ignore parse errors */
        }

        if (res.status === 429) {
          errorMsg =
            "Too many submissions. Please wait a moment and try again.";
        }

        setServerError(errorMsg);
        setStatus("error");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setServerError(
        "Network error. Please check your connection and try again.",
      );
      setStatus("error");
    }
  }

  /* ─── Success Screen ─── */
  if (status === "success")
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
          position: "relative",
          zIndex: 1,
          padding: "var(--page-pad)",
        }}
      >
        <div style={{ textAlign: "center", animation: "scaleIn 0.5s ease" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 5vw, 2rem)",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            Your submission has been received!
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "2rem",
              fontSize: "1.1rem",
            }}
          >
            We&apos;ll get back to you shortly.
          </p>
          <button
            onClick={() => {
              setStatus("idle");
              setForm({
                name: "",
                email: "",
                dob: "",
                phone: "",
                gender: "",
                location: "",
                enquiryType: "",
                courseInterest: "",
                message: "",
              });
            }}
            style={{
              padding: "14px 32px",
              background: "var(--gradient-orange)",
              color: "white",
              border: "none",
              borderRadius: "999px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              transition: "all var(--transition-normal)",
              boxShadow: "0 4px 20px rgba(249,115,22,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 6px 30px rgba(249,115,22,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(249,115,22,0.3)";
            }}
          >
            SEND ANOTHER ENQUIRY
          </button>
        </div>
      </div>
    );

  return (
    <div ref={scrollRef} style={{ position: "relative", zIndex: 1 }}>
      {/* ════════════════════════════════════════════
          SECTION 1: Scrolling Ticker Bar (NOT fixed — scrolls away)
          ════════════════════════════════════════════ */}
      <div className="ticker-bar">
        <div className="ticker-track">
          {[...Array(12)].map((_, i) => (
            <span key={i} className="ticker-item">
              NEXT BATCH STARTS ON 20TH APRIL 2026
              <span className="ticker-play-icon">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                  <path d="M2 1.5L8 5L2 8.5V1.5Z" />
                </svg>
              </span>
              BECOME A FULL STACK MARKETER
              <span className="ticker-play-icon">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                  <path d="M2 1.5L8 5L2 8.5V1.5Z" />
                </svg>
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════
          SECTION 2: Sticky Navigation
          ════════════════════════════════════════════ */}
      <nav
        className="nav-bar"
        style={{
          background: navScrolled ? "rgba(0,0,0,0.8)" : "transparent",
          backdropFilter: navScrolled ? "blur(10px)" : "none",
          WebkitBackdropFilter: navScrolled ? "blur(10px)" : "none",
        }}
      >
        {/* LIT Logo */}
        <div style={{ cursor: "pointer", flexShrink: 0 }}>
          <Image
            src="/lit-logo.png"
            alt="LIT School Logo"
            width={52}
            height={58}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        {/* Nav Buttons + Hamburger */}
        <div className="nav-buttons">
          {/* Hamburger — only visible on mobile/tablet via CSS */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>

          <button
            className="nav-btn-contact"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Contact Us
          </button>
          <button className="nav-btn-enquire">
            Enquire Now
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: "6px" }}
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════════════════
          Mobile Menu Drawer
          ════════════════════════════════════════════ */}
      <div
        className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />
      <div className={`mobile-menu-drawer ${menuOpen ? "open" : ""}`}>
        {/* Close button */}
        <button
          className="mobile-menu-close"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>

        {/* Program Links */}
        <div className="mobile-menu-links">
          <a href="#" className="mobile-menu-link">
            Creator Marketer
          </a>
          <a href="#" className="mobile-menu-link">
            CreatorPreneur
          </a>
          <a href="#" className="mobile-menu-link">
            Next Gen Business
          </a>
          <a href="#" className="mobile-menu-link">
            Creator+
          </a>
        </div>

        {/* Bottom actions */}
        <div className="mobile-menu-actions">
          <button
            className="mobile-menu-contact-btn"
            onClick={() => {
              setMenuOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            CONTACT US
          </button>
          <button className="mobile-menu-enquire-btn">
            ENQUIRE NOW
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: "6px" }}
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          COUNTDOWN TIMER
          ════════════════════════════════════════════ */}
      <CountdownTimer />

      {/* ════════════════════════════════════════════
          SECTION 3: Hero — Form (right/top) + Pink Card (left/bottom)
          ════════════════════════════════════════════ */}
      <section className="hero-section">
        {/* Left Column: Pink Card + Illustration — on mobile this goes BELOW */}
        <div className="hero-left">
          {/* Pink "Get in Touch" Card + Icons */}
          <div
            className="animate-on-scroll"
            style={{
              display: "flex",
              alignItems: "end",
              gap: "16px",
            }}
          >
            <div
              style={{
                background: "#fa69e5",
                borderRadius: "24px",
                padding: "clamp(32px, 5vw, 48px) clamp(24px, 4vw, 40px)",
                position: "relative",
                overflow: "hidden",
                flex: 1,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-20px",
                  right: "-20px",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  filter: "blur(30px)",
                }}
              />
              <h1
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: 800,
                  color: "white",
                  marginBottom: "16px",
                  lineHeight: 1.1,
                }}
              >
                Get in Touch!
              </h1>
              <p
                style={{
                  fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1.5,
                  maxWidth: "340px",
                }}
              >
                Fill in your details below and we will get in touch!
              </p>
            </div>
            {/* Adjacent Icons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                flexShrink: 0,
              }}
            >
              <Image
                src="/controller.png"
                alt="Controller"
                width={56}
                height={56}
                style={{ objectFit: "contain" }}
              />
              <Image
                src="/call.png"
                alt="Call"
                width={56}
                height={56}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Illustration */}
          <div className="animate-on-scroll delay-2 hero-illustration">
            <Image
              src="/hero-card-2.png"
              alt="LIT School hero illustration"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>

        {/* Right Column: Contact Form Card — on mobile this goes FIRST */}
        <div
          className="animate-on-scroll delay-1 hero-right"
          style={{
            background: "rgba(26,26,26,0.9)",
            borderRadius: "24px",
            padding: "clamp(16px, 4vw, 36px)",
            border: "1px solid var(--border-default)",
            backdropFilter: "blur(10px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              marginBottom: "24px",
            }}
          >
            Contact Form
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "28px",
              flex: 1,
            }}
          >
            <input
              type="text"
              name="honeypot"
              style={{
                position: "absolute",
                left: "-9999px",
                opacity: 0,
                height: 0,
                width: 0,
                overflow: "hidden",
              }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {/* Row 1: Full Name + Email */}
            <div className="form-row-2col">
              <FormField label="Full Name" required error={errors.name}>
                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="John"
                  maxLength={200}
                  style={inputStyle(!!errors.name)}
                />
              </FormField>
              <FormField label="Email ID" required error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="Johndoe@example.com"
                  style={inputStyle(!!errors.email)}
                />
              </FormField>
            </div>

            {/* Row 2: DOB + Phone */}
            <div className="form-row-2col">
              <FormField label="Date of Birth" required>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => updateField("dob", e.target.value)}
                  placeholder="dd/mm/yyyy"
                  style={{ ...inputStyle(false), colorScheme: "dark" }}
                />
              </FormField>
              <FormField label="Phone No." required error={errors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="00000 00000"
                  maxLength={20}
                  style={inputStyle(!!errors.phone)}
                />
              </FormField>
            </div>

            {/* Row 3: Gender + Location */}
            <div className="form-row-2col">
              <FormField label="Specify Your Gender">
                <select
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  style={{
                    ...inputStyle(false),
                    appearance: "none",
                    cursor: "pointer",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23999' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 14px center",
                  }}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </FormField>
              <FormField label="Where Do You Live?">
                <input
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="Bangalore"
                  maxLength={200}
                  style={inputStyle(false)}
                />
              </FormField>
            </div>

            {/* Enquiry Type */}
            <div>
              <p
                style={{
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "12px",
                }}
              >
                What would you like to enquire about?
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {["LIT Programmes", "A Career at LIT", "Other"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateField("enquiryType", type)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "999px",
                      fontSize: "clamp(12px, 2.5vw, 14px)",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all var(--transition-normal)",
                      background:
                        form.enquiryType === type ? "white" : "transparent",
                      color:
                        form.enquiryType === type
                          ? "#0a0a0a"
                          : "var(--text-primary)",
                      border: `1.5px solid ${form.enquiryType === type ? "white" : "var(--border-light)"}`,
                    }}
                    onMouseEnter={(e) => {
                      if (form.enquiryType !== type)
                        e.currentTarget.style.borderColor = "#888";
                    }}
                    onMouseLeave={(e) => {
                      if (form.enquiryType !== type)
                        e.currentTarget.style.borderColor =
                          "var(--border-light)";
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Interest (conditional) */}
            {form.enquiryType === "LIT Programmes" && (
              <div style={{ animation: "fadeInUp 0.3s ease" }}>
                <FormField label="Course of Interest">
                  <select
                    value={form.courseInterest}
                    onChange={(e) =>
                      updateField("courseInterest", e.target.value)
                    }
                    style={{
                      ...inputStyle(false),
                      appearance: "none",
                      cursor: "pointer",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23999' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                    }}
                  >
                    <option value="">Select a programme</option>
                    <option value="creator-marketer">Creator Marketer</option>
                    <option value="creatorpreneur">CreatorPreneur</option>
                    <option value="next-gen-business">Next Gen Business</option>
                    <option value="creator-plus">Creator+</option>
                  </select>
                </FormField>
              </div>
            )}

            {/* Message */}
            <FormField label="Your Message">
              <textarea
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                placeholder="Tell us more about your enquiry..."
                maxLength={2000}
                style={{
                  ...inputStyle(!!errors.message),
                  minHeight: "90px",
                  resize: "vertical",
                }}
              />
              {form.message.length > 0 && (
                <p
                  style={{
                    color:
                      form.message.length > 1800
                        ? "var(--text-error)"
                        : "var(--text-muted)",
                    fontSize: "12px",
                    marginTop: "4px",
                    textAlign: "right",
                  }}
                >
                  {form.message.length}/2000
                </p>
              )}
            </FormField>

            {/* Submit Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "4px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "var(--blue)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  flex: 1,
                  padding: "16px",
                  background: "var(--gradient-orange)",
                  color: "white",
                  border: "none",
                  borderRadius: "999px",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: status === "loading" ? "wait" : "pointer",
                  letterSpacing: "1px",
                  transition: "all var(--transition-normal)",
                  opacity: status === "loading" ? 0.7 : 1,
                  boxShadow: "0 4px 20px rgba(249,115,22,0.3)",
                }}
                onMouseEnter={(e) => {
                  if (status !== "loading") {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 30px rgba(249,115,22,0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(249,115,22,0.3)";
                }}
              >
                {status === "loading" ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "18px",
                        height: "18px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                        display: "inline-block",
                      }}
                    />
                    SUBMITTING...
                  </span>
                ) : (
                  "SUBMIT ENQUIRY"
                )}
              </button>
            </div>

            {status === "error" && (
              <p
                style={{
                  color: "var(--text-error)",
                  textAlign: "center",
                  fontSize: "14px",
                  animation: "fadeIn 0.3s ease",
                }}
              >
                {serverError ||
                  "Oops! Something went wrong while submitting the form. Please try again."}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 4: FAQ Section
          ════════════════════════════════════════════ */}
      <section className="faq-section">
        {/* Grid overlay on FAQ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Heading */}
          <div
            className="animate-on-scroll"
            style={{ textAlign: "center", marginBottom: "48px" }}
          >
            <h2 className="faq-heading">
              <span style={{ fontFamily: "var(--font-body)" }}>
                Most Common
              </span>
              <br />
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                Questions
              </span>
            </h2>
          </div>

          {/* Main FAQs with expandable answers */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "48px",
            }}
          >
            {mainFaqs.map((faq, i) => (
              <div
                key={i}
                className="animate-on-scroll"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {/* Question Pill */}
                <button
                  onClick={() => {
                    setOpenFaq((prev) => {
                      const next = new Set(prev);
                      if (next.has(i)) next.delete(i);
                      else next.add(i);
                      return next;
                    });
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "clamp(10px, 2vw, 14px) clamp(18px, 3vw, 28px)",
                    borderRadius: "999px",
                    fontSize: "clamp(14px, 2vw, 16px)",
                    fontWeight: 500,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all var(--transition-normal)",
                    background: openFaq.has(i)
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.3)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.25)",
                    backdropFilter: "blur(10px)",
                    maxWidth: "100%",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.25)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {faq.q}
                </button>

                {/* Answer Card */}
                {openFaq.has(i) && (
                  <div className="faq-answer-card">
                    <div
                      style={{
                        color: "rgba(255,255,255,0.85)",
                        fontSize: "15px",
                        lineHeight: 1.7,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {faq.a}
                    </div>
                    {/* Arrow icon */}
                    <Image
                      src="/pink-arrow-icon.png"
                      alt="Arrow"
                      width={36}
                      height={36}
                      style={{
                        position: "absolute",
                        bottom: "0px",
                        right: "-45px",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* "Also asked..." */}
          <p
            className="animate-on-scroll"
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "15px",
              marginBottom: "24px",
            }}
          >
            Also asked...
          </p>

          {/* Additional FAQ pills */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {additionalFaqs.map((faq, i) => (
              <div
                key={i}
                className="animate-on-scroll"
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <button
                  onClick={() => {
                    setOpenAdditionalFaq((prev) => {
                      const next = new Set(prev);
                      if (next.has(i)) next.delete(i);
                      else next.add(i);
                      return next;
                    });
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "fit-content",
                    maxWidth: "100%",
                    padding: "clamp(10px, 2vw, 14px) clamp(18px, 3vw, 28px)",
                    borderRadius: "999px",
                    fontSize: "clamp(13px, 2vw, 15px)",
                    fontWeight: 500,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all var(--transition-normal)",
                    background: openAdditionalFaq.has(i)
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.2)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.transform = "translateX(8px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  {faq.q}
                </button>

                {openAdditionalFaq.has(i) && (
                  <div className="faq-answer-card">
                    <div
                      style={{
                        color: "rgba(255,255,255,0.85)",
                        fontSize: "15px",
                        lineHeight: 1.7,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {faq.a}
                    </div>
                    <Image
                      src="/pink-arrow-icon.png"
                      alt="Arrow"
                      width={36}
                      height={36}
                      style={{
                        position: "absolute",
                        bottom: "0px",
                        right: "-45px",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 5: Newsletter & Footer
          ════════════════════════════════════════════ */}
      <div style={{ padding: "40px" }}>
        <section className="newsletter-section">
          <div className="animate-on-scroll newsletter-grid">
            {/* Left: Branding Card */}
            <div
              style={{
                position: "relative",
                overflow: "visible",
              }}
            >
              <div
                style={{
                  borderRadius: "24px",
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                  minHeight: "280px",
                }}
              >
                <Image
                  src="/enquire-now-bg.png"
                  alt="Enquire Now"
                  fill
                  style={{ objectFit: "contain" }}
                />
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    padding: "clamp(32px, 5vw, 48px) clamp(24px, 4vw, 40px)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src="/learn-innovate-transform.png"
                    alt="learn. innovate. transform."
                    width={600}
                    height={190}
                    style={{
                      objectFit: "contain",
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </div>
              </div>
              {/* LIT sticker — overflows outside the card */}
              <div
                style={{
                  position: "absolute",
                  bottom: "0px",
                  right: "0px",
                  zIndex: 2,
                  width: "150px",
                  height: "150px",
                }}
              >
                <Image
                  src="/lit-sticker.png"
                  alt="LIT"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>

            {/* Right: Newsletter Form */}
            <div
              style={{
                background: "rgba(0,0,0,0.06)",
                borderRadius: "24px",
                padding: "24px",
                border: "1px solid #353535",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  marginBottom: "12px",
                  lineHeight: 1.4,
                }}
              >
                Subscribe to Our Newsletter
              </h3>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "16px",
                  lineHeight: 1.5,
                  marginBottom: "28px",
                }}
              >
                Stay in the loop and unlock exclusive content, industry
                insights, and exciting updates by signing up for our newsletter
                today!
              </p>
              <div
                className="newsletter-input-row"
                style={{ position: "relative" }}
              >
                <input
                  placeholder="Enter Your Email"
                  style={{
                    width: "100%",
                    height: "70px",
                    padding: "8px 180px 8px 24px",
                    background: "#1e1e1e",
                    border: "none",
                    borderRadius: "16px",
                    color: "white",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box" as const,
                  }}
                />
                <button
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "0",
                    height: "63px",
                    padding: "16px 34px",
                    background: "black",
                    color: "white",
                    border: "1px solid #fa69e5",
                    borderRadius: "100px",
                    fontSize: "18px",
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "all var(--transition-normal)",
                    whiteSpace: "nowrap",
                    margin: "3.5px 3.5px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fa69e5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "black";
                  }}
                >
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Bottom Bar */}
        <footer className="footer-bar">
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #353535",
              borderRadius: "16px",
              padding: "24px",
              background: "rgba(0,0,0,0.06)",
            }}
          >
            <p
              style={{
                color: "white",
                fontSize: "16px",
                margin: 0,
              }}
            >
              © 2025 Disruptive Edu Pvt Ltd.
            </p>
            <p
              style={{
                color: "white",
                fontSize: "16px",
                margin: 0,
              }}
            >
              All Rights Reserved
            </p>
          </div>
        </footer>
      </div>

      {/* ════════════════════════════════════════════
          Floating Action Buttons
          ════════════════════════════════════════════ */}
      <div className="floating-actions">
        {/* WhatsApp */}
        <a
          href="https://wa.me/919844443755"
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn"
          style={{
            background: "var(--green-whatsapp)",
            boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.15)";
            e.currentTarget.style.boxShadow = "0 6px 30px rgba(37,211,102,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,211,102,0.4)";
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>

        {/* Call */}
        <a
          href="tel:+919844443755"
          className="floating-btn"
          style={{
            background: "var(--blue-call)",
            boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.15)";
            e.currentTarget.style.boxShadow = "0 6px 30px rgba(59,130,246,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(59,130,246,0.4)";
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Helper Components
   ───────────────────────────────────────────── */

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          color: "var(--text-primary)",
          fontSize: "14px",
          fontWeight: 500,
          display: "block",
          marginBottom: "8px",
        }}
      >
        {label}
        {required && <span style={{ color: "var(--pink)" }}>*</span>}
      </label>
      {children}
      {error && (
        <p
          style={{
            color: "var(--text-error)",
            fontSize: "12px",
            marginTop: "4px",
            animation: "fadeIn 0.2s ease",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "13px 16px",
    background: "var(--bg-secondary)",
    border: `1px solid ${hasError ? "var(--text-error)" : "var(--border-default)"}`,
    borderRadius: "12px",
    color: "white",
    fontSize: "15px",
    outline: "none",
    transition: "all var(--transition-normal)",
    boxSizing: "border-box" as const,
  };
}

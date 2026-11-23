import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import MusicPlayer from "./MusicPlayer";
import { LanguageProvider, LanguageToggle, useLanguage } from "./Language";
import "./chapters.css";

const venueMapUrl =
  "https://www.google.com/maps/search/?api=1&query=The+Grand+Rajwada%2C+Seoni";
const rsvpApiUrl = `${(import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "")}/rsvps`;

function FallingPetals() {
  return (
    <div className="petal-garden" aria-hidden="true">
      {Array.from({ length: 19 }, (_, i) => (
        <span
          className={`falling-petal petal-${i % 4} ${i % 6 === 0 ? "falling-blossom" : ""}`}
          key={i}
          style={{
            left: `${(i * 37 + 7) % 100}%`,
            animationDelay: `${-i * 2.7}s`,
            animationDuration: `${15 + (i % 6) * 3}s`,
            width: `${i % 6 === 0 ? 22 : 9 + (i % 5) * 2}px`,
            height: `${i % 6 === 0 ? 22 : 14 + (i % 4) * 3}px`,
          }}
        >
          {i % 6 === 0 && <Icon name="flower" size={22} />}
        </span>
      ))}
    </div>
  );
}

function Opening({ onOpen }: { onOpen: () => void }) {
  const { t } = useLanguage();
  const [opening, setOpening] = useState(false);
  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(
      onOpen,
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 850,
    );
    return () => window.clearTimeout(timer);
  }, [opening, onOpen]);
  return (
    <div className={`opening-scene ${opening ? "is-opening" : ""}`}>
      <FallingPetals />
      <div className="opening-side-note">
        {t("A LOVE LIKE OURS, A DAY WITH YOU")}
      </div>
      <div className="opening-card">
        <Botanical className="opening-botanical left" />
        <Botanical className="opening-botanical right" />
        <div className="opening-flower">
          <Icon name="flower" size={42} />
        </div>
        <p className="eyebrow">{t("SOMETHING BEAUTIFUL IS ABOUT TO BLOOM")}</p>
        <h1>
          {t("A little love.")}
          <br />
          {t("A little magic.")}
          <br />
          <em>{t("A lifetime of us.")}</em>
        </h1>
        <p className="opening-message">
          {t("And a celebration that wouldn’t be complete without you.")}
        </p>
        <div className="opening-names">
          {t("Shubham")} <em>{t("&")}</em> {t("Sainjali")}
        </div>
        <button
          className="button primary"
          onClick={() => setOpening(true)}
          disabled={opening}
        >
          {t(opening ? "Let the magic begin…" : "Open the invitation")}
          <Icon name="arrow" size={17} />
        </button>
        <span className="opening-bottom">
          {t("A WEDDING INVITATION, WITH ALL OUR LOVE")}
        </span>
      </div>
      <span className="opening-footnote">
        {t("Take a breath. Step into our little world.")}
      </span>
    </div>
  );
}

type IconName =
  | "arrow"
  | "flower"
  | "heart"
  | "calendar"
  | "pin"
  | "camera"
  | "sun"
  | "music"
  | "sparkle"
  | "rings"
  | "glass";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: (
      <>
        <path d="M4 12h15m-5-5 5 5-5 5" />
      </>
    ),
    heart: <path d="m12 20-8-8C-2 5 7 0 12 7c5-7 14-2 8 5Z" />,
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <path d="M8 3v4m8-4v4M4 11h16m-11 4h1m4 0h1" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    camera: (
      <>
        <path d="M8 5 6 8H3v12h18V8h-3l-2-3Z" />
        <circle cx="12" cy="13" r="4" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
      </>
    ),
    music: (
      <>
        <path d="M9 17V5l11-2v12M9 8l11-2" />
        <ellipse cx="6" cy="18" rx="3" ry="3" />
        <ellipse cx="17" cy="16" rx="3" ry="3" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" />
        <path d="m20 1 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" />
      </>
    ),
    rings: (
      <>
        <circle cx="8" cy="14" r="6" />
        <circle cx="16" cy="14" r="6" />
        <path d="m7 5 2-3 2 3-2 3Zm8 0 2-3 2 3-2 3Z" />
      </>
    ),
    glass: (
      <>
        <path d="M5 2h6v7a3 3 0 0 1-6 0Zm8 0h6v7a3 3 0 0 1-6 0ZM8 12v9m-3 0h6m5-9v9m-3 0h6M5 6h6m2 0h6" />
      </>
    ),
    flower: (
      <>
        <path d="M12 9C4-3-3 9 8 12c-12 8 1 15 4 4 8 12 15-1 4-4C28 4 15-3 12 9Z" />
        <circle cx="12" cy="12" r="2" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Botanical({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`botanical ${className}`}
      viewBox="0 0 180 260"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1">
        <path d="M85 258C110 175 50 103 109 19M92 215c-35-9-47-35-46-57 27 11 39 30 46 57ZM94 184c28-17 43-39 40-64-25 14-37 33-40 64ZM84 146c-30-8-43-31-39-54 23 10 35 28 39 54Zm2-32c26-9 46-30 45-52-23 9-38 27-45 52ZM95 62c-13-17-15-39-4-56 12 17 15 35 4 56Z" />
        <path d="M81 245C40 217 36 180 17 158m46 67c-26-1-44-16-49-35 24 1 40 14 49 35Zm-18-30c12-24 10-43 0-57-12 20-11 38 0 57Z" />
      </g>
    </svg>
  );
}

const events: {
  name: string;
  subtitle: string;
  description: string;
  icon: IconName;
  color: string;
  dress: string;
  date: string;
}[] = [
  {
    name: "Haldi",
    subtitle: "A little sunshine, a lot of love",
    description:
      "A joyful beginning, painted in turmeric and surrounded by our favourite people.",
    icon: "sun",
    color: "yellow",
    dress: "Shades of all colours & easy smiles",
    date: "25 January 2027 · 11:00 AM sharp",
  },
  {
    name: "Engagement & Sangeet",
    subtitle: "A promise of forever, then a night of dancing",
    description:
      "Join us as two hearts and two families promise forever, followed by a night of music, laughter, and dancing.",
    icon: "rings",
    color: "pink",
    dress: "Elegant festive wear & dancing shoes",
    date: "25 January 2027 · 7:00 PM",
  },
  {
    name: "Baraat & Reception",
    subtitle:
      "Here comes the celebration, followed by an evening of warm wishes",
    description:
      "Join the procession with open hearts and dancing feet, then celebrate with good food, warm wishes, and memories to treasure.",
    icon: "sparkle",
    color: "peach",
    dress: "Traditional attire & evening elegance",
    date: "26 January 2027 · 12:00 noon",
  },
  {
    name: "Phere",
    subtitle: "Seven sacred steps into forever",
    description:
      "Gather close as we take our sacred vows and begin this beautiful new chapter together.",
    icon: "rings",
    color: "lavender",
    dress: "Traditional wedding attire",
    date: "26 January 2027 · 5:00 PM",
  },
];

function PhotoPlaceholder({
  label,
  className = "",
  interactive = true,
  imageSrc,
}: {
  label: string;
  className?: string;
  interactive?: boolean;
  imageSrc?: string;
}) {
  const { t } = useLanguage();
  const [photo, setPhoto] = useState<string>();
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      setError("Please choose an image under 10 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
      setError("");
    };
    reader.readAsDataURL(file);
  }
  return (
    <div className={`photo-slot ${className}`}>
      {interactive ? (
        <button
          type="button"
          onClick={() => input.current?.click()}
          aria-label={`${t(photo ? "Change photo" : "Add photo")}: ${label}`}
        >
          {photo ? (
            <>
              <img src={photo} alt={label} />
              <span className="replace-photo">{t("Change photo")}</span>
            </>
          ) : (
            <>
              <span className="photo-icon">
                <Icon name="camera" size={25} />
              </span>
              <span className="photo-label">{label}</span>
              <span className="upload-label">
                {t("A little space for your memories")} <span>+</span>
              </span>
            </>
          )}
        </button>
      ) : (
        <div className={`photo-content${imageSrc ? " has-image" : ""}`}>
          {imageSrc ? (
            <>
              <img src={imageSrc} alt={label} />
              <span className="photo-label photo-label-overlay">{label}</span>
            </>
          ) : (
            <>
              <span className="photo-icon">
                <Icon name="camera" size={25} />
              </span>
              <span className="photo-label">{label}</span>
            </>
          )}
        </div>
      )}
      {interactive && (
        <input
          ref={input}
          type="file"
          accept="image/*"
          onChange={upload}
          hidden
        />
      )}
      {error && (
        <p className="photo-error" role="alert">
          {t(error)}
        </p>
      )}
    </div>
  );
}

const faqs = [
  {
    question: "What should I wear?",
    answer:
      "Each celebration has its own spirit! You’ll find a suggested dress code on the event cards above. Above all, wear something that makes you feel comfortable and ready to celebrate.",
  },
  {
    question: "Where will the celebrations take place?",
    answer: "The Grand Rajwada, Seoni",
    mapLink: true,
  },
  {
    question: "Will accommodation be available?",
    answer: "Yes, accommodation will be available based on your RSVP response.",
  },
];

function Invitation() {
  const { t } = useLanguage();
  const [opened, setOpened] = useState(false);
  const stage = useRef<HTMLElement>(null);
  const [attending, setAttending] = useState("yes");
  const [previewSent, setPreviewSent] = useState(false);
  const [rsvpError, setRsvpError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const finishOpening = useCallback(() => {
    setOpened(true);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      const heading = stage.current?.querySelector<HTMLElement>("h1");
      heading?.setAttribute("tabindex", "-1");
      heading?.focus({ preventScroll: true });
    });
  }, []);
  async function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      attendance: attending,
      guests: attending === "yes" ? Number(formData.get("guests")) : undefined,
      note: String(formData.get("note") ?? ""),
    };

    console.info("[RSVP] Submit clicked", {
      hasName: payload.name.trim().length > 0,
      attendance: payload.attendance,
      guests: payload.guests,
      hasNote: payload.note.trim().length > 0,
    });

    if (payload.name.trim().length < 2) {
      console.warn("[RSVP] Blocked: name is missing or too short");
      setRsvpError("Please enter your full name.");
      return;
    }

    setIsSubmitting(true);
    setRsvpError("");

    try {
      const response = await fetch(rsvpApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      console.info("[RSVP] API response", { status: response.status, ok: response.ok, data });

      if (!response.ok) {
        throw new Error(data?.message ?? "We could not save your RSVP. Please try again.");
      }

      setPreviewSent(true);
    } catch (error) {
      console.error("[RSVP] Submission failed", error);
      setRsvpError(error instanceof Error ? error.message : "We could not save your RSVP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <>
      <MusicPlayer />
      <LanguageToggle />
      {!opened ? (
        <Opening onOpen={finishOpening} />
      ) : (
        <div className="scroll-invitation">
          <FallingPetals />
          <a className="skip-to-content" href="#welcome">
            {t("Skip to invitation")}
          </a>
          <header className="header">
            <a
              href="#welcome"
              className="wordmark"
              aria-label={t("Our forever, back to the invitation")}
            >
              {t("our forever")}
              <span>
                <Icon name="flower" size={18} />
              </span>
            </a>
            <div className="header-note">
              {t("AN INVITATION TO OUR FOREVER")}
            </div>
          </header>
          <main ref={stage} className="invitation-content">
            <section className="hero" id="welcome">
              <Botanical className="hero-botanical" />
              <div className="hero-copy">
                <div className="eyebrow">
                  <span className="small-line" />{" "}
                  {t("TWO HEARTS. ONE BEAUTIFUL BEGINNING.")}
                </div>
                <h1>
                  {t("A lifetime of love.")}
                  <br />
                  {t("A celebration")}
                  <br />
                  <em>{t("with you.")}</em>
                </h1>
                <p className="hero-description">
                  {t("With full hearts and the blessings of our families,")}
                  <br className="desktop-break" />{" "}
                  {t("we invite you to be a part of our forever.")}
                </p>
                <div className="couple-names">
                  {t("Shubham")} <span>{t("&")}</span> {t("Sainjali")}
                </div>
                <div className="hero-date">
                  <Icon name="calendar" size={16} />
                  <span>{t("25–26 January 2027")}</span>
                  <span className="date-dot">·</span>
                  <a
                    className="venue-link"
                    href={venueMapUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("The Grand Rajwada, Seoni")}
                  </a>
                </div>
                <a href="#celebrations" className="button primary">
                  {t("Explore the celebrations")}{" "}
                  <Icon name="arrow" size={17} />
                </a>
                <p className="hero-note">
                  {t("Many moments. One unforgettable celebration.")}
                </p>
              </div>
              <div className="hero-art">
                <div className="arch-frame">
                  <img
                    src="/images/palace.png"
                    alt={t(
                      "A sunlit blush-pink Indian palace courtyard framed by flowers",
                    )}
                  />
                </div>
                <div className="arch-outline" />
                <div className="forever-seal">
                  <Icon name="flower" size={26} />
                  <span>{t("TOGETHER")}</span>
                  <em>{t("is a beautiful place to be")}</em>
                </div>
                <div className="art-caption">
                  <span /> {t("THE BEGINNING OF OUR ALWAYS")} <span />
                </div>
              </div>
            </section>

            <div className="invitation-band">
              <Icon name="flower" size={23} />
              <p>
                {t("Some days are special.")}{" "}
                <em>{t("This one is ours to share.")}</em>
              </p>
              <Icon name="flower" size={23} />
            </div>

            <section className="section story-section" id="our-story">
              <div className="story-photos">
                <PhotoPlaceholder
                  label={t("The two of us")}
                  className="story-photo"
                  interactive={false}
                  imageSrc="/images/Romantic Indian Wedding Portrait.png"
                />
                <div className="photo-caption">{t("It was always you.")}</div>
                <span className="handwritten-note">
                  {t("our favourite kind of magic")}
                </span>
              </div>
              <div className="story-copy">
                <div className="eyebrow">{t("A LITTLE ABOUT US")}</div>
                <h2>
                  {t("Two stories.")}
                  <br />
                  {t("One")} <em>{t("beautiful forever.")}</em>
                </h2>
                <p>
                  {t(
                    "Somewhere between the first hello and a thousand little moments, we found our favourite person in each other.",
                  )}
                </p>
                <p>
                  {t(
                    "Now, we’re beginning a new chapter. And it wouldn’t be the same without the people who have filled our lives with so much love. That means you.",
                  )}
                </p>
                <div className="story-personalize">
                  <Icon name="heart" size={17} />
                  <span>
                    {t(
                      "Your story belongs here. Make this little corner your own.",
                    )}
                  </span>
                </div>
                <div className="signature">
                  {t("With love,")} <span>{t("the two of us")}</span>
                </div>
              </div>
            </section>

            <section className="celebrations-section" id="celebrations">
              <div className="section-heading">
                <div className="eyebrow">
                  {t("A FEW DAYS. A LIFETIME OF MEMORIES.")}
                </div>
                <h2>
                  {t("Let the")} <em>{t("celebrations")}</em> {t("begin")}
                </h2>
                <p>
                  {t("From the first touch of haldi to the last dance.")}
                  <br />
                  {t("Come for the moments. Stay for the memories.")}
                </p>
              </div>
              <p className="events-swipe-hint">
                <Icon name="arrow" size={16} />{" "}
                {t("Scroll sideways to discover all four celebrations")}
              </p>
              <div
                className="event-grid"
                role="region"
                aria-label={t("Wedding celebrations, scroll horizontally")}
                tabIndex={0}
              >
                {events.map((event, index) => (
                  <article
                    className={`event-card ${event.color}`}
                    key={t(event.name)}
                    aria-label={t(event.name)}
                  >
                    <div className="event-top">
                      <span className="event-icon">
                        <Icon name={event.icon} size={31} />
                      </span>
                      <span className="event-number">0{index + 1}</span>
                    </div>
                    <h3>{t(event.name)}</h3>
                    <p className="event-subtitle">{t(event.subtitle)}</p>
                    <p className="event-description">{t(event.description)}</p>
                    <div className="event-meta">
                      <div>
                        <Icon name="calendar" size={15} />
                        <span>{t(event.date)}</span>
                      </div>
                      <div>
                        <Icon name="pin" size={15} />
                        <a
                          className="venue-link"
                          href={venueMapUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t("The Grand Rajwada, Seoni")}
                        </a>
                      </div>
                    </div>
                    <div className="dress-code">
                      <span>{t("THE MOOD")}</span>
                      {t(event.dress)}
                    </div>
                  </article>
                ))}
              </div>
              <p className="section-footnote">
                {t("A little anticipation is part of the magic.")}
              </p>
            </section>

            <section className="section moments-section" id="moments">
              <div className="moments-heading">
                <div>
                  <div className="eyebrow">
                    {t("OUR LOVE, IN LITTLE FRAMES")}
                  </div>
                  <h2>
                    {t("The moments")} <em>{t("in between.")}</em>
                  </h2>
                </div>
                <p>
                  {t("The big adventures. The quiet days.")}
                  <br />
                  {t("And everything that led us here.")}
                </p>
              </div>
              <div className="gallery">
                <PhotoPlaceholder
                  label={t("Where it all began")}
                  imageSrc="/images/Stylised Couple Portrait in a Modern Room.png"
                  interactive={false}
                />
                <PhotoPlaceholder
                  label={t("Our kind of happiness")}
                  imageSrc="/images/Romantic Garden Portrait Under the Ficus.png"
                  interactive={false}
                />
                <PhotoPlaceholder
                  label={t("A little adventure")}
                  imageSrc="/images/Balcony Portrait of a Smiling Couple.png"
                  interactive={false}
                />
                <PhotoPlaceholder
                  label={t("Always, together")}
                  imageSrc="/images/Embroidered Embrace in a Golden Hallway.png"
                  interactive={false}
                />
              </div>
              <p className="section-footnote">
                <Icon name="camera" size={14} />{" "}
                {t("A few glimpses of our story.")}
              </p>
            </section>

            <section className="details-section" id="details">
              <div className="details-inner">
                <div className="details-intro">
                  <div className="eyebrow">{t("A LITTLE GOOD TO KNOW")}</div>
                  <h2>
                    {t("All the")} <em>{t("little details.")}</em>
                  </h2>
                  <p>
                    {t("So you can worry less about the planning,")}
                    <br />
                    {t("and more about the celebrating.")}
                  </p>
                  <div className="details-note">
                    <Icon name="pin" size={23} />
                    <div>
                      <h4>{t("A place for our forever")}</h4>
                      <p>
                        <a
                          className="venue-link"
                          href={venueMapUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t("The Grand Rajwada, Seoni")}
                        </a>
                        <br />
                        {t(
                          "Please RSVP to this invitation so we can make your stay comfortable.",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="faq-list">
                  {faqs.map(({ question, answer, mapLink }, index) => (
                    <div
                      className={`faq-item ${activeFaq === index ? "expanded" : ""}`}
                      key={t(question)}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveFaq(activeFaq === index ? null : index)
                        }
                        aria-expanded={activeFaq === index}
                        aria-controls={`faq-${index}`}
                      >
                        <span>{t(question)}</span>
                        <span className="faq-plus">
                          {activeFaq === index ? "−" : "+"}
                        </span>
                      </button>
                      <div id={`faq-${index}`} hidden={activeFaq !== index}>
                        <p>
                          {mapLink ? (
                            <a
                              className="venue-link"
                              href={venueMapUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {t(answer)}
                            </a>
                          ) : (
                            t(answer)
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rsvp-section section" id="rsvp">
              <Botanical className="rsvp-botanical" />
              <div className="rsvp-copy">
                <div className="eyebrow">
                  {t("THE BEST PART OF OUR DAY? YOU.")}
                </div>
                <h2>
                  {t("Save a little space")}
                  <br />
                  {t("for")} <em>{t("our big day.")}</em>
                </h2>
                <p>
                  {t("We’d love to celebrate with you.")}
                  <br />
                  {t("Let us know if you’ll be joining the festivities.")}
                </p>
                <div className="rsvp-love">
                  <Icon name="heart" size={23} />
                  <span>{t("Your presence is our favourite present.")}</span>
                </div>
              </div>
              <div className="rsvp-panel">
                {previewSent ? (
                  <div className="rsvp-success" role="status">
                    <Icon name="heart" size={34} />
                    <h3>{t("A little preview of what’s to come.")}</h3>
                    <p>
                      {t("Thank you! Your RSVP has been saved.")}
                    </p>
                    <button
                      className="button primary"
                      onClick={() => setPreviewSent(false)}
                    >
                      {t("Back to the invitation")}{" "}
                      <Icon name="arrow" size={16} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submitRsvp} noValidate>
                    <div className="form-heading">
                      <h3>{t("Will you be there?")}</h3>
                      <span>{t("RSVP")}</span>
                    </div>
                    <label>
                      {t("Your name")}
                      <input
                        name="name"
                        placeholder={t("First & last name")}
                        autoComplete="name"
                        maxLength={120}
                      />
                    </label>
                    <fieldset>
                      <legend>{t("Will you be joining us?")}</legend>
                      <input
                        type="hidden"
                        name="attendance"
                        value={attending}
                      />
                      <div className="attendance-options">
                        <button
                          type="button"
                          className={`attendance-toggle ${attending === "yes" ? "selected" : ""}`}
                          aria-pressed={attending === "yes"}
                          onClick={() => setAttending("yes")}
                        >
                          {t("Yes")}
                        </button>
                        <button
                          type="button"
                          className={`attendance-toggle ${attending === "no" ? "selected" : ""}`}
                          aria-pressed={attending === "no"}
                          onClick={() => setAttending("no")}
                        >
                          {t("No")}
                        </button>
                      </div>
                    </fieldset>
                    {attending === "yes" && (
                      <label>
                        {t("Number of guests")}
                        <select name="guests" defaultValue="1">
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <option value={n} key={n}>
                              {n} {t(n === 1 ? "guest" : "guests")}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                    <label>
                      {t("A little note for us")} <span>{t("(optional)")}</span>
                      <textarea
                        name="note"
                        rows={2}
                        placeholder={t("Send a little love…")}
                        maxLength={2000}
                      />
                    </label>
                    <button
                      className="button primary submit-rsvp"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {t(isSubmitting ? "Saving your RSVP…" : "Send my RSVP")} <Icon name="arrow" size={17} />
                    </button>
                    {isSubmitting && (
                      <p className="rsvp-status" role="status">
                        {t("Saving your RSVP…")}
                      </p>
                    )}
                    {rsvpError && <p className="rsvp-error" role="alert">{t(rsvpError)}</p>}
                  </form>
                )}
              </div>
            </section>
            <section className="closing">
              <Icon name="flower" size={33} />
              <p>
                {t("Here’s to love, laughter, and a lifetime of together.")}
              </p>
              <h2>
                {t("We can’t wait to")} <em>{t("celebrate with you.")}</em>
              </h2>
              <div className="closing-names">
                {t("Shubham")} <span>{t("&")}</span> {t("Sainjali")}
              </div>
            </section>
          </main>
          <footer>
            <a className="wordmark" href="#">
              {t("our forever")}
              <span>
                <Icon name="flower" size={18} />
              </span>
            </a>
            <span>{t("Made with love. Meant to be shared.")}</span>
            <a href="#rsvp">
              {t("See you at the celebration")} <Icon name="heart" size={13} />
            </a>
          </footer>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Invitation />
    </LanguageProvider>
  );
}

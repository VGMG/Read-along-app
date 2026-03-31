import { useState, useEffect, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const AGE_GROUPS = [
  { id: "tiny", label: "Tiny Readers", ages: "3–5", emoji: "🌱", color: "#FF9B6A" },
  { id: "early", label: "Early Readers", ages: "6–8", emoji: "🌻", color: "#4BBFA5" },
  { id: "growing", label: "Growing Readers", ages: "9–12", emoji: "🦋", color: "#7B8FF5" },
];

const SAMPLE_BOOKS = [
  {
    id: "b001",
    qr: "B001",
    title: "The Sun and the Rain",
    titleHi: "सूरज और बारिश",
    ageGroup: "tiny",
    cover: "🌤️",
    bgColor: "#FFF3E0",
    pages: [
      {
        en: "The sun woke up one morning.",
        hi: "एक सुबह सूरज उठा।",
        word: "sun",
        wordHi: "सूरज",
        emoji: "☀️",
      },
      {
        en: "He saw big dark clouds in the sky.",
        hi: "उसने आसमान में बड़े काले बादल देखे।",
        word: "clouds",
        wordHi: "बादल",
        emoji: "☁️",
      },
      {
        en: "Then it began to rain!",
        hi: "फिर बारिश शुरू हो गई!",
        word: "rain",
        wordHi: "बारिश",
        emoji: "🌧️",
      },
      {
        en: "After the rain, a rainbow appeared.",
        hi: "बारिश के बाद, इंद्रधनुष आया।",
        word: "rainbow",
        wordHi: "इंद्रधनुष",
        emoji: "🌈",
      },
    ],
  },
  {
    id: "b002",
    qr: "B002",
    title: "Riya's Little Garden",
    titleHi: "रिया का छोटा बगीचा",
    ageGroup: "early",
    cover: "🌿",
    bgColor: "#E8F5E9",
    pages: [
      {
        en: "Riya had a tiny garden behind her house.",
        hi: "रिया के घर के पीछे एक छोटा बगीचा था।",
        word: "garden",
        wordHi: "बगीचा",
        emoji: "🌱",
      },
      {
        en: "Every morning she watered her plants.",
        hi: "हर सुबह वह अपने पौधों को पानी देती थी।",
        word: "plants",
        wordHi: "पौधे",
        emoji: "🪴",
      },
      {
        en: "One day, a small bird came to visit.",
        hi: "एक दिन, एक छोटी चिड़िया आई।",
        word: "bird",
        wordHi: "चिड़िया",
        emoji: "🐦",
      },
      {
        en: "The bird sang a beautiful song for Riya.",
        hi: "चिड़िया ने रिया के लिए एक सुंदर गाना गाया।",
        word: "song",
        wordHi: "गाना",
        emoji: "🎵",
      },
    ],
  },
  {
    id: "b003",
    qr: "B003",
    title: "The Brave Little Star",
    titleHi: "साहसी छोटा तारा",
    ageGroup: "growing",
    cover: "⭐",
    bgColor: "#EDE7F6",
    pages: [
      {
        en: "High above the city, a little star felt lonely.",
        hi: "शहर के ऊपर, एक छोटा तारा अकेला महसूस करता था।",
        word: "lonely",
        wordHi: "अकेला",
        emoji: "⭐",
      },
      {
        en: "All the other stars seemed so much brighter.",
        hi: "बाकी सभी तारे बहुत ज़्यादा चमकीले लगते थे।",
        word: "brighter",
        wordHi: "चमकीले",
        emoji: "✨",
      },
      {
        en: "But one night, a child looked up and saw only him.",
        hi: "लेकिन एक रात, एक बच्चे ने ऊपर देखा और केवल उसे देखा।",
        word: "child",
        wordHi: "बच्चा",
        emoji: "🧒",
      },
      {
        en: "The star realised — even small lights matter.",
        hi: "तारे को समझ आया — छोटी रोशनी भी मायने रखती है।",
        word: "matter",
        wordHi: "मायने",
        emoji: "💡",
      },
    ],
  },
];

// ─── Speech Utility ───────────────────────────────────────────────────────────
function speak(text, lang = "en-IN", rate = 0.85, onEnd) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang;
  utt.rate = rate;
  utt.pitch = 1.1;
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
}

// ─── Components ───────────────────────────────────────────────────────────────

function StarBurst({ count = 6 }) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: ["#FFD700","#FF9B6A","#4BBFA5","#7B8FF5","#FF6B9D","#A8E6CF"][i % 6],
            top: `${10 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
            animation: `twinkle ${1.5 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

function AgeGroupSelector({ selected, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", margin: "24px 0" }}>
      {AGE_GROUPS.map((g) => (
        <button
          key={g.id}
          onClick={() => onSelect(g.id)}
          style={{
            border: `3px solid ${selected === g.id ? g.color : "transparent"}`,
            background: selected === g.id ? g.color + "22" : "#ffffff18",
            borderRadius: 20,
            padding: "10px 20px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            transition: "all 0.25s",
            transform: selected === g.id ? "scale(1.06)" : "scale(1)",
            backdropFilter: "blur(6px)",
          }}
        >
          <span style={{ fontSize: 28 }}>{g.emoji}</span>
          <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 14, color: "#2d2d2d", fontWeight: 700 }}>{g.label}</span>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "#666" }}>Ages {g.ages}</span>
        </button>
      ))}
    </div>
  );
}

function BookCard({ book, onOpen }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(book)}
      style={{
        background: book.bgColor,
        borderRadius: 24,
        padding: "28px 20px 20px",
        cursor: "pointer",
        textAlign: "center",
        transform: hover ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "all 0.3s cubic-bezier(.34,1.56,.64,1)",
        boxShadow: hover ? "0 20px 40px rgba(0,0,0,0.15)" : "0 4px 16px rgba(0,0,0,0.08)",
        border: "3px solid rgba(255,255,255,0.6)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ fontSize: 56, marginBottom: 12, display: "block" }}>{book.cover}</div>
      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 16, color: "#2d2d2d", lineHeight: 1.3, marginBottom: 4 }}>{book.title}</div>
      <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 13, color: "#555", marginBottom: 12 }}>{book.titleHi}</div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "#fff", borderRadius: 30, padding: "6px 14px",
        fontSize: 12, fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: "#555"
      }}>
        <span>📖</span> Read Aloud
      </div>
    </div>
  );
}

function QRScanner({ onScan }) {
  const [qrInput, setQrInput] = useState("");
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    const book = SAMPLE_BOOKS.find(b => b.qr === qrInput.toUpperCase().trim());
    if (book) { onScan(book); }
    else { alert("Book not found. Try B001, B002, or B003!"); }
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #1a1a2e, #16213e)",
      borderRadius: 28,
      padding: 32,
      textAlign: "center",
      color: "#fff",
      position: "relative",
      overflow: "hidden",
    }}>
      <StarBurst count={8} />
      <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, marginBottom: 8 }}>Scan Your Book's QR Code</div>
      <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: "#aaa", marginBottom: 20 }}>
        Find the QR code on the back of your library book!<br/>
        <span style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>अपनी किताब पर QR कोड खोजें!</span>
      </div>

      {/* Simulated QR frame */}
      <div style={{
        width: 160, height: 160, margin: "0 auto 20px",
        border: "3px solid #4BBFA5",
        borderRadius: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
        background: "#ffffff0a",
      }}>
        {["topLeft","topRight","bottomLeft","bottomRight"].map((corner, i) => (
          <div key={corner} style={{
            position: "absolute",
            width: 20, height: 20,
            border: "3px solid #FF9B6A",
            borderRadius: 2,
            top: i < 2 ? -2 : "auto",
            bottom: i >= 2 ? -2 : "auto",
            left: i % 2 === 0 ? -2 : "auto",
            right: i % 2 === 1 ? -2 : "auto",
            borderRight: i % 2 === 1 ? undefined : "none",
            borderLeft: i % 2 === 0 ? undefined : "none",
            borderBottom: i < 2 ? "none" : undefined,
            borderTop: i >= 2 ? "none" : undefined,
          }} />
        ))}
        <div style={{ fontSize: 12, color: "#aaa", fontFamily: "'Nunito', sans-serif" }}>
          {scanning ? "🔍 Scanning..." : "Camera here"}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "#aaa", marginBottom: 8 }}>
          Or type the Book Code (try: B001, B002, B003)
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <input
            value={qrInput}
            onChange={e => setQrInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleScan()}
            placeholder="Book code..."
            style={{
              background: "#ffffff15", border: "2px solid #4BBFA5",
              borderRadius: 12, padding: "10px 16px", color: "#fff",
              fontFamily: "'Nunito', sans-serif", fontSize: 15, width: 140,
              outline: "none",
            }}
          />
          <button
            onClick={handleScan}
            style={{
              background: "linear-gradient(135deg, #4BBFA5, #3aa890)",
              border: "none", borderRadius: 12, padding: "10px 20px",
              color: "#fff", fontFamily: "'Fredoka One', cursive", fontSize: 15,
              cursor: "pointer",
            }}
          >
            Open!
          </button>
        </div>
      </div>
    </div>
  );
}

function WordBadge({ word, wordHi, lang }) {
  const [bounce, setBounce] = useState(false);
  const handleClick = () => {
    setBounce(true);
    setTimeout(() => setBounce(false), 600);
    speak(lang === "en" ? word : wordHi, lang === "en" ? "en-IN" : "hi-IN", 0.75);
  };
  return (
    <button
      onClick={handleClick}
      style={{
        background: "linear-gradient(135deg, #FFD700, #FFA500)",
        border: "none", borderRadius: 30, padding: "8px 20px",
        fontFamily: lang === "en" ? "'Fredoka One', cursive" : "'Noto Sans Devanagari', sans-serif",
        fontSize: 18, color: "#2d2d2d", cursor: "pointer",
        transform: bounce ? "scale(1.3)" : "scale(1)",
        transition: "transform 0.2s cubic-bezier(.34,1.56,.64,1)",
        boxShadow: "0 4px 12px rgba(255,165,0,0.4)",
      }}
    >
      🔊 {lang === "en" ? word : wordHi}
    </button>
  );
}

function BookReader({ book, onClose }) {
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState(0);
  const [reading, setReading] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  const currentPage = book.pages[page];
  const isHindi = lang === "hi";

  const readPage = () => {
    setReading(true);
    const text = isHindi ? currentPage.hi : currentPage.en;
    const langCode = isHindi ? "hi-IN" : "en-IN";
    speak(text, langCode, 0.8, () => setReading(false));
  };

  const nextPage = () => {
    if (page < book.pages.length - 1) setPage(p => p + 1);
  };
  const prevPage = () => {
    if (page > 0) setPage(p => p - 1);
  };

  useEffect(() => {
    if (autoPlay) readPage();
  }, [page, autoPlay]);

  const progress = ((page + 1) / book.pages.length) * 100;

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "linear-gradient(160deg, #0f0c29, #302b63, #24243e)",
      zIndex: 999, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: 20, overflow: "auto",
    }}>
      <StarBurst count={14} />

      {/* Header */}
      <div style={{
        width: "100%", maxWidth: 680, display: "flex",
        justifyContent: "space-between", alignItems: "center", marginBottom: 20,
      }}>
        <button onClick={onClose} style={{
          background: "#ffffff15", border: "2px solid #ffffff30",
          borderRadius: 50, width: 44, height: 44, cursor: "pointer",
          color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center",
        }}>←</button>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", color: "#fff", fontSize: 18 }}>{book.title}</div>
          <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", color: "#aaa", fontSize: 13 }}>{book.titleHi}</div>
        </div>

        {/* Language toggle */}
        <div style={{
          background: "#ffffff15", borderRadius: 30,
          display: "flex", padding: 3, gap: 2,
          border: "2px solid #ffffff20",
        }}>
          {["en","hi"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              background: lang === l ? "#4BBFA5" : "transparent",
              border: "none", borderRadius: 24, padding: "6px 14px",
              color: "#fff", fontFamily: "'Fredoka One', cursive", fontSize: 13,
              cursor: "pointer", transition: "all 0.2s",
            }}>
              {l === "en" ? "🇬🇧 EN" : "🇮🇳 हिं"}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: "100%", maxWidth: 680, height: 6, background: "#ffffff15", borderRadius: 10, marginBottom: 24 }}>
        <div style={{
          width: `${progress}%`, height: "100%",
          background: "linear-gradient(90deg, #4BBFA5, #FFD700)",
          borderRadius: 10, transition: "width 0.4s",
        }} />
      </div>

      {/* Book page card */}
      <div style={{
        width: "100%", maxWidth: 680,
        background: book.bgColor,
        borderRadius: 32, padding: "40px 36px",
        textAlign: "center",
        boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
        position: "relative",
        minHeight: 320,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 20,
      }}>
        <div style={{ fontSize: 72 }}>{currentPage.emoji}</div>

        <div style={{
          fontFamily: isHindi ? "'Noto Sans Devanagari', sans-serif" : "'Fredoka One', cursive",
          fontSize: isHindi ? 22 : 26,
          color: "#1a1a2e",
          lineHeight: 1.5,
          maxWidth: 480,
        }}>
          {isHindi ? currentPage.hi : currentPage.en}
        </div>

        <WordBadge word={currentPage.word} wordHi={currentPage.wordHi} lang={lang} />

        <div style={{ fontSize: 13, color: "#888", fontFamily: "'Nunito', sans-serif" }}>
          👆 Tap the word to hear it!
        </div>
      </div>

      {/* Controls */}
      <div style={{
        width: "100%", maxWidth: 680,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 24, gap: 12, flexWrap: "wrap",
      }}>
        <button onClick={prevPage} disabled={page === 0} style={{
          background: page === 0 ? "#ffffff0a" : "#ffffff20",
          border: "2px solid #ffffff30", borderRadius: 16,
          padding: "12px 24px", color: page === 0 ? "#555" : "#fff",
          fontFamily: "'Fredoka One', cursive", fontSize: 16,
          cursor: page === 0 ? "not-allowed" : "pointer",
        }}>← Back</button>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={readPage} style={{
            background: reading
              ? "linear-gradient(135deg, #FF9B6A, #FF6B4A)"
              : "linear-gradient(135deg, #4BBFA5, #3aa890)",
            border: "none", borderRadius: 16, padding: "12px 24px",
            color: "#fff", fontFamily: "'Fredoka One', cursive", fontSize: 16,
            cursor: "pointer", boxShadow: "0 6px 20px rgba(75,191,165,0.4)",
          }}>
            {reading ? "🔊 Reading..." : "🔊 Read to Me"}
          </button>

          <button onClick={() => setAutoPlay(!autoPlay)} style={{
            background: autoPlay ? "linear-gradient(135deg, #7B8FF5, #5B6FE5)" : "#ffffff15",
            border: "2px solid #ffffff30", borderRadius: 16, padding: "12px 20px",
            color: "#fff", fontFamily: "'Fredoka One', cursive", fontSize: 14,
            cursor: "pointer",
          }}>
            {autoPlay ? "⏸ Auto" : "▶ Auto"}
          </button>
        </div>

        <button onClick={nextPage} disabled={page === book.pages.length - 1} style={{
          background: page === book.pages.length - 1 ? "#ffffff0a" : "linear-gradient(135deg, #FFD700, #FFA500)",
          border: "2px solid #ffffff30", borderRadius: 16,
          padding: "12px 24px", color: page === book.pages.length - 1 ? "#555" : "#1a1a2e",
          fontFamily: "'Fredoka One', cursive", fontSize: 16,
          cursor: page === book.pages.length - 1 ? "not-allowed" : "pointer",
        }}>
          {page === book.pages.length - 1 ? "🎉 Done!" : "Next →"}
        </button>
      </div>

      {/* Page indicator */}
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        {book.pages.map((_, i) => (
          <div key={i} onClick={() => setPage(i)} style={{
            width: i === page ? 24 : 10, height: 10, borderRadius: 10,
            background: i === page ? "#FFD700" : "#ffffff30",
            cursor: "pointer", transition: "all 0.3s",
          }} />
        ))}
      </div>

      {page === book.pages.length - 1 && (
        <div style={{
          marginTop: 24, background: "linear-gradient(135deg, #FFD700, #FF9B6A)",
          borderRadius: 24, padding: "20px 36px", textAlign: "center",
          maxWidth: 500,
        }}>
          <div style={{ fontSize: 40 }}>🎉⭐🎉</div>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#1a1a2e" }}>
            You finished the book!
          </div>
          <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: 16, color: "#2d2d2d", marginTop: 4 }}>
            तुमने किताब पूरी कर ली! शाबाश! 🌟
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function ReadAlongApp() {
  const [screen, setScreen] = useState("home"); // home | qr | browse
  const [ageFilter, setAgeFilter] = useState(null);
  const [activeBook, setActiveBook] = useState(null);
  const [globalLang, setGlobalLang] = useState("en");

  const filteredBooks = ageFilter
    ? SAMPLE_BOOKS.filter(b => b.ageGroup === ageFilter)
    : SAMPLE_BOOKS;

  if (activeBook) return <BookReader book={activeBook} onClose={() => setActiveBook(null)} />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;900&family=Noto+Sans+Devanagari:wght@400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f0c29; }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .float { animation: float 3s ease-in-out infinite; }
        .slide-up { animation: slideUp 0.5s ease forwards; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0f0c29, #302b63, #24243e)",
        fontFamily: "'Nunito', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}>
        <StarBurst count={20} />

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px 60px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", paddingTop: 40, paddingBottom: 8 }}>
            <div className="float" style={{ fontSize: 64, marginBottom: 8 }}>📚</div>
            <h1 style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: "clamp(32px, 8vw, 52px)",
              background: "linear-gradient(135deg, #FFD700, #FF9B6A, #FF6B9D)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              lineHeight: 1.1, marginBottom: 8,
            }}>
              ReadAlong
            </h1>
            <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", color: "#aaa", fontSize: 15, marginBottom: 4 }}>
              पढ़ना सीखो, दुनिया जानो ✨
            </div>
            <div style={{ color: "#888", fontSize: 13, fontFamily: "'Nunito', sans-serif" }}>
              Learn to Read · सुनो, पढ़ो, समझो
            </div>
          </div>

          {/* Nav */}
          <div style={{ display: "flex", justifyContent: "center", gap: 10, margin: "28px 0 8px", flexWrap: "wrap" }}>
            {[
              { id: "home", label: "🏠 Home", labelHi: "घर" },
              { id: "qr", label: "📷 Scan Book", labelHi: "किताब स्कैन" },
              { id: "browse", label: "📖 Browse", labelHi: "किताबें देखें" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setScreen(tab.id)}
                style={{
                  background: screen === tab.id
                    ? "linear-gradient(135deg, #4BBFA5, #3aa890)"
                    : "#ffffff12",
                  border: "2px solid",
                  borderColor: screen === tab.id ? "#4BBFA5" : "#ffffff20",
                  borderRadius: 30, padding: "10px 22px",
                  color: "#fff", cursor: "pointer",
                  fontFamily: "'Fredoka One', cursive", fontSize: 14,
                  transition: "all 0.25s",
                  backdropFilter: "blur(6px)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Home Screen ── */}
          {screen === "home" && (
            <div className="slide-up">
              {/* Hero CTA */}
              <div style={{
                background: "linear-gradient(135deg, #FF9B6A22, #FFD70022)",
                border: "2px solid #FFD70033",
                borderRadius: 28, padding: "32px 28px",
                textAlign: "center", marginTop: 20, marginBottom: 24,
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🌟</div>
                <div style={{ fontFamily: "'Fredoka One', cursive", color: "#FFD700", fontSize: 26, marginBottom: 8 }}>
                  Every story is a new adventure!
                </div>
                <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", color: "#aaa", fontSize: 15, marginBottom: 20 }}>
                  हर कहानी एक नई यात्रा है!
                </div>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setScreen("qr")} style={{
                    background: "linear-gradient(135deg, #FFD700, #FF9B6A)",
                    border: "none", borderRadius: 20, padding: "14px 28px",
                    fontFamily: "'Fredoka One', cursive", fontSize: 17,
                    color: "#1a1a2e", cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(255,215,0,0.4)",
                  }}>
                    📷 Scan My Book
                  </button>
                  <button onClick={() => setScreen("browse")} style={{
                    background: "#ffffff15",
                    border: "2px solid #ffffff30", borderRadius: 20, padding: "14px 28px",
                    fontFamily: "'Fredoka One', cursive", fontSize: 17,
                    color: "#fff", cursor: "pointer",
                  }}>
                    📚 Browse Books
                  </button>
                </div>
              </div>

              {/* Feature tiles */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { icon: "🔊", title: "Read Aloud", titleHi: "ज़ोर से पढ़ो", desc: "Books read to you in English & Hindi", color: "#4BBFA5" },
                  { icon: "🌟", title: "Word of the Page", titleHi: "पेज का शब्द", desc: "Tap a word to hear it spoken clearly", color: "#FF9B6A" },
                  { icon: "🇮🇳", title: "Hindi & English", titleHi: "हिंदी और अंग्रेजी", desc: "Switch languages anytime, freely", color: "#7B8FF5" },
                  { icon: "📷", title: "QR Scan", titleHi: "QR स्कैन", desc: "Scan library books to open instantly", color: "#FF6B9D" },
                ].map((f, i) => (
                  <div key={i} style={{
                    background: f.color + "18",
                    border: `2px solid ${f.color}44`,
                    borderRadius: 20, padding: "20px 16px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{f.icon}</div>
                    <div style={{ fontFamily: "'Fredoka One', cursive", color: "#fff", fontSize: 15, marginBottom: 2 }}>{f.title}</div>
                    <div style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", color: f.color, fontSize: 11, marginBottom: 6 }}>{f.titleHi}</div>
                    <div style={{ fontSize: 11, color: "#aaa", fontFamily: "'Nunito', sans-serif", lineHeight: 1.4 }}>{f.desc}</div>
                  </div>
                ))}
              </div>

              {/* Age groups */}
              <div style={{ marginTop: 28 }}>
                <div style={{
                  fontFamily: "'Fredoka One', cursive", color: "#fff",
                  fontSize: 18, textAlign: "center", marginBottom: 16,
                }}>
                  Who's reading today? 📖
                </div>
                <AgeGroupSelector selected={ageFilter} onSelect={id => { setAgeFilter(id === ageFilter ? null : id); setScreen("browse"); }} />
              </div>
            </div>
          )}

          {/* ── QR Scanner Screen ── */}
          {screen === "qr" && (
            <div className="slide-up" style={{ marginTop: 24 }}>
              <QRScanner onScan={(book) => { setActiveBook(book); }} />
              <div style={{
                marginTop: 20, background: "#ffffff08",
                borderRadius: 20, padding: "16px 20px",
                border: "2px solid #ffffff15",
              }}>
                <div style={{ fontFamily: "'Fredoka One', cursive", color: "#FFD700", fontSize: 15, marginBottom: 8 }}>
                  💡 How it works
                </div>
                <div style={{ fontSize: 13, color: "#aaa", fontFamily: "'Nunito', sans-serif", lineHeight: 1.8 }}>
                  1. Get a book from your library<br />
                  2. Find the QR code on the back cover<br />
                  3. Scan it with this app<br />
                  4. The book will read itself to you!<br />
                  <span style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>5. हिंदी या अंग्रेजी में सुनो!</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Browse Screen ── */}
          {screen === "browse" && (
            <div className="slide-up" style={{ marginTop: 20 }}>
              <div style={{ fontFamily: "'Fredoka One', cursive", color: "#fff", fontSize: 18, textAlign: "center", marginBottom: 4 }}>
                Choose your reading level 📚
              </div>
              <AgeGroupSelector selected={ageFilter} onSelect={id => setAgeFilter(id === ageFilter ? null : id)} />

              {ageFilter && (
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <span style={{
                    background: AGE_GROUPS.find(g => g.id === ageFilter)?.color + "33",
                    border: `2px solid ${AGE_GROUPS.find(g => g.id === ageFilter)?.color}66`,
                    borderRadius: 30, padding: "6px 18px",
                    color: "#fff", fontSize: 13, fontFamily: "'Nunito', sans-serif",
                  }}>
                    Showing: {AGE_GROUPS.find(g => g.id === ageFilter)?.label} (Ages {AGE_GROUPS.find(g => g.id === ageFilter)?.ages})
                    <button onClick={() => setAgeFilter(null)} style={{
                      background: "none", border: "none", color: "#aaa",
                      marginLeft: 8, cursor: "pointer", fontSize: 14,
                    }}>✕</button>
                  </span>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
                {filteredBooks.map(book => (
                  <BookCard key={book.id} book={book} onOpen={setActiveBook} />
                ))}
              </div>

              {filteredBooks.length === 0 && (
                <div style={{ textAlign: "center", color: "#aaa", padding: 40, fontFamily: "'Fredoka One', cursive", fontSize: 18 }}>
                  No books found for this age group yet! 🌱<br />
                  <span style={{ fontSize: 13, fontFamily: "'Nunito', sans-serif" }}>More coming soon!</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

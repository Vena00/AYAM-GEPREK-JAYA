import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory review storage seeded with initial reviews
const reviewsStore = [
  {
    id: "rev-1",
    name: "Budi Santoso",
    rating: 5,
    comment: "Gila sih ini ayam gepreknya bener-bener garing luar dalam! Sambal bawang level 5 udah bikin mandi keringat tapi nagih banget. Mozzarella-nya melimpah!",
    date: "2026-07-01",
    spicyLevel: 5,
    orderedItem: "Ayam Geprek Mozzarella Melt"
  },
  {
    id: "rev-2",
    name: "Siti Rahmawati",
    rating: 5,
    comment: "Pesen Paket Hemat Jaya buat makan siang di kantor, porsinya pas banget kenyang dan es teh jumbonya beneran jumbo! Sambal ijonya seger banget.",
    date: "2026-07-03",
    spicyLevel: 3,
    orderedItem: "Paket Jaya Hemat"
  },
  {
    id: "rev-3",
    name: "Adi Prasetyo",
    rating: 4,
    comment: "Sangat terbantu sama fitur rekomendasi AI buat nentuin level pedas! Dicocokin sama mood saya yang lagi stres, disuruh makan level 7 plus kol goreng garing. Mantap pol!",
    date: "2026-07-04",
    spicyLevel: 7,
    orderedItem: "Ayam Geprek Original Jaya"
  },
  {
    id: "rev-4",
    name: "Jessica Clarissa",
    rating: 5,
    comment: "Ayam Geprek Saus Telur Asinnya juara banget. Creamy tapi pedesnya tetep berasa. Kulit krispinya juga super renyah gak alot.",
    date: "2026-07-04",
    spicyLevel: 2,
    orderedItem: "Ayam Geprek Saus Telur Asin"
  }
];

// Lazy Gemini API Client Initialization
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY environment variable is not defined. AI features will run in fallback simulation mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API: Get Reviews
app.get("/api/reviews", (req, res) => {
  res.json(reviewsStore);
});

// API: Add Review
app.post("/api/reviews", (req, res) => {
  const { name, rating, comment, spicyLevel, orderedItem } = req.body;
  if (!name || !rating || !comment) {
    return res.status(400).json({ error: "Name, rating, and comment are required." });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    name,
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split("T")[0],
    spicyLevel: Number(spicyLevel || 0),
    orderedItem: orderedItem || "Ayam Geprek Original Jaya"
  };

  reviewsStore.unshift(newReview);
  res.status(201).json(newReview);
});

// API: Get AI Recommendation for Sambal Level & Menu
app.post("/api/recommend", async (req, res) => {
  const { favoriteFoods, chiliTolerance, currentMood, preferences } = req.body;

  const ai = getAI();

  if (!ai) {
    // Elegant fallback simulation in Indonesian if GEMINI_API_KEY is not defined
    const menus = ['geprek-original', 'geprek-mozarella', 'geprek-keju', 'geprek-sambal-ijo', 'geprek-saus-telur-asin', 'paket-jaya-hemat', 'paket-jaya-kenyang'];
    const randomMenu = menus[Math.floor(Math.random() * menus.length)];
    
    let simulatedLevel = 3;
    if (chiliTolerance === 'none') simulatedLevel = 0;
    else if (chiliTolerance === 'low') simulatedLevel = 2;
    else if (chiliTolerance === 'medium') simulatedLevel = 5;
    else if (chiliTolerance === 'high') simulatedLevel = 8;
    else if (chiliTolerance === 'expert') simulatedLevel = 10;

    let reason = `Berdasarkan toleransi pedasmu yang berada di tingkat '${chiliTolerance}' serta mood-mu yang sedang '${currentMood || 'santai'}', chef merekomendasikan hidangan ini! Perpaduan rasa gurih renyah ayam goreng krispi dengan sambal istimewa akan meningkatkan semangat belajarmu.`;
    let tips = "Tambahkan Kol Goreng Krispi dan Es Teh Manis Jumbo untuk sensasi makan geprek yang paripurna dan seimbang!";

    if (currentMood?.toLowerCase().includes("stres") || currentMood?.toLowerCase().includes("sedih") || currentMood?.toLowerCase().includes("lelah")) {
      simulatedLevel = Math.min(simulatedLevel + 2, 10);
      reason = `Kami mendeteksi kamu sedang merasa '${currentMood}'. Cabai mengandung kapsaisin yang melepaskan hormon endorfin! Nikmati tingkat kepedasan level ${simulatedLevel} ini untuk membakar rasa lelahmu secara instan dan membangkitkan kebahagiaan!`;
    }

    return res.json({
      recommendedMenuId: randomMenu,
      recommendedLevel: simulatedLevel,
      reasonIndonesian: reason,
      chefTips: tips
    });
  }

  try {
    const prompt = `
      Anda adalah "Chef Sambal Sommelier" di kedai "Ayam Geprek Jaya".
      Tugas Anda adalah merekomendasikan satu menu terbaik dan level kepedasan cabai yang pas untuk pelanggan berdasarkan preferensi mereka.
      
      Data Pelanggan:
      - Makanan Favorit Sebelumnya: ${favoriteFoods || "Tidak disebutkan"}
      - Toleransi Cabai/Pedas: ${chiliTolerance} (none = level 0, low = level 1-2, medium = level 3-5, high = level 6-8, expert = level 9-10+)
      - Mood saat ini: ${currentMood || "Biasa saja"}
      - Preferensi Tambahan: ${preferences ? preferences.join(", ") : "Tidak ada"}

      Pilihan Menu Utama yang tersedia di Ayam Geprek Jaya:
      1. 'geprek-original' (Ayam Geprek Original Jaya - pedas gurih sambal bawang)
      2. 'geprek-mozarella' (Ayam Geprek Mozzarella Melt - pedas dengan lelehan mozzarella)
      3. 'geprek-keju' (Ayam Geprek Keju Parut - pedas gurih dengan keju parut cheddar)
      4. 'geprek-sambal-ijo' (Ayam Geprek Sambal Ijo - aroma wangi jeruk limau, rasa segar)
      5. 'geprek-saus-telur-asin' (Ayam Geprek Saus Telur Asin - gurih creamy asin)
      6. 'paket-jaya-hemat' (Nasi + Geprek Original + Es Teh Manis Jumbo)
      7. 'paket-jaya-kenyang' (Nasi + Geprek Mozzarella + Tahu/Tempe + Es Jeruk)

      Aturan Rekomendasi:
      - Berikan 'recommendedMenuId' yang HARUS persis sama dengan salah satu id menu di atas (misal: 'geprek-mozarella').
      - Tentukan 'recommendedLevel' (angka bulat antara 0 sampai 10). Jika toleransi pedas adalah 'none', level harus 0. Jika 'expert' dan mood sedang stres, beri level tinggi (8-10) untuk sensasi pembakar stres!
      - Tulis 'reasonIndonesian' dalam Bahasa Indonesia yang sangat menggugah selera, hangat, bersahabat, sedikit jenaka, dan meyakinkan pelanggan kenapa menu dan level pedas tersebut sangat cocok untuk mood mereka saat ini.
      - Tulis 'chefTips' berisi tips pelengkap (seperti memesan Kol Goreng Krispi, Kulit Ayam, Es Teh Manis, Susu Netralisir, atau ekstra topping) agar pengalaman makan makin legendaris.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedMenuId: {
              type: Type.STRING,
              description: "Must be one of the specified menu ids: 'geprek-original', 'geprek-mozarella', 'geprek-keju', 'geprek-sambal-ijo', 'geprek-saus-telur-asin', 'paket-jaya-hemat', 'paket-jaya-kenyang'"
            },
            recommendedLevel: {
              type: Type.INTEGER,
              description: "Recommended chili level from 0 to 10."
            },
            reasonIndonesian: {
              type: Type.STRING,
              description: "Appetizing explanation in Indonesian matching user's mood and taste preference."
            },
            chefTips: {
              type: Type.STRING,
              description: "A friendly tip in Indonesian on side dishes or toppings to add."
            }
          },
          required: ["recommendedMenuId", "recommendedLevel", "reasonIndonesian", "chefTips"]
        }
      }
    });

    const resultText = response.text;
    if (resultText) {
      const parsed = JSON.parse(resultText.trim());
      res.json(parsed);
    } else {
      throw new Error("Empty response from AI model.");
    }
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    res.status(500).json({ error: "Failed to fetch AI recommendation." });
  }
});

// Serve frontend assets
async function startServer() {
  // Vite integration in development mode
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();

import { useState } from "react";
import { Coffee, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UnderConstruction() {
  const [coffeeCount, setCoffeeCount] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [motivationalText, setMotivationalText] = useState("");

  const motivationalTexts = [
    "Semangat bang programmer!",
    "Kopi lagi, kopi lagi!",
    "Bug fixing in progress...",
    "Ctrl+C, Ctrl+V, repeat",
    "Stack Overflow is my bestie",
    "Debugging since 1999",
    "Coffee.exe has stopped working",
  ];

  const handleCoffeeClick = () => {
    setCoffeeCount((prev) => prev + clickPower);
    setIsAnimating(true);

    // Random motivational text
    const randomText =
      motivationalTexts[Math.floor(Math.random() * motivationalTexts.length)];
    setMotivationalText(randomText);

    setTimeout(() => {
      setIsAnimating(false);
      setMotivationalText("");
    }, 1000);

    // Upgrade click power every 50 coffees
    if ((coffeeCount + clickPower) % 50 === 0) {
      setClickPower((prev) => prev + 1);
    }
  };

  const getProgressStatus = () => {
    if (coffeeCount < 10) return "Baru bangun tidur...";
    if (coffeeCount < 50) return "Mulai ngoding dikit...";
    if (coffeeCount < 100) return "Debugging mode: ON";
    if (coffeeCount < 200) return "Stackoverflow intensifies...";
    if (coffeeCount < 347) return "Hampir breakthrough...";
    return "Fitur mungkin akan segera hadir!";
  };

  const getProgressPercentage = () => {
    return Math.min((coffeeCount / 347) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Berharap apa?
              <br />
              <span className="text-purple-600">Yang bikin web</span>
              <br />
              <span className="text-gray-700">cuma satu orang.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              Fitur akan hadir… mungkin setelah kopi ke-347.
            </p>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Status: Ngoding sambil nangis</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                <span>Progress: {getProgressPercentage().toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Coffee Clicker Game */}
          <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-purple-300 transition-colors">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  Bantu Programmer Minum Kopi
                </h3>
                <p className="text-sm text-gray-600">
                  Klik untuk memberikan semangat!
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="text-3xl font-bold text-purple-600">
                  {coffeeCount} / 347
                </div>

                <Button
                  onClick={handleCoffeeClick}
                  size="lg"
                  className={`w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg transform transition-all duration-200 ${
                    isAnimating ? "scale-110 shadow-xl" : "hover:scale-105"
                  }`}
                >
                  <Coffee className="h-8 w-8" />
                </Button>

                {motivationalText && (
                  <div className="text-sm font-medium text-purple-600 animate-bounce">
                    {motivationalText}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    {getProgressStatus()}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                </div>

                {clickPower > 1 && (
                  <div className="text-xs text-green-600 font-medium">
                    Upgrade! Klik power: {clickPower}x
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Updates */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="bg-white/60 backdrop-blur-sm border border-gray-200">
              <CardContent className="p-6 text-center space-y-2">
                <div className="text-2xl">🚧</div>
                <h4 className="font-semibold text-gray-800">
                  Under Construction
                </h4>
                <p className="text-sm text-gray-600">
                  Masih dibangun dengan penuh perjuangan
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border border-gray-200">
              <CardContent className="p-6 text-center space-y-2">
                <div className="text-2xl">💸</div>
                <h4 className="font-semibold text-gray-800">Budget Terbatas</h4>
                <p className="text-sm text-gray-600">
                  Hosting gratisan, Gaji Dibawah Standard, Jobdesk Segudang
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border border-gray-200">
              <CardContent className="p-6 text-center space-y-2">
                <div className="text-2xl">⏰</div>
                <h4 className="font-semibold text-gray-800">Coming Soon™</h4>
                <p className="text-sm text-gray-600">
                  Fitur akan hadir... suatu hari nanti
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Footer Message */}
          <div className="space-y-4 text-center">
            <p className="text-gray-600 max-w-2xl mx-auto">
              Terima kasih sudah berkunjung ke website yang masih setengah jadi
              ini. Mohon bersabar ya, yang ngerjain cuma satu orang dan masih
              harus cari makan juga.
            </p>
            <p className="text-sm text-gray-500">
              P.S: Kalau mau donasi kopi, silakan... tapi jangan berharap fitur
              cepat selesai 😅
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          <p>
            Dibuat dengan cinta (dan banyak kopi) oleh 1 programmer yang gigih
          </p>
        </div>
      </footer>
    </div>
  );
}

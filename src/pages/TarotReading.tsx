import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface TarotCard {
  name: string;
  image: string;
  upright: string;
  reversed: string;
  description: string;
}

const majorArcana: TarotCard[] = [
  { name: "The Fool", image: "🃏", upright: "New beginnings, innocence, spontaneity", reversed: "Recklessness, risk-taking, holding back", description: "The Fool represents new beginnings and unlimited potential. Trust the journey ahead." },
  { name: "The Magician", image: "🎩", upright: "Manifestation, resourcefulness, power", reversed: "Manipulation, poor planning, untapped talents", description: "The Magician reminds you that you have all the tools you need to succeed." },
  { name: "The High Priestess", image: "🌙", upright: "Intuition, mystery, inner knowledge", reversed: "Secrets, disconnected from intuition", description: "The High Priestess urges you to trust your inner voice and intuition." },
  { name: "The Empress", image: "👑", upright: "Fertility, beauty, nature, abundance", reversed: "Creative block, dependence on others", description: "The Empress brings nurturing energy and creative abundance into your life." },
  { name: "The Emperor", image: "🏛️", upright: "Authority, structure, control, leadership", reversed: "Domination, rigidity, lack of discipline", description: "The Emperor represents structure, stability, and taking control of your destiny." },
  { name: "The Hierophant", image: "📖", upright: "Spiritual wisdom, tradition, conformity", reversed: "Personal beliefs, freedom, challenging status quo", description: "The Hierophant guides you toward spiritual wisdom and traditional values." },
  { name: "The Lovers", image: "💕", upright: "Love, harmony, relationships, values", reversed: "Self-love, disharmony, misalignment", description: "The Lovers card speaks of deep connections and important choices in love." },
  { name: "The Chariot", image: "⚡", upright: "Control, willpower, success, determination", reversed: "Self-discipline, opposition, lack of direction", description: "The Chariot signals victory through determination and willpower." },
  { name: "Strength", image: "🦁", upright: "Courage, patience, compassion, inner strength", reversed: "Self-doubt, weakness, insecurity", description: "Strength reminds you that true power comes from within — courage and compassion." },
  { name: "The Hermit", image: "🏔️", upright: "Soul searching, introspection, guidance", reversed: "Isolation, loneliness, withdrawal", description: "The Hermit encourages you to seek answers within through meditation and reflection." },
  { name: "Wheel of Fortune", image: "🎡", upright: "Good luck, karma, destiny, turning point", reversed: "Bad luck, resistance to change", description: "The Wheel of Fortune signals a turning point — embrace the changes coming your way." },
  { name: "Justice", image: "⚖️", upright: "Fairness, truth, cause and effect", reversed: "Unfairness, lack of accountability", description: "Justice brings truth and fairness. Your actions will have consequences — act wisely." },
  { name: "The Hanged Man", image: "🔄", upright: "Pause, surrender, new perspective", reversed: "Delays, resistance, stalling", description: "The Hanged Man asks you to pause, let go, and see things from a new perspective." },
  { name: "Death", image: "🦋", upright: "Endings, change, transformation, transition", reversed: "Resistance to change, personal transformation", description: "Death doesn't mean literal death — it represents transformation and new beginnings." },
  { name: "Temperance", image: "🌈", upright: "Balance, moderation, patience, purpose", reversed: "Imbalance, excess, self-healing", description: "Temperance calls for balance, patience, and moderation in all areas of life." },
  { name: "The Devil", image: "⛓️", upright: "Shadow self, attachment, addiction", reversed: "Releasing limiting beliefs, freedom", description: "The Devil warns of unhealthy attachments — break free from what holds you back." },
  { name: "The Tower", image: "🗼", upright: "Sudden change, upheaval, revelation", reversed: "Personal transformation, fear of change", description: "The Tower brings sudden change — though painful, it clears the way for growth." },
  { name: "The Star", image: "⭐", upright: "Hope, faith, purpose, renewal", reversed: "Lack of faith, despair, self-trust", description: "The Star brings hope and inspiration. Trust in the universe's plan for you." },
  { name: "The Moon", image: "🌕", upright: "Illusion, fear, anxiety, subconscious", reversed: "Release of fear, unhappiness, confusion", description: "The Moon reveals hidden truths — trust your instincts to navigate uncertainty." },
  { name: "The Sun", image: "☀️", upright: "Positivity, warmth, success, vitality", reversed: "Inner child, overly optimistic", description: "The Sun brings joy, success, and vitality. Embrace the positive energy around you." },
  { name: "Judgement", image: "📯", upright: "Rebirth, inner calling, absolution", reversed: "Self-doubt, inner critic, ignoring the call", description: "Judgement calls you to reflect on your past and rise to your higher purpose." },
  { name: "The World", image: "🌍", upright: "Completion, integration, accomplishment", reversed: "Seeking personal closure, shortcuts", description: "The World represents completion and achievement. You've come full circle." },
];

const TarotReading = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCards, setSelectedCards] = useState<(TarotCard & { isReversed: boolean })[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const drawCards = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    setIsDrawing(true);
    setIsRevealed(false);
    
    const shuffled = [...majorArcana].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, 3).map(card => ({
      ...card,
      isReversed: Math.random() > 0.7,
    }));
    
    setTimeout(() => {
      setSelectedCards(drawn);
      setIsDrawing(false);
    }, 1500);
  };

  const revealCards = () => {
    setIsRevealed(true);
  };

  const positions = ["Past", "Present", "Future"];

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            ✨ Tarot Reading ✨
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Draw three cards to reveal insights about your past, present, and future. Let the cosmos guide you.
          </p>
        </div>

        <div className="text-center mb-8">
          <Button onClick={drawCards} variant="cosmic" size="lg" disabled={isDrawing} className="gap-2">
            {isDrawing ? (
              <><RotateCcw className="h-5 w-5 animate-spin" /> Shuffling...</>
            ) : selectedCards.length > 0 ? (
              <><RotateCcw className="h-5 w-5" /> Draw Again</>
            ) : (
              <><Sparkles className="h-5 w-5" /> Draw Your Cards</>
            )}
          </Button>
        </div>

        {selectedCards.length > 0 && (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {selectedCards.map((card, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all duration-500 hover:scale-105 border-2 ${
                    isRevealed ? "border-primary" : "border-border hover:border-primary/50"
                  }`}
                  onClick={revealCards}
                >
                  <CardHeader className="text-center pb-2">
                    <p className="text-sm font-semibold text-primary">{positions[index]}</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    {isRevealed ? (
                      <div className="space-y-3 animate-in fade-in duration-500">
                        <div className={`text-6xl ${card.isReversed ? "rotate-180" : ""}`}>{card.image}</div>
                        <CardTitle className="text-lg">
                          {card.name} {card.isReversed && <span className="text-xs text-muted-foreground">(Reversed)</span>}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{card.description}</p>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs font-semibold text-primary mb-1">
                            {card.isReversed ? "Reversed Meaning" : "Upright Meaning"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {card.isReversed ? card.reversed : card.upright}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-6xl">🂠</div>
                        <p className="text-sm text-muted-foreground">Tap to reveal</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {!isRevealed && (
              <div className="text-center">
                <Button onClick={revealCards} variant="outline" size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" /> Reveal All Cards
                </Button>
              </div>
            )}

            {isRevealed && (
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="text-center text-primary">🔮 Your Reading Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedCards.map((card, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <span className="text-2xl">{card.image}</span>
                      <div>
                        <p className="font-semibold">
                          {positions[index]}: {card.name} {card.isReversed && "(Reversed)"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {card.isReversed ? card.reversed : card.upright}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="bg-primary/5 rounded-lg p-4 mt-4">
                    <p className="text-sm font-medium text-primary mb-1">✨ Cosmic Guidance</p>
                    <p className="text-sm text-muted-foreground">
                      Your cards suggest a journey from {selectedCards[0]?.isReversed ? "overcoming challenges in your past" : "building on past strengths"}, 
                      through {selectedCards[1]?.isReversed ? "navigating current obstacles" : "embracing present opportunities"}, 
                      toward {selectedCards[2]?.isReversed ? "transforming future uncertainties into growth" : "a bright and promising future"}.
                      Trust the path the universe has laid out for you.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TarotReading;

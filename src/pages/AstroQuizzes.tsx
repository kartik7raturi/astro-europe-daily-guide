import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Brain, Star, Heart, Share2, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  quiz_type: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer?: number;
  points?: { [key: number]: number };
}

interface QuizResult {
  score: number;
  result_text: string;
  shareable_result: string;
}

const AstroQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadQuizzes();
    initializeDefaultQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('astrology_quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes((data || []) as unknown as Quiz[]);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    }
  };

  const initializeDefaultQuizzes = async () => {
    try {
      const { data: existingQuizzes } = await supabase
        .from('astrology_quizzes')
        .select('id')
        .limit(1);

      if (existingQuizzes && existingQuizzes.length > 0) return;

      const defaultQuizzes = [
        {
          title: "When Will You Meet The One?",
          description: "Discover the cosmic timing of your soulmate encounter",
          quiz_type: "love_timing",
          questions: [
            {
              question: "What's your zodiac sign's element?",
              options: ["Fire", "Earth", "Air", "Water"],
              points: { 0: 3, 1: 1, 2: 4, 3: 2 }
            },
            {
              question: "What attracts you most in a partner?",
              options: ["Intelligence", "Kindness", "Humor", "Passion"],
              points: { 0: 2, 1: 1, 2: 4, 3: 3 }
            },
            {
              question: "Where do you feel most yourself?",
              options: ["In nature", "At social events", "At home", "Traveling"],
              points: { 0: 1, 1: 4, 2: 2, 3: 3 }
            },
            {
              question: "What's your ideal first date?",
              options: ["Coffee and deep conversation", "Adventure activity", "Romantic dinner", "Art gallery or museum"],
              points: { 0: 2, 1: 3, 2: 1, 3: 4 }
            }
          ]
        },
        {
          title: "Which Sign Is Your Cosmic BFF?",
          description: "Find out which zodiac sign makes the perfect friend for you",
          quiz_type: "friendship",
          questions: [
            {
              question: "What do you value most in friendship?",
              options: ["Loyalty", "Fun adventures", "Deep conversations", "Mutual support"],
              points: { 0: 1, 1: 2, 2: 3, 3: 4 }
            },
            {
              question: "How do you handle conflict with friends?",
              options: ["Direct confrontation", "Avoid until it passes", "Talk it through calmly", "Use humor to defuse"],
              points: { 0: 1, 1: 4, 2: 3, 3: 2 }
            },
            {
              question: "What's your ideal weekend with friends?",
              options: ["Outdoor adventure", "Cozy movie night", "Exploring new places", "Deep philosophical discussions"],
              points: { 0: 1, 1: 4, 2: 2, 3: 3 }
            }
          ]
        }
      ];

      for (const quiz of defaultQuizzes) {
        await supabase
          .from('astrology_quizzes')
          .insert(quiz);
      }

      loadQuizzes();
    } catch (error) {
      console.error('Error initializing quizzes:', error);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
    setResult(null);
  };

  const selectAnswer = (answerIndex: number) => {
    setAnswers({ ...answers, [currentQuestion]: answerIndex });
  };

  const nextQuestion = () => {
    if (!currentQuiz) return;

    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = async () => {
    if (!currentQuiz) return;

    setLoading(true);
    try {
      // Calculate score based on quiz type
      let totalScore = 0;
      currentQuiz.questions.forEach((question, index) => {
        const answerIndex = answers[index];
        if (question.points && answerIndex !== undefined) {
          totalScore += question.points[answerIndex] || 0;
        }
      });

      const result = generateResult(currentQuiz, totalScore);
      setResult(result);
      setQuizCompleted(true);

      // Save result to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('quiz_results')
          .insert({
            user_id: user.id,
            quiz_id: currentQuiz.id,
            answers: answers,
            result_text: result.result_text,
            score: result.score,
            shareable_result: result.shareable_result
          });
      }

    } catch (error) {
      console.error('Error completing quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateResult = (quiz: Quiz, score: number): QuizResult => {
    if (quiz.quiz_type === "love_timing") {
      const timeframes = [
        { range: [4, 6], text: "within the next 3 months", message: "Love is just around the corner! The cosmic energies are aligning to bring someone special into your life very soon. Keep your heart open to unexpected encounters." },
        { range: [7, 9], text: "within 6 months", message: "The stars suggest a meaningful connection is forming in your near future. This person might already be in your orbit - pay attention to the signs!" },
        { range: [10, 12], text: "within a year", message: "A beautiful love story is written in your stars for the coming year. Focus on personal growth and self-love to attract your perfect match." },
        { range: [13, 16], text: "within 2 years", message: "The universe is preparing something truly special for you. Use this time to become the best version of yourself - your soulmate will be worth the wait!" }
      ];
      
      const timeframe = timeframes.find(t => score >= t.range[0] && score <= t.range[1]) || timeframes[0];
      return {
        score,
        result_text: timeframe.message,
        shareable_result: `The cosmos reveal I'll meet my soulmate ${timeframe.text}! ✨ When will you meet yours?`
      };
    } else if (quiz.quiz_type === "friendship") {
      const friendTypes = [
        { range: [3, 5], sign: "Cancer", message: "Cancer friends are your cosmic matches! They offer emotional depth, loyalty, and the nurturing energy your soul craves. Together, you create a bond that feels like family." },
        { range: [6, 8], sign: "Sagittarius", message: "Sagittarius friends light up your world! Their adventurous spirit and optimistic outlook perfectly complement your energy. Together, you'll explore new horizons and create amazing memories." },
        { range: [9, 11], sign: "Libra", message: "Libra friends bring harmony to your life! Their diplomatic nature and love for beauty create the perfect friendship dynamic. You balance each other beautifully." },
        { range: [12, 12], sign: "Gemini", message: "Gemini friends are your intellectual soulmates! Their quick wit and endless curiosity match your mental energy. Together, you'll have conversations that last until dawn." }
      ];
      
      const friendType = friendTypes.find(f => score >= f.range[0] && score <= f.range[1]) || friendTypes[0];
      return {
        score,
        result_text: friendType.message,
        shareable_result: `My cosmic BFF is ${friendType.sign}! ♊✨ Who's your celestial friend match?`
      };
    }

    return {
      score,
      result_text: "Your cosmic journey is unique and beautiful!",
      shareable_result: "I just took an amazing astrology quiz! ✨"
    };
  };

  const shareResult = () => {
    if (result) {
      navigator.clipboard.writeText(result.shareable_result);
      toast({
        title: "Copied to Clipboard!",
        description: "Share your cosmic result with friends ✨"
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
    setResult(null);
  };

  if (currentQuiz && !quizCompleted) {
    const question = currentQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / currentQuiz.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
        <div className="container mx-auto max-w-2xl space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-primary">{currentQuiz.title}</h1>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {currentQuiz.questions.length}
            </p>
          </div>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
            <CardHeader className="relative">
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <RadioGroup
                value={answers[currentQuestion]?.toString()}
                onValueChange={(value) => selectAnswer(parseInt(value))}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1 p-3 rounded-lg hover:bg-card/50 transition-colors">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Button
                onClick={nextQuestion}
                disabled={answers[currentQuestion] === undefined}
                className="w-full"
              >
                {currentQuestion === currentQuiz.questions.length - 1 ? 'Complete Quiz' : 'Next Question'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (quizCompleted && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
        <div className="container mx-auto max-w-2xl space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-primary">Quiz Complete!</h1>
            <Star className="h-16 w-16 text-primary mx-auto" />
          </div>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
            <CardHeader className="relative text-center">
              <CardTitle className="text-2xl">{currentQuiz?.title}</CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-6 text-center">
              <div className="bg-card/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Your Cosmic Result:</h3>
                <p className="text-muted-foreground leading-relaxed">{result.result_text}</p>
              </div>

              <div className="flex gap-4">
                <Button onClick={shareResult} variant="outline" className="flex-1 gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Result
                </Button>
                <Button onClick={resetQuiz} variant="outline" className="flex-1 gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Take Another Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Cosmic Quizzes
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover your cosmic secrets through fun astrology quizzes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2">
                  {quiz.quiz_type === 'love_timing' ? (
                    <Heart className="h-6 w-6 text-pink-600" />
                  ) : (
                    <Brain className="h-6 w-6 text-primary" />
                  )}
                  {quiz.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <p className="text-muted-foreground">{quiz.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {quiz.questions.length} questions
                  </span>
                  <Button onClick={() => startQuiz(quiz)} className="gap-2">
                    <Star className="h-4 w-4" />
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {quizzes.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Loading Cosmic Quizzes...</h3>
              <p className="text-muted-foreground">
                Preparing your astrology quizzes...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AstroQuizzes;
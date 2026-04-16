import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stars, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QuizData {
  fullName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  gender: string;
  relationship: string;
  interest: string;
  email: string;
  password: string;
}

/**
 * Quiz onboarding — silently creates the account on completion (no email
 * verification step) and lands the user on /free-report.
 */
const Quiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<QuizData>({
    fullName: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    gender: "",
    relationship: "",
    interest: "",
    email: "",
    password: "",
  });

  const steps = [
    { title: "What's your name?", subtitle: "We'll personalise your cosmic report", field: "fullName", type: "text", placeholder: "Your full name" },
    { title: "When were you born?", subtitle: "Your birth date reveals your life path number", field: "dateOfBirth", type: "date", placeholder: "" },
    { title: "What time were you born?", subtitle: "Helps calculate your rising sign (optional)", field: "timeOfBirth", type: "time", placeholder: "", optional: true },
    { title: "Where were you born?", subtitle: "Your birth location affects planetary positions", field: "placeOfBirth", type: "text", placeholder: "City, Country" },
    { title: "What's your gender?", subtitle: "Helps tailor your cosmic insights", field: "gender", type: "choice", options: ["Male", "Female", "Non-binary", "Prefer not to say"] },
    { title: "What's your relationship status?", subtitle: "We'll customise your love predictions", field: "relationship", type: "choice", options: ["Single", "In a relationship", "Married", "It's complicated"] },
    { title: "What interests you most?", subtitle: "We'll focus your report on what matters", field: "interest", type: "choice", options: ["Finding my soulmate", "Love & relationships", "Career guidance", "Self-discovery"] },
    { title: "Save your free report", subtitle: "Just an email & password — no verification needed", field: "email", type: "signup", placeholder: "" },
  ];

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const canContinue = () => {
    if (currentStep.type === "signup") return data.email.includes("@") && data.password.length >= 6;
    if (currentStep.optional) return true;
    const val = data[currentStep.field as keyof QuizData];
    return val && val.trim() !== "";
  };

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          // Skip email verification redirect — user will be auto signed-in if confirmations are off
          emailRedirectTo: `${window.location.origin}/free-report`,
        },
      });
      if (authError) throw authError;

      if (authData.user) {
        await supabase.from("profiles").insert({
          user_id: authData.user.id,
          full_name: data.fullName,
          date_of_birth: data.dateOfBirth,
          time_of_birth: data.timeOfBirth || null,
          place_of_birth: data.placeOfBirth,
          gender: data.gender || null,
        });
      }

      // Try to sign in immediately so user lands on report without verifying email
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        // Email confirmation likely required — still send them to report; FreeReport
        // will gracefully fall back if no profile yet.
        toast({ title: "Account created ✨", description: "Loading your free report..." });
      }

      navigate("/free-report");
    } catch (error: any) {
      if (error.message?.includes("already registered")) {
        toast({ title: "Account already exists", description: "Please sign in instead.", variant: "destructive" });
        navigate("/auth");
      } else {
        toast({ title: "Error", description: error.message || "Something went wrong", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = (value: string) => {
    setData({ ...data, [currentStep.field as string]: value });
    setTimeout(() => {
      if (step < steps.length - 1) setStep(step + 1);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-starlight flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {step + 1} of {steps.length}</span>
            <span className="text-sm text-primary font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-cosmic rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <Card className="border-primary/30">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Stars className="h-12 w-12 text-primary" />
                <Sparkles className="h-6 w-6 text-accent absolute -top-1 -right-1 animate-sparkle" />
              </div>
            </div>
            <CardTitle className="text-2xl bg-gradient-cosmic bg-clip-text text-transparent">
              {currentStep.title}
            </CardTitle>
            <p className="text-muted-foreground mt-2">{currentStep.subtitle}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep.type === "text" && (
              <Input
                value={data[currentStep.field as keyof QuizData]}
                onChange={(e) => setData({ ...data, [currentStep.field]: e.target.value })}
                placeholder={currentStep.placeholder}
                className="text-center text-lg h-14"
                autoFocus
              />
            )}

            {currentStep.type === "date" && (
              <Input
                type="date"
                value={data[currentStep.field as keyof QuizData]}
                onChange={(e) => setData({ ...data, [currentStep.field]: e.target.value })}
                className="text-center text-lg h-14"
                autoFocus
              />
            )}

            {currentStep.type === "time" && (
              <div>
                <Input
                  type="time"
                  value={data[currentStep.field as keyof QuizData]}
                  onChange={(e) => setData({ ...data, [currentStep.field]: e.target.value })}
                  className="text-center text-lg h-14"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground text-center mt-2">Skip if you don't know your birth time</p>
              </div>
            )}

            {currentStep.type === "choice" && (
              <div className="grid grid-cols-1 gap-3">
                {currentStep.options?.map((option) => (
                  <Button
                    key={option}
                    variant={data[currentStep.field as keyof QuizData] === option ? "cosmic" : "outline"}
                    className="h-14 text-base"
                    onClick={() => handleChoice(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {currentStep.type === "signup" && (
              <div className="space-y-4">
                <div>
                  <Label>Email Address</Label>
                  <Input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="your@email.com" className="h-12" autoFocus />
                </div>
                <div>
                  <Label>Create Password</Label>
                  <Input type="password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} placeholder="Minimum 6 characters" className="h-12" />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  By continuing you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            )}

            <div className="flex gap-3">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              )}
              {currentStep.type !== "choice" && (
                <Button variant="cosmic" onClick={handleNext} disabled={!canContinue() || loading} className="flex-1 gap-2">
                  {loading ? "Loading..." : step === steps.length - 1 ? "Show My Report" : "Continue"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;

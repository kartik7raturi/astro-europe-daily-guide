import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Clock, Stars, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  name: string;
  email: string;
  dateOfBirth: Date | undefined;
  timeOfBirth: string;
  placeOfBirth: string;
  specificQuestions: string;
}

const HoroscopeForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    dateOfBirth: undefined,
    timeOfBirth: "",
    placeOfBirth: "",
    specificQuestions: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData.name || !userData.dateOfBirth || !userData.placeOfBirth) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Store in localStorage for now and redirect to auth
        localStorage.setItem('astrologyData', JSON.stringify(userData));
        toast({
          title: "Please sign in",
          description: "Create an account to save your cosmic profile.",
        });
        navigate('/auth');
        return;
      }

      // Save to database
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: userData.name,
          date_of_birth: userData.dateOfBirth.toISOString().split('T')[0],
          time_of_birth: userData.timeOfBirth || null,
          place_of_birth: userData.placeOfBirth,
          questions: userData.specificQuestions || null
        });

      if (error) throw error;

      toast({
        title: "Profile saved!",
        description: "Your cosmic profile has been created successfully.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-starlight py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Stars className="h-12 w-12 text-primary animate-glow" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            Your Cosmic Profile
          </h1>
          <p className="text-muted-foreground">
            Share your birth details to receive personalized cosmic guidance tailored for European wisdom traditions.
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  placeholder="Enter your full name"
                  className="bg-background/50"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  placeholder="your.email@example.com"
                  className="bg-background/50"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label className="text-foreground">
                  Date of Birth *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background/50",
                        !userData.dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {userData.dateOfBirth ? (
                        format(userData.dateOfBirth, "PPP")
                      ) : (
                        <span>Pick your birth date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={userData.dateOfBirth}
                      onSelect={(date) => setUserData({...userData, dateOfBirth: date})}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time of Birth */}
              <div className="space-y-2">
                <Label htmlFor="time" className="text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time of Birth (if known)
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={userData.timeOfBirth}
                  onChange={(e) => setUserData({...userData, timeOfBirth: e.target.value})}
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground">
                  Time helps create more accurate readings. Leave empty if unknown.
                </p>
              </div>

              {/* Place of Birth */}
              <div className="space-y-2">
                <Label htmlFor="place" className="text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Place of Birth *
                </Label>
                <Input
                  id="place"
                  type="text"
                  value={userData.placeOfBirth}
                  onChange={(e) => setUserData({...userData, placeOfBirth: e.target.value})}
                  placeholder="City, Country (e.g., Paris, France)"
                  className="bg-background/50"
                  required
                />
              </div>

              {/* Specific Questions */}
              <div className="space-y-2">
                <Label htmlFor="questions" className="text-foreground">
                  Specific Areas of Interest (Optional)
                </Label>
                <Textarea
                  id="questions"
                  value={userData.specificQuestions}
                  onChange={(e) => setUserData({...userData, specificQuestions: e.target.value})}
                  placeholder="Any specific areas you'd like guidance on? (love, career, health, family, etc.)"
                  className="bg-background/50 min-h-[100px]"
                />
              </div>

              <Button type="submit" variant="cosmic" size="lg" className="w-full">
                Generate My Cosmic Reading
                <Stars className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Your information is used only to generate your personalized reading and is not stored permanently.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HoroscopeForm;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

      // Save to database - use upsert with onConflict to handle existing profiles
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: userData.name,
          date_of_birth: userData.dateOfBirth.toISOString().split('T')[0],
          time_of_birth: userData.timeOfBirth || null,
          place_of_birth: userData.placeOfBirth,
          questions: userData.specificQuestions || null
        }, {
          onConflict: 'user_id'
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
                    <div className="p-3 space-y-3">
                      {/* Year and Month Selectors */}
                      <div className="flex gap-2">
                        <Select
                          value={userData.dateOfBirth?.getFullYear().toString() || ""}
                          onValueChange={(year) => {
                            const currentDate = userData.dateOfBirth || new Date();
                            const newDate = new Date(parseInt(year), currentDate.getMonth(), currentDate.getDate());
                            setUserData({...userData, dateOfBirth: newDate});
                          }}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {Array.from({ length: new Date().getFullYear() - 1920 + 1 }, (_, i) => {
                              const year = new Date().getFullYear() - i;
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        
                        <Select
                          value={userData.dateOfBirth?.getMonth().toString() || ""}
                          onValueChange={(month) => {
                            const currentDate = userData.dateOfBirth || new Date();
                            const newDate = new Date(currentDate.getFullYear(), parseInt(month), currentDate.getDate());
                            setUserData({...userData, dateOfBirth: newDate});
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {format(new Date(2000, i, 1), "MMMM")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Calendar
                        mode="single"
                        selected={userData.dateOfBirth}
                        onSelect={(date) => setUserData({...userData, dateOfBirth: date})}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1920-01-01")
                        }
                        month={userData.dateOfBirth}
                        onMonthChange={(date) => {
                          if (userData.dateOfBirth) {
                            const newDate = new Date(date.getFullYear(), date.getMonth(), userData.dateOfBirth.getDate());
                            setUserData({...userData, dateOfBirth: newDate});
                          }
                        }}
                        className="pointer-events-auto"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time of Birth */}
              <div className="space-y-2">
                <Label htmlFor="time" className="text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time of Birth (if known)
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={userData.timeOfBirth ? userData.timeOfBirth.split(':')[0] : ""}
                    onValueChange={(hour) => {
                      const currentMinute = userData.timeOfBirth ? userData.timeOfBirth.split(':')[1] : "00";
                      setUserData({...userData, timeOfBirth: `${hour}:${currentMinute}`});
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Hour" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => {
                        const hour = i === 0 ? 12 : i;
                        return (
                          <SelectItem key={hour.toString().padStart(2, '0')} value={hour.toString().padStart(2, '0')}>
                            {hour}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={userData.timeOfBirth ? userData.timeOfBirth.split(':')[1] : ""}
                    onValueChange={(minute) => {
                      const currentHour = userData.timeOfBirth ? userData.timeOfBirth.split(':')[0] : "12";
                      setUserData({...userData, timeOfBirth: `${currentHour}:${minute}`});
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 60 }, (_, i) => (
                        <SelectItem key={i.toString().padStart(2, '0')} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={userData.timeOfBirth ? (parseInt(userData.timeOfBirth.split(':')[0]) >= 12 ? 'PM' : 'AM') : ""}
                    onValueChange={(period) => {
                      if (!userData.timeOfBirth) return;
                      let [hour, minute] = userData.timeOfBirth.split(':');
                      let hour24 = parseInt(hour);
                      
                      if (period === 'PM' && hour24 < 12) {
                        hour24 += 12;
                      } else if (period === 'AM' && hour24 === 12) {
                        hour24 = 0;
                      } else if (period === 'AM' && hour24 > 12) {
                        hour24 -= 12;
                      }
                      
                      setUserData({...userData, timeOfBirth: `${hour24.toString().padStart(2, '0')}:${minute}`});
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="AM/PM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
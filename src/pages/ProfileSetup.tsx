import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Stars, User, Calendar, Clock, MapPin, MessageSquare, Heart } from "lucide-react";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    gender: "",
    questions: "",
    profilePicture: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: formData.fullName,
          date_of_birth: formData.dateOfBirth,
          time_of_birth: formData.timeOfBirth,
          place_of_birth: formData.placeOfBirth,
          gender: formData.gender,
          questions: formData.questions,
          profile_picture: formData.profilePicture
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "प्रोफ़ाइल सहेजी गई!",
        description: "आपकी जानकारी सफलतापूर्वक सहेजी गई है।"
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "त्रुटि",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Stars className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            अपनी प्रोफ़ाइल पूरी करें
          </h1>
          <p className="text-muted-foreground">
            व्यक्तिगत ज्योतिष पूर्वानुमान के लिए अपनी जानकारी भरें
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">व्यक्तिगत जानकारी</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  पूरा नाम *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="अपना पूरा नाम दर्ज करें"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  जन्म तिथि *
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  required
                />
              </div>

              {/* Time of Birth */}
              <div className="space-y-2">
                <Label htmlFor="timeOfBirth" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  जन्म समय (वैकल्पिक)
                </Label>
                <Input
                  id="timeOfBirth"
                  type="time"
                  value={formData.timeOfBirth}
                  onChange={(e) => handleInputChange("timeOfBirth", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  अधिक सटीक पूर्वानुमान के लिए जन्म समय दें
                </p>
              </div>

              {/* Place of Birth */}
              <div className="space-y-2">
                <Label htmlFor="placeOfBirth" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  जन्म स्थान *
                </Label>
                <Input
                  id="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={(e) => handleInputChange("placeOfBirth", e.target.value)}
                  placeholder="शहर, राज्य, देश"
                  required
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  लिंग *
                </Label>
                <Select onValueChange={(value) => handleInputChange("gender", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="अपना लिंग चुनें" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">पुरुष</SelectItem>
                    <SelectItem value="female">महिला</SelectItem>
                    <SelectItem value="other">अन्य</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Questions */}
              <div className="space-y-2">
                <Label htmlFor="questions" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  विशेष प्रश्न (वैकल्पिक)
                </Label>
                <Textarea
                  id="questions"
                  value={formData.questions}
                  onChange={(e) => handleInputChange("questions", e.target.value)}
                  placeholder="कोई विशेष प्रश्न जो आप पूछना चाहते हैं..."
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                variant="cosmic"
                disabled={loading}
              >
                {loading ? "सहेजा जा रहा है..." : "प्रोफ़ाइल सहेजें और जारी रखें"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
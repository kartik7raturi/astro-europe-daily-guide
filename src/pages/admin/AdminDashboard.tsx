import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, ShoppingCart, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      // Check if user has admin role
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error checking admin access:", error);
        navigate("/");
        return;
      }

      if (!data) {
        // If no admin role found, check if this is the global admin email
        if (user.email === "sankhobusiness@gmail.com") {
          // Grant admin access automatically
          const { error: insertError } = await supabase
            .from("user_roles")
            .insert({ user_id: user.id, role: "admin" });
          
          if (insertError) {
            console.error("Error granting admin access:", insertError);
          }
          setIsAdmin(true);
        } else {
          navigate("/");
          return;
        }
      } else {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Error in admin check:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const adminSections = [
    {
      title: "Products Management",
      description: "Manage all products in the shop",
      icon: Package,
      path: "/admin/products",
      color: "text-blue-500",
    },
    {
      title: "Astrologers Management",
      description: "Manage astrologer profiles",
      icon: Users,
      path: "/admin/astrologers",
      color: "text-purple-500",
    },
    {
      title: "Orders Management",
      description: "View and manage all orders",
      icon: ShoppingCart,
      path: "/admin/orders",
      color: "text-green-500",
    },
    {
      title: "Coupons Management",
      description: "Create and manage discount coupons",
      icon: Package,
      path: "/admin/coupons",
      color: "text-yellow-500",
    },
    {
      title: "Sales Analytics",
      description: "View sales statistics and reports",
      icon: Shield,
      path: "/admin/analytics",
      color: "text-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => (
            <Card
              key={section.path}
              className="cursor-pointer hover:scale-105 transition-all duration-300 border-2 hover:border-primary"
              onClick={() => navigate(section.path)}
            >
              <CardHeader>
                <section.icon className={`w-12 h-12 ${section.color} mb-4`} />
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{section.description}</p>
                <Button variant="cosmic" className="w-full mt-4">
                  Manage
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
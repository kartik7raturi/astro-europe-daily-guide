import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle, Clock, Search, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  order_id: string | null;
  status: string;
  amount: number;
  created_at: string;
  tracking_number: string | null;
  customer_name: string | null;
  shipping_address: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  } | null;
  status_history: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
  metadata: {
    product_name?: string;
  } | null;
}

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const OrderTracking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders((data || []).map(order => ({
        ...order,
        shipping_address: order.shipping_address as Order['shipping_address'],
        status_history: (order.status_history || []) as Order['status_history'],
        metadata: order.metadata as Order['metadata']
      })));
    } catch (error) {
      console.error("Error loading orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchOrder = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Enter Order ID",
        description: "Please enter an order ID or tracking number to search",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .or(`order_id.ilike.%${searchQuery}%,tracking_number.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const mappedOrders = data.map(order => ({
          ...order,
          shipping_address: order.shipping_address as Order['shipping_address'],
          status_history: (order.status_history || []) as Order['status_history'],
          metadata: order.metadata as Order['metadata']
        }));
        setSelectedOrder(mappedOrders[0]);
      } else {
        toast({
          title: "Order Not Found",
          description: "No order found with that ID or tracking number",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error searching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStep = (status: string) => {
    const index = statusSteps.findIndex((s) => s.key === status);
    return index === -1 ? 0 : index;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500";
      case "shipped":
        return "bg-blue-500";
      case "confirmed":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-muted-foreground";
    }
  };

  const renderTimeline = (order: Order) => {
    const currentStep = getCurrentStep(order.status);
    
    return (
      <div className="relative">
        <div className="flex justify-between items-center mb-8">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;
            const StepIcon = step.icon;
            
            return (
              <div key={step.key} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  } ${isCurrent ? "ring-4 ring-primary/30 scale-110" : ""}`}
                >
                  <StepIcon className="w-5 h-5" />
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center ${
                    isCompleted ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Progress line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-muted -z-0">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  const renderStatusHistory = (history: Order['status_history']) => {
    if (!history || history.length === 0) return null;
    
    return (
      <div className="mt-6 space-y-3">
        <h4 className="font-semibold text-sm text-muted-foreground">Status History</h4>
        <div className="space-y-2">
          {history.map((item, index) => (
            <div key={index} className="flex items-start gap-3 text-sm">
              <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(item.status)}`} />
              <div>
                <span className="font-medium capitalize">{item.status}</span>
                <span className="text-muted-foreground ml-2">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
                {item.note && (
                  <p className="text-muted-foreground">{item.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-starlight py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            Track Your Order
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your order ID or tracking number to see the status
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Input
                placeholder="Enter Order ID or Tracking Number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchOrder()}
                className="flex-1"
              />
              <Button onClick={searchOrder} variant="cosmic">
                <Search className="w-4 h-4 mr-2" />
                Track
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Selected Order Details */}
        {selectedOrder && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">
                    Order #{selectedOrder.order_id || selectedOrder.id.slice(0, 8)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Placed on {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {renderTimeline(selectedOrder)}
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h4 className="font-semibold mb-2">Order Details</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.metadata?.product_name || "Product"}
                  </p>
                  <p className="text-lg font-bold text-primary mt-1">
                    ₹{selectedOrder.amount}
                  </p>
                </div>
                
                {selectedOrder.tracking_number && (
                  <div>
                    <h4 className="font-semibold mb-2">Tracking Number</h4>
                    <p className="text-sm font-mono bg-muted px-3 py-2 rounded">
                      {selectedOrder.tracking_number}
                    </p>
                  </div>
                )}
                
                {selectedOrder.shipping_address && (
                  <div className="md:col-span-2">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Shipping Address
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.shipping_address.address}, {selectedOrder.shipping_address.city},{" "}
                      {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.pincode}
                    </p>
                  </div>
                )}
              </div>
              
              {renderStatusHistory(selectedOrder.status_history)}
            </CardContent>
          </Card>
        )}

        {/* User Orders List */}
        {user && orders.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setSelectedOrder(order)}
                >
                  <CardContent className="py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">
                          Order #{order.order_id || order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()} • ₹{order.amount}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!user && !selectedOrder && (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Track Your Orders</h3>
              <p className="text-muted-foreground mb-4">
                Sign in to view all your orders or search by order ID above
              </p>
              <Button variant="cosmic" onClick={() => window.location.href = "/auth"}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;

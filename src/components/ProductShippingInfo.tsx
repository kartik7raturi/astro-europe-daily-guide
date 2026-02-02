import { Truck, RotateCcw, Shield } from "lucide-react";

const ProductShippingInfo = () => {
  return (
    <div className="space-y-1 text-xs text-muted-foreground border-t border-border/50 pt-2 mt-2">
      <div className="flex items-center gap-1.5">
        <Truck className="w-3 h-3 text-primary" />
        <span>Free Shipping • 3-5 Days Delivery</span>
      </div>
      <div className="flex items-center gap-1.5">
        <RotateCcw className="w-3 h-3 text-primary" />
        <span>Easy 7-Day Returns</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Shield className="w-3 h-3 text-primary" />
        <span>100% Secure Checkout</span>
      </div>
    </div>
  );
};

export default ProductShippingInfo;

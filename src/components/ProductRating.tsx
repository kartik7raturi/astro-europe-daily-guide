import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProductRatingProps {
  productId: string;
  showCount?: boolean;
  size?: "sm" | "md";
}

const ProductRating = ({ productId, showCount = true, size = "sm" }: ProductRatingProps) => {
  const [avgRating, setAvgRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);

  useEffect(() => {
    const loadRating = async () => {
      try {
        const { data, error } = await supabase
          .from("product_reviews")
          .select("rating")
          .eq("product_id", productId);

        if (error) throw error;

        if (data && data.length > 0) {
          const total = data.reduce((sum, r) => sum + r.rating, 0);
          setAvgRating(total / data.length);
          setReviewCount(data.length);
        }
      } catch (error) {
        console.error("Error loading rating:", error);
      }
    };

    loadRating();
  }, [productId]);

  const starSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.round(avgRating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
      {showCount && reviewCount > 0 && (
        <span className={`${textSize} text-muted-foreground`}>
          ({avgRating.toFixed(1)}) {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </span>
      )}
      {showCount && reviewCount === 0 && (
        <span className={`${textSize} text-muted-foreground`}>No reviews yet</span>
      )}
    </div>
  );
};

export default ProductRating;

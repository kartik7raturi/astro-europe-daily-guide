import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  created_at: string;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

const ProductReviews = ({ productId, productName }: ProductReviewsProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    loadReviews();
  }, [productId, user]);

  const loadReviews = async () => {
    const { data, error } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading reviews:', error);
      return;
    }

    setReviews(data || []);
    
    if (user) {
      const existing = data?.find(r => r.user_id === user.id);
      if (existing) {
        setUserReview(existing);
        setRating(existing.rating);
        setReviewText(existing.review_text || '');
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please sign in to leave a review');
      return;
    }

    setIsSubmitting(true);
    try {
      if (userReview) {
        // Update existing review
        const { error } = await supabase
          .from('product_reviews')
          .update({ rating, review_text: reviewText })
          .eq('id', userReview.id);

        if (error) throw error;
        toast.success('Review updated!');
      } else {
        // Create new review
        const { error } = await supabase
          .from('product_reviews')
          .insert({
            product_id: productId,
            user_id: user.id,
            rating,
            review_text: reviewText
          });

        if (error) throw error;
        toast.success('Review submitted!');
      }
      
      loadReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    try {
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id', userReview.id);

      if (error) throw error;
      
      setUserReview(null);
      setRating(5);
      setReviewText('');
      loadReviews();
      toast.success('Review deleted');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const renderStars = (count: number, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} cursor-${interactive ? 'pointer' : 'default'} transition-colors ${
              star <= (interactive ? (hoveredStar || rating) : count)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            }`}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Customer Reviews</span>
          <div className="flex items-center gap-2">
            {renderStars(Number(averageRating), false, 'w-4 h-4')}
            <span className="text-sm font-normal text-muted-foreground">
              {averageRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Write/Edit Review Section */}
        {user && (
          <div className="border rounded-lg p-4 bg-muted/30">
            <h3 className="font-semibold mb-3">
              {userReview ? 'Edit Your Review' : 'Write a Review'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Your Rating</label>
                {renderStars(rating, true)}
              </div>
              <Textarea
                placeholder="Share your experience with this product..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
                </Button>
                {userReview && (
                  <Button
                    variant="outline"
                    onClick={handleDeleteReview}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {!user && (
          <p className="text-center text-muted-foreground py-4">
            Sign in to write a review
          </p>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.filter(r => r.user_id !== user?.id).map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating, false, 'w-3 h-3')}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
              {review.review_text && (
                <p className="text-sm text-foreground ml-11">{review.review_text}</p>
              )}
            </div>
          ))}

          {reviews.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductReviews;

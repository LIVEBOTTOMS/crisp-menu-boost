import { useState, useEffect } from "react";
import { Star, ThumbsUp, MessageSquare, Camera, Upload, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReviewFormProps, Review, Customer } from "@/types/worldClass";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMenu } from "@/contexts/MenuContext";

export const CustomerReviews = ({ menuItemId }: { menuItemId: string }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const { menuData } = useMenu();

    useEffect(() => {
        fetchReviews();
    }, [menuItemId]);

    const fetchReviews = async () => {
        try {
            // Mock data for now - replace with actual Supabase query
            const mockReviews: Review[] = [
                {
                    id: 'review-1',
                    customer_id: 'customer-1',
                    menu_item_id: menuItemId,
                    rating: 5,
                    review_text: 'Absolutely amazing! The flavors were incredible and the presentation was stunning.',
                    photo_urls: [],
                    is_verified: true,
                    helpful_votes: 12,
                    created_at: '2024-12-10T14:30:00Z',
                    updated_at: '2024-12-10T14:30:00Z',
                    customer: {
                        id: 'customer-1',
                        name: 'Sarah Johnson',
                        phone_number: '+919876543210',
                        email: 'sarah@example.com',
                        preferred_language: 'en',
                        dietary_preferences: ['vegetarian'],
                        created_at: '2024-12-01T10:00:00Z',
                        updated_at: '2024-12-01T10:00:00Z'
                    }
                },
                {
                    id: 'review-2',
                    customer_id: 'customer-2',
                    menu_item_id: menuItemId,
                    rating: 4,
                    review_text: 'Really good dish, though a bit spicy for my taste. Will try again!',
                    photo_urls: ['/public/placeholder.svg'],
                    is_verified: true,
                    helpful_votes: 8,
                    created_at: '2024-12-08T19:15:00Z',
                    updated_at: '2024-12-08T19:15:00Z',
                    customer: {
                        id: 'customer-2',
                        name: 'Raj Patel',
                        phone_number: '+919876543211',
                        email: 'raj@example.com',
                        preferred_language: 'en',
                        dietary_preferences: [],
                        created_at: '2024-12-02T15:30:00Z',
                        updated_at: '2024-12-02T15:30:00Z'
                    }
                }
            ];

            // Uncomment when database migration is applied
            /*
            const { data, error } = await supabase
                .from('reviews')
                .select(`
                    *,
                    customer:customers(*)
                `)
                .eq('menu_item_id', menuItemId)
                .eq('is_verified', true)
                .order('helpful_votes', { ascending: false })
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;
            setReviews(data || []);
            */

            setReviews(mockReviews);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
            toast.error('Failed to load reviews');
        } finally {
            setIsLoading(false);
        }
    };

    const handleHelpfulVote = async (reviewId: string) => {
        try {
            // Mock implementation
            setReviews(prev => prev.map(review =>
                review.id === reviewId
                    ? { ...review, helpful_votes: review.helpful_votes + 1 }
                    : review
            ));
            toast.success('Thanks for your feedback!');
        } catch (error) {
            console.error('Failed to vote:', error);
        }
    };

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: reviews.filter(review => review.rating === rating).length,
        percentage: reviews.length > 0
            ? (reviews.filter(review => review.rating === rating).length / reviews.length) * 100
            : 0
    }));

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Rating Summary */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Customer Reviews
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${star <= Math.round(averageRating)
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-400'
                                        }`}
                                />
                            ))}
                            <span className="ml-2 text-white font-medium">
                                {averageRating.toFixed(1)}
                            </span>
                        </div>
                        <span className="text-gray-400">
                            ({reviews.length} reviews)
                        </span>
                    </div>
                </div>

                <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                    <DialogTrigger asChild>
                        <Button className="bg-neon-cyan hover:bg-neon-cyan/80 text-black font-medium">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Write Review
                        </Button>
                    </DialogTrigger>
                    <ReviewForm
                        menuItemId={menuItemId}
                        onSubmit={async (reviewData) => {
                            // Mock implementation
                            const newReview: Review = {
                                ...reviewData,
                                id: `review-${Date.now()}`,
                                is_verified: false,
                                helpful_votes: 0,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                                customer: {
                                    id: 'current-user',
                                    name: 'You',
                                    preferred_language: 'en',
                                    dietary_preferences: [],
                                    created_at: new Date().toISOString(),
                                    updated_at: new Date().toISOString()
                                }
                            };
                            setReviews(prev => [newReview, ...prev]);
                            setShowReviewForm(false);
                            toast.success('Review submitted! It will be published after verification.');
                        }}
                        onClose={() => setShowReviewForm(false)}
                    />
                </Dialog>
            </div>

            {/* Rating Distribution */}
            {reviews.length > 0 && (
                <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            {ratingDistribution.map(({ rating, count, percentage }) => (
                                <div key={rating} className="flex items-center gap-3">
                                    <span className="text-sm text-gray-400 w-8">{rating}★</span>
                                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-neon-cyan h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-400 w-12">{count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <Card key={review.id} className="bg-slate-800 border-slate-700">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan">
                                        {review.customer?.name?.charAt(0) || <User className="w-4 h-4" />}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-medium text-white">
                                            {review.customer?.name || 'Anonymous'}
                                        </span>
                                        {review.is_verified && (
                                            <Badge variant="secondary" className="bg-green-600/20 text-green-400 text-xs">
                                                Verified
                                            </Badge>
                                        )}
                                        <div className="flex items-center gap-1 ml-auto">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= review.rating
                                                            ? 'text-yellow-400 fill-current'
                                                            : 'text-gray-400'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-gray-300 mb-3 leading-relaxed">
                                        {review.review_text}
                                    </p>

                                    {/* Photo Gallery */}
                                    {review.photo_urls && review.photo_urls.length > 0 && (
                                        <div className="flex gap-2 mb-3 overflow-x-auto">
                                            {review.photo_urls.map((url, index) => (
                                                <img
                                                    key={index}
                                                    src={url}
                                                    alt={`Review photo ${index + 1}`}
                                                    className="w-20 h-20 object-cover rounded-lg border border-slate-600 flex-shrink-0"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </span>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleHelpfulVote(review.id)}
                                            className="text-gray-400 hover:text-neon-cyan flex items-center gap-1"
                                        >
                                            <ThumbsUp className="w-3 h-3" />
                                            <span className="text-xs">{review.helpful_votes}</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {reviews.length === 0 && (
                <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="p-8 text-center">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No reviews yet</h3>
                        <p className="text-gray-400 mb-4">
                            Be the first to share your experience with this dish!
                        </p>
                        <Button
                            onClick={() => setShowReviewForm(true)}
                            className="bg-neon-cyan hover:bg-neon-cyan/80 text-black"
                        >
                            Write First Review
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

const ReviewForm = ({ menuItemId, customerPhone, onSubmit, onClose }: ReviewFormProps) => {
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(customerPhone || '');
    const [photos, setPhotos] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (photos.length + files.length > 5) {
            toast.error('Maximum 5 photos allowed');
            return;
        }
        setPhotos(prev => [...prev, ...files]);
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!phoneNumber) {
            toast.error('Please enter your phone number');
            return;
        }
        if (!reviewText.trim()) {
            toast.error('Please write a review');
            return;
        }

        setIsSubmitting(true);
        try {
            const photoUrls = photos.length > 0 ? photos.map(() => '/public/placeholder.svg') : [];

            await onSubmit({
                customer_id: phoneNumber, // Using phone as customer ID for now
                menu_item_id: menuItemId,
                rating,
                review_text: reviewText,
                photo_urls: photoUrls,
                is_verified: false,
                helpful_votes: 0
        } catch (error) {
            console.error('Failed to submit review:', error);
            toast.error('Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-700 text-white">
            <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
                {/* Phone Number */}
                <div>
                    <label className="text-sm font-medium text-gray-300">Phone Number</label>
                    <Input
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91xxxxxxxxxx"
                        className="bg-slate-800 border-slate-600 text-white mt-1"
                    />
                </div>

                {/* Rating */}
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                            >
                                <Star
                                    className={`w-8 h-8 ${star <= rating
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-400 hover:text-yellow-400'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Review Text */}
                <div>
                    <label className="text-sm font-medium text-gray-300">Your Review</label>
                    <Textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience with this dish..."
                        className="bg-slate-800 border-slate-600 text-white mt-1 min-h-[100px]"
                    />
                </div>

                {/* Photo Upload */}
                <div>
                    <label className="text-sm font-medium text-gray-300">Photos (Optional)</label>
                    <div className="mt-1">
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            className="bg-slate-800 border-slate-600 text-white file:bg-neon-cyan file:text-black file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:font-medium"
                        />
                        {photos.length > 0 && (
                            <div className="flex gap-2 mt-2 overflow-x-auto">
                                {photos.map((photo, index) => (
                                    <div key={index} className="relative flex-shrink-0">
                                        <img
                                            src={URL.createObjectURL(photo)}
                                            alt={`Upload ${index + 1}`}
                                            className="w-16 h-16 object-cover rounded border border-slate-600"
                                        />
                                        <button
                                            onClick={() => removePhoto(index)}
                                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-700"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                            Upload up to 5 photos. Max 10MB each.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !reviewText.trim()}
                        className="bg-neon-cyan hover:bg-neon-cyan/80 text-black"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </div>
            </div>
        </DialogContent>
    );
};

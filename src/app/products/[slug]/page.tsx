"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, Star, ArrowLeft, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";

interface ProductDetail {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  stock: number;
  averageRating?: number;
  totalReviews?: number;
  category?: { name: string; slug: string } | string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const Stars = ({ value, size = 16 }: { value: number; size?: number }) => (
  <div className="flex items-center gap-0.5" aria-label={`${value.toFixed(1)} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={size}
        className={n <= Math.round(value) ? "text-amber-400" : "text-on-surface-variant/30"}
        fill={n <= Math.round(value) ? "currentColor" : "none"}
      />
    ))}
  </div>
);

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem, items: cartItems, setCartOpen } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/slug/${slug}`);
        setProduct(res.data.data.product);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    api
      .get(`/products/${product._id}/reviews`, { params: { limit: 10 } })
      .then((res) => setReviews(res.data.data.reviews))
      .catch((err) => console.error("Failed to fetch reviews", err));
  }, [product]);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-[4/5] rounded-2xl bg-surface-container-low" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded bg-surface-container-low" />
          <div className="h-6 w-1/4 rounded bg-surface-container-low" />
          <div className="h-24 rounded bg-surface-container-low" />
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Product not found</h1>
        <p className="text-on-surface-variant mb-8">It may have been removed or is no longer available.</p>
        <Link href="/products" className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md">
          Back to Products
        </Link>
      </div>
    );
  }

  const inCart = cartItems.find((i) => i.id === product._id)?.quantity ?? 0;
  const maxAddable = Math.max(product.stock - inCart, 0);
  const wishlisted = isInWishlist(product._id);
  const categoryName = typeof product.category === "object" ? product.category.name : null;

  const handleAddToCart = () => {
    if (maxAddable < 1) return;
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: Math.min(quantity, maxAddable),
      image: product.images?.[0] || "",
    });
    setQuantity(1);
    toast.success(`${product.name} added to cart`, {
      action: { label: "View Cart", onClick: () => setCartOpen(true) },
    });
  };

  const handleToggleWishlist = () => {
    toggleItem({
      id: product._id,
      name: product.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.images?.[0] || "",
      slug: product.slug,
    });
    if (wishlisted) {
      toast("Removed from Wishlist");
    } else {
      toast.success("Added to Wishlist", { icon: "❤️" });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${product._id}/reviews`, { rating, comment });
      setReviews((prev) => [res.data.data.review, ...prev]);
      setComment("");
      setRating(5);
      toast.success("Thanks for your review!");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to submit review."));
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 pb-28 md:pb-12">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 font-label-md"
      >
        <ArrowLeft size={16} /> All Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Gallery */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="aspect-[4/5] relative overflow-hidden bg-surface-container-low rounded-2xl soft-shadow mb-4">
            {product.images?.length > 0 ? (
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant/50">No Image</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={img + idx}
                  onClick={() => setActiveImage(idx)}
                  aria-label={`Show image ${idx + 1}`}
                  className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                    idx === activeImage ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          {categoryName && (
            <span className="text-primary font-label-md uppercase tracking-widest mb-2">{categoryName}</span>
          )}
          <h1 className="font-headline-xl text-on-surface mb-3">{product.name}</h1>

          {!!product.totalReviews && (
            <div className="flex items-center gap-2 mb-4 text-on-surface-variant font-caption">
              <Stars value={product.averageRating || 0} />
              <span>
                {(product.averageRating || 0).toFixed(1)} ({product.totalReviews} review{product.totalReviews === 1 ? "" : "s"})
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-[#00C853]">₹{product.price.toFixed(2)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-lg text-on-surface-variant line-through opacity-60">
                  ₹{product.compareAtPrice.toFixed(2)}
                </span>
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                  {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-on-surface-variant font-body-md whitespace-pre-line mb-8">{product.description}</p>

          <p className={`font-label-md mb-4 ${product.stock > 0 ? "text-[#00C853]" : "text-red-500"}`}>
            {product.stock === 0
              ? "Out of stock"
              : product.stock <= 5
              ? `Only ${product.stock} left in stock`
              : "In stock"}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-4 bg-surface-container-low rounded-xl p-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="p-2 rounded-lg hover:bg-surface-container-high disabled:opacity-40 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(maxAddable, q + 1))}
                disabled={quantity >= maxAddable}
                aria-label="Increase quantity"
                className="p-2 rounded-lg hover:bg-surface-container-high disabled:opacity-40 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={maxAddable < 1}
              className="flex-1 min-w-[180px] flex items-center justify-center gap-2 bg-primary text-on-primary py-4 rounded-xl font-label-md hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={18} />
              {product.stock === 0 ? "Out of Stock" : maxAddable < 1 ? "Max quantity in cart" : "Add to Cart"}
            </button>

            <button
              onClick={handleToggleWishlist}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-colors ${
                wishlisted
                  ? "border-red-500 text-red-500"
                  : "border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary"
              }`}
            >
              <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {inCart > 0 && (
            <p className="text-on-surface-variant font-caption">
              {inCart} already in your cart.{" "}
              <Link href="/cart" className="text-primary hover:underline">
                View cart
              </Link>
            </p>
          )}
        </motion.div>
      </div>

      {/* Reviews */}
      <section className="mt-20 max-w-3xl">
        <h2 className="font-headline-lg text-on-surface mb-6">Customer Reviews</h2>

        {isAuthenticated ? (
          <form
            onSubmit={handleSubmitReview}
            className="bg-surface-container-low rounded-2xl p-6 mb-8 space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="font-label-md text-on-surface-variant">Your rating</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  >
                    <Star
                      size={22}
                      className={n <= rating ? "text-amber-400" : "text-on-surface-variant/30"}
                      fill={n <= rating ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              minLength={3}
              maxLength={500}
              rows={3}
              placeholder="What did you think of this product?"
              className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md disabled:opacity-50"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <p className="text-on-surface-variant mb-8">
            <Link href={`/login?redirect=/products/${product.slug}`} className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to write a review.
          </p>
        )}

        {reviews.length === 0 ? (
          <p className="text-on-surface-variant">No reviews yet. Be the first to share your thoughts!</p>
        ) : (
          <ul className="space-y-6">
            {reviews.map((review) => (
              <li key={review._id} className="border-b border-outline-variant/50 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <Stars value={review.rating} size={14} />
                  <span className="text-on-surface-variant font-caption">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-on-surface font-body-md">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

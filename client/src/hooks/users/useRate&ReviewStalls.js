import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../lib/apiClient';
import { notifications } from '@mantine/notifications';
import { isAuthenticated } from '../../utils/auth';

/**
 * Hook: UC008 Rate & Review — Comment Section with Photo Upload
 * Allows multiple reviews per user per stall.
 */
export const useRateAndReviewStalls = (stallId, stallName, onReviewSuccess) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Fetch all public reviews for this stall
  const fetchReviews = useCallback(async () => {
    if (!stallId) return;
    setLoadingReviews(true);
    try {
      const response = await apiClient.get(`/engagement/stall/${stallId}`);
      setReviews(response.data || []);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoadingReviews(false);
    }
  }, [stallId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submitReview = async () => {
    if (!isAuthenticated()) {
      notifications.show({
        title: 'Login Required',
        message: 'Please login to leave a review',
        color: 'yellow'
      });
      return;
    }

    if (rating === 0) {
      notifications.show({
        title: 'Rating Required',
        message: 'Please select a star rating before submitting',
        color: 'red'
      });
      return;
    }

    setSubmitting(true);
    try {
      // Convert image to base64 so we can send plain JSON (multipart/form-data
      // is not supported in Firebase Cloud Functions — the stream is consumed
      // before Express/multer can read it).
      let imageBase64 = null;
      let imageMimeType = null;
      if (imageFile) {
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            // reader.result is "data:<mime>;base64,<data>" — strip the prefix
            resolve(reader.result.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
        imageMimeType = imageFile.type;
      }

      await apiClient.post('/engagement/', {
        stallId,
        stallName: stallName || 'Unknown_Stall',
        rating,
        comment,
        ...(imageBase64 ? { imageBase64, imageMimeType } : {}),
      });

      notifications.show({
        title: 'Review Posted!',
        message: 'Your review has been added to the feed',
        color: 'green'
      });

      // Reset form after successful submission
      setRating(0);
      setComment('');
      setImageFile(null);

      // Refresh comment feed
      await fetchReviews();
      if (onReviewSuccess) onReviewSuccess();
    } catch (err) {
      notifications.show({
        title: 'Submission Failed',
        message: err.response?.data?.error || 'Could not submit review. Try again.',
        color: 'red'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    rating, setRating,
    comment, setComment,
    imageFile, setImageFile,
    submitting, submitReview,
    reviews, loadingReviews,
    refreshReviews: fetchReviews
  };
};

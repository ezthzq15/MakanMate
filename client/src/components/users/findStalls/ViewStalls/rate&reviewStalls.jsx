import React, { useRef } from 'react';
import {
  Box, Stack, Title, Text, Rating,
  Textarea, Button, Group, Paper, Avatar,
  Divider, Skeleton, Image, rem, FileButton,
  ActionIcon, Badge, useMantineTheme
} from '@mantine/core';
import { IconPhoto, IconX, IconStar } from '@tabler/icons-react';
import { useRateAndReviewStalls } from '../../../../hooks/users/useRate&ReviewStalls';
import { isAuthenticated } from '../../../../utils/auth';

/**
 * COMPONENT: Rate & Review — Social Comment Section (UC008)
 */
const RateAndReviewStalls = ({ stallId, stallName, onReviewSuccess }) => {
  const theme = useMantineTheme();
  const resetRef = useRef(null);
  const isAuth = isAuthenticated();

  const {
    rating, setRating,
    comment, setComment,
    imageFile, setImageFile,
    submitting, submitReview,
    reviews, loadingReviews
  } = useRateAndReviewStalls(stallId, stallName, onReviewSuccess);

  const handleImageSelect = (file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      notifications.show({ title: 'Image Too Large', message: 'Please use an image under 5MB', color: 'red' });
      return;
    }
    setImageFile(file);
  };

  const clearImage = () => {
    setImageFile(null);
    resetRef.current?.();
  };

  return (
    <Stack gap="xl">
      {/* ── Submit Form (Authenticated Only) ── */}
      {isAuth ? (
        <Paper withBorder p="xl" radius="xl">
          <Stack gap="xl">
            <Title order={3} style={{ fontSize: rem(24) }}>Write a Review</Title>

            <Box>
              <Text fz="sm" fw={600} mb={6}>Overall Rating</Text>
              <Rating
                value={rating}
                onChange={setRating}
                size="xl"
                color="yellow"
              />
            </Box>

            <Box>
              <Text fz="sm" fw={600} mb={6}>Your Comment</Text>
              <Textarea
                placeholder="Share your experience with others..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={300}
                minRows={3}
                autosize
                radius="md"
              />
              <Text fz="xs" c="dimmed" mt={4} ta="right">
                {comment.length} / 300
              </Text>
            </Box>

            {/* Image Preview */}
            {imageFile && (
              <Box style={{ position: 'relative', display: 'inline-block', width: 'fit-content' }}>
                <Image
                  src={URL.createObjectURL(imageFile)}
                  radius="md"
                  h={140}
                  w={200}
                  fit="cover"
                />
                <ActionIcon
                  size="xs"
                  color="red"
                  variant="filled"
                  radius="xl"
                  onClick={clearImage}
                  style={{ position: 'absolute', top: 6, right: 6 }}
                >
                  <IconX size={10} />
                </ActionIcon>
              </Box>
            )}

            <Group justify="space-between" align="center">
              {/* Photo Upload Button */}
              <FileButton resetRef={resetRef} onChange={handleImageSelect} accept="image/*">
                {(props) => (
                  <Button
                    {...props}
                    variant="light"
                    color="gray"
                    leftSection={<IconPhoto size={16} />}
                    radius="xl"
                    size="sm"
                  >
                    {imageFile ? 'Change Photo' : 'Add Photo'}
                  </Button>
                )}
              </FileButton>

              <Button
                radius="xl"
                px={32}
                size="md"
                loading={submitting}
                onClick={submitReview}
                style={{ backgroundColor: 'var(--mm-color-primary)' }}
              >
              Post Review
              </Button>
            </Group>
          </Stack>
        </Paper>
      ) : (
        <Paper withBorder p="xl" radius="xl" ta="center" bg="#f8f9fa">
          <Text size="lg" c="dimmed">
            <Text span fw={800} c="brand" style={{ cursor: 'pointer' }}>Login</Text> to leave a review and share your experience with the community.
          </Text>
        </Paper>
      )}

      <Divider label={`${reviews.length} Reviews`} labelPosition="left" fw={700} />

      {/* ── Comment Feed ── */}
      {loadingReviews ? (
        <Stack gap="md">
          {[1, 2, 3].map(i => (
            <Group key={i} wrap="nowrap">
              <Skeleton circle height={40} />
              <Stack gap={4} style={{ flex: 1 }}>
                <Skeleton height={14} width="30%" />
                <Skeleton height={12} width="80%" />
              </Stack>
            </Group>
          ))}
        </Stack>
      ) : reviews.length === 0 ? (
        <Text c="dimmed" ta="center" py={40} fz="sm" fs="italic">
          No reviews yet. Be the first to share your experience!
        </Text>
      ) : (
        <Stack gap="lg">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

const ReviewCard = ({ review }) => {
  const initials = (review.userName || 'U').charAt(0).toUpperCase();
  const date = review.ratingDate
    ? new Date(review.ratingDate).toLocaleDateString('en-MY', {
        day: 'numeric', month: 'short', year: 'numeric'
      })
    : '';

  return (
    <Box>
      <Group align="flex-start" wrap="nowrap">
        <Avatar
          color="teal"
          radius="xl"
          size="md"
          style={{ backgroundColor: 'var(--mm-color-primary)', color: '#fff', flexShrink: 0 }}
        >
          {initials}
        </Avatar>
        <Stack gap={4} style={{ flex: 1 }}>
          <Group gap="xs" align="center">
            <Text fw={700} fz="sm">{review.userName || 'Anonymous'}</Text>
            <Text c="dimmed" fz="xs">{date}</Text>
          </Group>
          <Rating value={review.ratingScore || 0} readOnly size="xs" color="yellow" />
          {review.comments && (
            <Text fz="sm" mt={4} style={{ lineHeight: 1.6 }}>
              {review.comments}
            </Text>
          )}
          {review.imageURL && (
            <Image
              src={review.imageURL}
              radius="md"
              mt={8}
              h={180}
              w={240}
              fit="cover"
            />
          )}
        </Stack>
      </Group>
      <Divider mt="md" variant="dashed" />
    </Box>
  );
};

export default RateAndReviewStalls;

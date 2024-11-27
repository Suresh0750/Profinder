// components/MaterialCarousel.tsx
'use client';
import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// * types
import { MaterialCarouselProps } from '@/types/workerTypes';

const MaterialCarousel: React.FC<MaterialCarouselProps> = ({ images }) => {

  console.log('image destructure')
  console.log(images)

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3; 

  const goToPrevious = () => {
    
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // const visibleImages = images.slice(currentIndex, currentIndex + itemsToShow)?.length < itemsToShow
  //   ? [...images.slice(currentIndex), ...images.slice(0, itemsToShow - (images.length - currentIndex))]
  //   : images.slice(currentIndex, currentIndex + itemsToShow);

  const visibleImages = images.slice(currentIndex, currentIndex + itemsToShow)?.length < itemsToShow
    ? [...images.slice(currentIndex)]
    : images.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <Box position="relative" width="100%" overflow="hidden">
      {/* Left Arrow */}
      <IconButton
        onClick={goToPrevious}
        sx={{ position: 'absolute', top: '50%', left: '10px', zIndex: 2, color: 'black', transform: 'translateY(-50%)' }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      {/* Right Arrow */}
      <IconButton
        onClick={goToNext}
        sx={{ position: 'absolute', top: '50%', right: '10px', zIndex: 2, color: 'black', transform: 'translateY(-50%)' }}
      >
        <ArrowForwardIosIcon />
      </IconButton>

      {/* Image Container */}
      <Box display="flex" justifyContent="center" gap={2} sx={{ transition: 'transform 0.5s ease-in-out' }}>
        {visibleImages.map((data, index) => (
          <Box
            key={index}
            component="img"
            src={data?.projectImage}
            alt={`Slide ${index + 1}`}
            sx={{
              width: '300px', // Adjust the width as per your design
              height: '300px',
              objectFit: 'cover',
              borderRadius: '8px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default MaterialCarousel;

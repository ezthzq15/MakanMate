import React from 'react';
import { useParams } from 'react-router-dom';
import ViewStalls from '../../../../../components/users/findStalls/ViewStalls/viewStalls';

/**
 * PAGE: UC007 / UC008 / FR09 View Stall Entry
 */
const StallDetailPage = () => {
  const { id } = useParams();

  return (
    <ViewStalls stallId={id} />
  );
};

export default StallDetailPage;

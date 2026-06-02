import { useState, useEffect, useRef } from 'react';
import apiClient from '../../lib/apiClient';
import { notifications } from '@mantine/notifications';

export const useRedeemVoucher = () => {
  const [loading, setLoading] = useState(false);
  const [checkInState, setCheckInState] = useState('initial'); // 'initial' | 'pending' | 'approved' | 'expired' | 'redeemed'
  const [checkInId, setCheckInId] = useState(null);
  const [redemptionData, setRedemptionData] = useState(null);
  
  const pollingIntervalRef = useRef(null);

  // Stop polling if we leave or it's resolved
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const requestCheckIn = async (voucherId, stallId) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/vouchers/checkin', { voucherId, stallId });
      setCheckInId(response.data.checkInId);
      setCheckInState('pending');
      startPolling(response.data.checkInId);
      
      notifications.show({
        title: 'Check-in Requested',
        message: 'Please wait for the stall manager to approve your check-in.',
        color: 'blue'
      });
    } catch (error) {
      notifications.show({
        title: 'Check-in Failed',
        message: error.response?.data?.error || 'Failed to check-in. Please try again.',
        color: 'red'
      });
      setCheckInState('initial');
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (id) => {
    stopPolling();
    // Poll every 5 seconds
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await apiClient.get(`/vouchers/checkin/${id}/status`);
        const status = response.data.status;
        
        if (status === 'approved') {
          stopPolling();
          setCheckInState('approved');
          setRedemptionData({
            redemptionCode: response.data.redemptionCode,
            expiresAt: response.data.expiresAt
          });
          notifications.show({
            title: 'Check-in Approved!',
            message: 'Your voucher is ready. Please show the QR code to the cashier.',
            color: 'green'
          });
        } else if (status === 'expired' || status === 'redeemed') {
          stopPolling();
          setCheckInState(status);
        }
      } catch (error) {
        console.error('Error polling check-in status:', error);
        // Don't stop polling on single network failure, let it retry
      }
    }, 5000);
  };

  const resetVoucherState = () => {
    stopPolling();
    setCheckInState('initial');
    setCheckInId(null);
    setRedemptionData(null);
  };

  return {
    loading,
    checkInState,
    redemptionData,
    requestCheckIn,
    resetVoucherState
  };
};

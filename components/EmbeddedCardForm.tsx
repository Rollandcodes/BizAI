'use client';

import { useState } from 'react';
import {
  PayPalHostedField,
  PayPalHostedFieldsProvider,
  usePayPalHostedFields,
} from '@paypal/react-paypal-js';

type SignupData = {
  businessName?: string;
  yourName?: string;
  ownerName?: string;
  email?: string;
  whatsapp?: string;
  businessType?: string;
  website?: string;
  plan?: string;
};

type CheckoutUser = {
  id?: string;
  email?: string;
  businessName?: string;
  plan?: string;
};

interface EmbeddedCardFormProps {
  planId: string;
  planPrice: string;
  customerEmail: string;
  businessName: string;
  signupData: SignupData;
  onSuccess: (user: CheckoutUser) => void;
  onError: (msg: string) => void;
}

function HostedFieldsForm({
  planId,
  planPrice,
  customerEmail,
  businessName,
  signupData,
  onSuccess,
  onError,
}: EmbeddedCardFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState('');
  const hostedFields = usePayPalHostedFields();

  async function handleSubmit() {
    if (!hostedFields?.cardFields) {
      const message = 'Payment form not loaded. Refresh and try again.';
      setCardError(message);
      onError(message);
      return;
    }

    setIsProcessing(true);
    setCardError('');

    try {
      const submission = await hostedFields.cardFields.submit({
        cardholderName:
          signupData.ownerName || signupData.yourName || businessName || customerEmail,
        billingAddress: {
          countryCodeAlpha2: 'US',
        },
      });

      const captureResponse = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderID: submission.orderId,
          planId,
          signupData,
        }),
      });

      const result = (await captureResponse.json()) as {
        success?: boolean;
        user?: CheckoutUser;
        error?: string;
      };

      if (!captureResponse.ok || !result.success) {
        throw new Error(result.error || 'Payment failed');
      }

      onSuccess(
        result.user || {
          email: customerEmail,
          businessName,
          plan: planId,
        },
      );
    } catch (error) {
      console.error('Hosted card payment error:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Payment failed. Please check your card details.';
      setCardError(message);
      onError(message);
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Card Number
        </label>
        <div className="rounded-xl border border-gray-300 bg-white px-4 py-3 transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <PayPalHostedField
            id="card-number"
            hostedFieldType="number"
            options={{
              selector: '#card-number',
              placeholder: '4242 4242 4242 4242',
            }}
            className="w-full outline-none text-gray-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Expiry Date
          </label>
          <div className="rounded-xl border border-gray-300 bg-white px-4 py-3 transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <PayPalHostedField
              id="expiration-date"
              hostedFieldType="expirationDate"
              options={{
                selector: '#expiration-date',
                placeholder: 'MM/YY',
              }}
              className="w-full outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            CVV
          </label>
          <div className="rounded-xl border border-gray-300 bg-white px-4 py-3 transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <PayPalHostedField
              id="cvv"
              hostedFieldType="cvv"
              options={{
                selector: '#cvv',
                placeholder: '123',
              }}
              className="w-full outline-none"
            />
          </div>
        </div>
      </div>

      {cardError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">⚠️ {cardError}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isProcessing}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:bg-blue-700 disabled:scale-100 disabled:bg-blue-400"
      >
        {isProcessing ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Processing payment...
          </>
        ) : (
          `💳 Pay ${planPrice} Securely`
        )}
      </button>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
        <span>🔒 256-bit SSL</span>
        <span>💳 Visa & Mastercard</span>
        <span>🛡️ Secured by PayPal</span>
      </div>

      <p className="text-center text-xs text-gray-400">
        Your card details are encrypted and never stored by CypAI
      </p>
    </div>
  );
}

export default function EmbeddedCardForm(props: EmbeddedCardFormProps) {
  return (
    <PayPalHostedFieldsProvider
      createOrder={async () => {
        const response = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: props.planId,
            customerEmail: props.customerEmail,
          }),
        });

        const data = (await response.json()) as { id?: string; error?: string };
        if (!response.ok || !data.id) {
          throw new Error(data.error || 'Failed to create order');
        }

        return data.id;
      }}
      notEligibleError={
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="mb-2 font-medium text-red-600">⚠️ Card payment unavailable</p>
          <p className="text-sm text-red-500">Please use WhatsApp to complete payment instead.</p>
        </div>
      }
    >
      <HostedFieldsForm {...props} />
    </PayPalHostedFieldsProvider>
  );
}
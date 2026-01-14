import { useState } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CreditCard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import stripePromise, { STRIPE_CONFIG } from "@/integrations/stripe/client";

interface StripeCheckoutProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: 'Inter, sans-serif',
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const CheckoutForm = ({ onSuccess, onCancel }: StripeCheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuthContext();
  const { toast } = useToast();

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const plans = {
    monthly: {
      price: '₺49.90',
      originalPrice: '₺59.90',
      period: 'aylık',
      priceId: STRIPE_CONFIG.prices.monthly,
    },
    yearly: {
      price: '₺449.90',
      originalPrice: '₺599.90',
      period: 'yıllık',
      priceId: STRIPE_CONFIG.prices.yearly,
      savings: '₺150 tasarruf',
    },
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !user) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Create subscription
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          priceId: plans[selectedPlan].priceId,
          userId: user.uid,
          userEmail: user.email,
        }),
      });

      const subscriptionData = await response.json();

      if (!response.ok) {
        throw new Error(subscriptionData.error || 'Ödeme işlemi başarısız oldu');
      }

      // Confirm card payment
      const { error: confirmError } = await stripe.confirmCardPayment(
        subscriptionData.clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      setIsComplete(true);
      toast({
        title: "Başarılı!",
        description: "Premium üyeliğiniz aktif edildi.",
      });

      onSuccess?.();

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Hata",
        description: error.message || "Ödeme işlemi sırasında bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isComplete) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ödeme Başarılı!</h3>
            <p className="text-muted-foreground mb-4">
              Premium üyeliğiniz aktif edildi. Artık tüm premium özelliklerden yararlanabilirsiniz.
            </p>
            <Button onClick={onSuccess} className="w-full">
              Devam Et
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard size={24} />
          Premium Üyelik
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Selection */}
          <div className="space-y-3">
            <Label>Paket Seçin</Label>
            <RadioGroup
              value={selectedPlan}
              onValueChange={(value) => setSelectedPlan(value as 'monthly' | 'yearly')}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">Aylık Plan</span>
                      <p className="text-sm text-muted-foreground">Her ay otomatik yenilenir</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg">{plans.monthly.price}</span>
                      <p className="text-sm text-muted-foreground line-through">{plans.monthly.originalPrice}</p>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-lg p-3 border-primary">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly" className="flex-1 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">Yıllık Plan</span>
                      <p className="text-sm text-muted-foreground">25% indirim • {plans.yearly.savings}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg text-primary">{plans.yearly.price}</span>
                      <p className="text-sm text-muted-foreground line-through">{plans.yearly.originalPrice}</p>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Card Details */}
          <div className="space-y-2">
            <Label>Kart Bilgileri</Label>
            <div className="border rounded-lg p-3 bg-muted/50">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                İşleniyor...
              </>
            ) : (
              `Ödeme Yap - ${plans[selectedPlan].price}/${plans[selectedPlan].period}`
            )}
          </Button>

          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full"
              disabled={isProcessing}
            >
              İptal
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

const StripeCheckout = (props: StripeCheckoutProps) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

export default StripeCheckout;

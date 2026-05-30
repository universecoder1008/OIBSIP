import { paymentAPI } from './api'
import toast from 'react-hot-toast'

/**
 * Opens the Razorpay popup checkout.
 * @param {object} options
 * @param {number}   options.amount        - Amount in rupees (will be × 100 on backend)
 * @param {object}   options.user          - { name, email, phone }
 * @param {function} options.onSuccess     - Called with { razorpay_payment_id, razorpay_order_id, razorpay_signature }
 * @param {function} options.onFailure     - Called when payment dismissed or failed
 */
export const openRazorpay = async ({ amount, user, onSuccess, onFailure }) => {
  try {
    // 1. Create Razorpay order on backend
    const { data: orderData } = await paymentAPI.createOrder(amount)

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,   // Add to .env
      amount: orderData.amount,   // paise from backend
      currency: 'INR',
      name: 'PizzAIa',
      description: 'Pizza Order Payment',
      order_id: orderData.id,
      prefill: {
        name:  user?.name  || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      theme: { color: '#e8521a' },
      handler: async (response) => {

  

  onSuccess?.(response);

},
      modal: {
        ondismiss: () => {
          toast.error('Payment cancelled')
          onFailure?.()
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (res) => {
      toast.error(`Payment failed: ${res.error.description}`)
      onFailure?.(res.error)
    })
    rzp.open()
  } catch (err) {
    toast.error('Could not initiate payment. Please try again.')
    onFailure?.(err)
  }
}

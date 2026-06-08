import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { useAuth, useCart } from '@/hooks'
import { Button } from '@/components/ui'
import { formatCurrency } from '@/utils/helpers'
import { openRazorpay } from '@/services/razorpay'
import { placeOrder } from '@/features/orders/orderSlice'

export default function CheckoutPage() {
  const navigate  = useNavigate()
  const dispatch  = useDispatch()
  const { user }  = useAuth()
  const { items, grand, subtotal, tax, delivery, discount, clear } = useCart()
  const [loading, setLoading]   = useState(false)



  const [address, setAddress] = useState({
  street: '',
  city: '',
  pinCode: '',
})

  useEffect(() => {

  if(user?.address){

    setAddress({
      street: user.address.street || '',
      city: user.address.city || '',
      pinCode: user.address.pinCode || '',
    })

  }

}, [user])
  const set = k => e => setAddress(a => ({ ...a, [k]: e.target.value }))

  const handleCheckout = async () => {
    if (!address.street || !address.city || !address.pinCode) return toast.error('Please fill in delivery address')
    setLoading(true)
    try {
      await openRazorpay({
        amount: grand,
        user:   { name: user?.name, email: user?.email, phone: user?.phone },
        onSuccess: async () => {

  try {

  console.log("PAYMENT SUCCESS");
  console.log("CART ITEMS:", items);

  const orderPayload = {
    items: items.map(item => ({
      pizza: item.name ,
      quantity: item.qty,
      size: item.size || 'Medium',
      base: item.base || null,
      sauce: item.sauce || null,
      cheese: item.cheese || null,
      veggies: item.veggies || [],
      meats: item.meats || []
    })),
    
    totalPrice: grand,
    address: `${address.street}, ${address.city}, ${address.pinCode}`
    
  };
  

  console.log(orderPayload);

 const res = await dispatch(placeOrder(orderPayload));

console.log("RESULT:", res);

clear();

navigate('/orders');

toast.success('Order placed successfully');

} catch(err) {

  console.log(err);

} finally {

    setLoading(false);

  }

},
        onFailure: () => setLoading(false),
      })
    } catch {
      setLoading(false)
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl mb-6">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Left: Address */}
        <div className="bg-surface border border-[#333] rounded-2xl p-5">
          <h2 className="font-semibold mb-4 text-[#a89f94] text-xs uppercase tracking-wider">Delivery Address</h2>
          <div className="space-y-4">
            <div><label className="form-label">Street / Area</label><input value={address.street} onChange={set('street')} placeholder="42 Raj Nagar" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="form-label">City</label><input value={address.city} onChange={set('city')} placeholder="Gwalior" /></div>
              <div><label className="form-label">PIN Code</label><input value={address.pinCode} onChange={set('pinCode')} placeholder="474001" maxLength={6} /></div>
            </div>
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="bg-surface border border-[#333] rounded-2xl p-5">
          <h2 className="font-semibold mb-4 text-[#a89f94] text-xs uppercase tracking-wider">Order Summary</h2>
          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {items.map((i, index) => (
  <div
    key={`${i.id}-${index}`}
    className="flex justify-between text-sm"
  >
                <span className="text-[#a89f94] truncate max-w-[70%]">{i.name} ×{i.qty}</span>
                <span>{formatCurrency(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#333] pt-3 space-y-1.5">
            <div className="flex justify-between text-xs text-[#6b6460]"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between text-xs text-[#6b6460]"><span>Tax + Delivery</span><span>{formatCurrency(tax + delivery)}</span></div>
            {discount > 0 && <div className="flex justify-between text-xs text-green-400"><span>Discount</span><span>-{formatCurrency(discount)}</span></div>}
            <div className="flex justify-between font-bold text-[#f0ebe3] pt-2 border-t border-[#333]">
              <span>Total</span><span className="text-brand">{formatCurrency(grand)}</span>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handleCheckout} loading={loading} className="w-full justify-center py-4 text-base mt-5">
        💳 Pay {formatCurrency(grand)} via Razorpay
      </Button>
      <p className="text-center text-xs text-[#6b6460] mt-2">
        🔒 Secured by Razorpay · UPI, Cards, NetBanking accepted
      </p>
    </div>
  )
}

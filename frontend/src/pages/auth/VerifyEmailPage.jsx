import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

import AuthCard from '@/components/auth/AuthCard'
import { verifyEmail } from '@/features/auth/authSlice'



export default function VerifyEmailPage() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { token } = useParams()
  const hasVerified = useRef(false)

  console.log("FRONTEND TOKEN:", token)

 useEffect(() => {

  if (hasVerified.current) return

  hasVerified.current = true

  const verify = async () => {

    const res = await dispatch(
      verifyEmail(token)
    )

    console.log(res)

    if (
      res.meta.requestStatus === 'fulfilled'
    ) {

      toast.success('Email verified!')

      navigate('/login')

    } else {

      toast.error('Verification failed')
    }
  }

  if (token) {
    verify()
  }

}, [dispatch, token, navigate])

  return (
    <AuthCard
      title="Verify"
      highlight="Email"
      subtitle="Verifying your email..."
    >
      <div className="text-center text-6xl">
        📧
      </div>
    </AuthCard>
  )
}
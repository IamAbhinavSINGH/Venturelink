'use client'

import { useSearchParams } from 'next/navigation'
import { LoginForm } from "../../components/landing/LoginForm"

export default function Signin() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') as 'investor' | 'founder' || 'founder'

  if (!role || (role !== 'investor' && role !== 'founder')) {
    return <div>Invalid role specified</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <LoginForm role={role} />
    </div>
  )
}
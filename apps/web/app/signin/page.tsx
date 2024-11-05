'use client'

import { useSearchParams } from 'next/navigation'
import { SignInForm } from "../../components/landing/SignInForm"

export default function signin() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') as 'investor' | 'founder' || 'founder';

  if (!role || (role !== 'investor' && role !== 'founder')) {
    return <div>Invalid role specified</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SignInForm role={role} />
    </div>
  )
}
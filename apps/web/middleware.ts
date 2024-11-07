import db from "@repo/db/client"
import { withAuth } from "next-auth/middleware"
import { NextResponse  } from "next/server"

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token
    const reqUrl = req.nextUrl.pathname

    if (reqUrl.startsWith('/api')) {
      if (!token) {
        console.log("No token found, redirecting to home")
        return NextResponse.json({ message : "Not Authorized" } , { status : 401 });
      }

      // Proceed with the request
      const response = NextResponse.next()
      response.headers.set('x-username', token.username as string);
      response.headers.set('x-type' , token.type as string);
      return response
    }

    if(reqUrl.startsWith('/investor') || reqUrl.startsWith('/founder')){
      if(!token){
        return NextResponse.redirect(new URL(`${process.env.NEXTAUTH_URL}/auth`));
      }

      const type = token.type as string;

      if(reqUrl.startsWith('/investor') && type === 'founder'){
        return NextResponse.redirect(new URL(`${process.env.NEXTAUTH_URL}/auth`));
      }
      if(reqUrl.startsWith('/founder') && type === 'investor'){
        return NextResponse.redirect(new URL(`${process.env.NEXTAUTH_URL}/auth`));
      }
      
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [ '/api/:path*' , '/investor/:path*' , '/founder/:path*']
}

// If you need additional validation, you can keep this function
// async function validateUserWithAPI(token: string, req: NextRequest) {
//   const apiUrl = new URL('/api/founder', req.url)
//   try {
//     const response = await fetch(apiUrl, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     })

//     if (!response.ok) {
//       console.error('API validation failed:', response.statusText)
//       return false
//     }

//     const data = await response.json()
//     return data.isValid
//   } catch (error) {
//     console.error('Error validating user:', error)
//     return false
//   }
// }

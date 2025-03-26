'use client'
import { CorbadoAuth, useCorbado } from "@corbado/react";
import { useRouter } from "next/navigation";

export function Login() {
    const { loading, isAuthenticated } = useCorbado()
    const router = useRouter()

    if (loading) return <div>Loading...</div>

    if (isAuthenticated) router.push("/dashboard")

    return <div>
        <CorbadoAuth onLoggedIn={() => { router.push("/dashboard") }} />
    </div>
}

export default Login
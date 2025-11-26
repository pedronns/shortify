import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

const API = import.meta.env.VITE_API_URL

export default function OpenLink() {
    const { code } = useParams()
    const [password, setPassword] = useState("")
    const [protectedLink, setProtectedLink] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Checks if the link exists and if it's protected
    useEffect(() => {
        async function fetchLinkInfo() {
            try {
                const res = await fetch(`${API}/info/${code}`)
                const data = await res.json()

                if (!res.ok) {
                    setError(data.error || "Link não encontrado")
                    setLoading(false)
                    return
                }

                if (data.protected) {
                    setProtectedLink(true)
                } else {
                    // redireciona direto
                    window.location.href = data.url
                }
            } catch {
                setError("Erro de conexão com o servidor")
            } finally {
                setLoading(false)
            }
        }

        fetchLinkInfo()
    }, [code])

    // Tenta desbloquear link protegido
    async function handleUnlock(e) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const res = await fetch(`${API}/${code}/unlock`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Senha incorreta")
                setLoading(false)
                return
            }

            // Redireciona para a URL original
            window.location.href = data.url
        } catch {
            setError("Erro de conexão com o servidor")
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <p>Carregando...</p>
    if (error) return <p style={{ color: "red" }}>{error}</p>

    return protectedLink ? (
        <div>
            <h1>Link protegido</h1>
            <p>Digite a senha para acessar o conteúdo.</p>
            <form onSubmit={handleUnlock}>
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button disabled={loading}>
                    {loading ? "Validando..." : "Desbloquear"}
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    ) : null
}

import { useState } from "react"
import { useParams } from "react-router-dom"

const API = import.meta.env.VITE_API_URL

export default function UnlockLink() {
  const { code } = useParams()
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleUnlock(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`${API}/${code}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Senha incorreta")
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

  return (
    <div>
      <h1>Link protegido</h1>
      <p>Digite a senha para acessar o conteúdo.</p>

      <form onSubmit={handleUnlock}>
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button disabled={loading}>
          {loading ? "Validando..." : "Desbloquear"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}

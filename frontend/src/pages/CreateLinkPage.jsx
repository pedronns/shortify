import { useState, useRef } from "react"
import { createRandomLink, createCustomLink } from "../api/links"
import LinkResult from "../components/LinkResult"

export default function CreateLink() {
  const [url, setUrl] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [protectedLink, setProtectedLink] = useState(false)
  const [useCode, setUseCode] = useState(false)
  const inputRef = useRef(null)

  function isValidHttpUrl(string) {
    try {
      const testUrl = new URL(string)
      return testUrl.protocol === "http:" || testUrl.protocol === "https:"
    } catch (_) {
      return false
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setResult(null)

    if (!url.trim()) {
      setResult({ error: "URL é obrigatória" })
      return
    }

    if (!isValidHttpUrl(url)) {
      setResult({ error: "URL inválida" })
      return
    }

    if (useCode && !code.trim()) {
      setResult({ error: "Digite o código customizado" })
      return
    }

    setLoading(true)

    try {
      let data
      if (useCode) {
        data = await createCustomLink({ url, password: protectedLink ? password : "" , code})
      } else {
        data = await createRandomLink({ url, password: protectedLink ? password : "" })
      }

      setResult(data)
      setUrl("")
      setPassword("")
      setCode("")
      setProtectedLink(false)
      setUseCode(false)
      inputRef.current.focus()
    } catch (err) {
      console.log("Erro do backend:", err)
      setResult({ error: err.error || "Erro de conexão com o servidor" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Criar link curto</h1>

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          autoFocus
          required
        />

        

        {/* Checkbox para código customizado */}
        <label>
          <input
            type="checkbox"
            checked={useCode}
            onChange={() => setUseCode(!useCode)}
          />
          Código customizado
        </label>

        {useCode && (
          <input
            type="text"
            placeholder="Código customizado"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        )}

        {/* Checkbox para senha */}
        <label>
          <input
            type="checkbox"
            checked={protectedLink}
            onChange={() => setProtectedLink(!protectedLink)}
          />
          Senha
        </label>

        {protectedLink && (
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Gerando..." : "Gerar"}
        </button>
      </form>

      {result && <LinkResult link={result} />}
    </div>
  )
}

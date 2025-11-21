const API = import.meta.env.VITE_API_URL;

export default function LinkResult({ link }) {
  if (!link) return null;

  const shortUrl = `${API}/${link.code}`;

  function copy() {
    navigator.clipboard.writeText(shortUrl);
    alert("Link copiado!");
  }

  return (
    <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
      <h3>Link criado com sucesso!</h3>

      <p>
        <strong>Original:</strong> {link.url}
      </p>

      <p>
        <strong>Encurtado:</strong>{" "}
        <a href={shortUrl} target="_blank" rel="noreferrer">
          {shortUrl}
        </a>
      </p>

      {link.protected && (
        <p style={{ color: "purple" }}>
          🔒 Este link está protegido por senha
        </p>
      )}

      <button onClick={copy}>Copiar</button>
    </div>
  );
}

const API = import.meta.env.VITE_API_URL

import { useEffect, useState } from "react"
import { CreateQrCode } from "../api/qrCode"

export default function LinkResult({ link }) {
    if (!link) return null

    const [qrCode, setQrCode] = useState(null)
    console.log("Base64:", qrCode)

    const shortUrl = `${API}/${link.code}`

    useEffect(() => {
        async function loadQr() {
            try {
                const base64 = await CreateQrCode(
                    shortUrl,
                    link.mainColor,
                    link.secondaryColor
                )

                setQrCode(base64)
                console.log("B64:", base64)
            } catch (err) {
                console.log("Erro QR:", err)
            }
        }

        loadQr()
    }, [shortUrl, link.mainColor, link.secondaryColor])

    function copy() {
        navigator.clipboard.writeText(shortUrl)
        alert("Link copiado!")
    }

    return (
        <div className="card mt-4 w-50 mx-auto shadow-sm">
            <div className="card-body">
                <h3 className="card-title text-center mb-3">
                    Link criado com sucesso!
                </h3>

                <p className="mb-2">
                    <strong>Original:</strong> {link.url}
                </p>

                <p className="mb-2">
                    <strong>Encurtado:</strong>{" "}
                    <a href={shortUrl} target="_blank" rel="noreferrer">
                        {shortUrl}
                    </a>
                </p>

                {link.protected && (
                    <p className="text-primary fw-bold">
                        Este link está protegido por senha
                    </p>
                )}

                {/* QR CODE */}
                {!qrCode && (
                    <div className="d-flex justify-content-center my-3">
                        <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                        </div>
                    </div>
                )}

                {qrCode && (
                    <div className="text-center my-3">
                        <img
                            src={`data:image/png;base64,${qrCode}`}
                            alt="QR Code"
                            className="img-fluid"
                            style={{ maxWidth: "200px" }}
                        />
                    </div>
                )}

                <button className="btn btn-secondary w-25 mt-3" onClick={copy}>
                    Copiar
                </button>
            </div>
        </div>
    )
}

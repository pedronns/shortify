import { useState, useRef } from "react"
import { createRandomLink, createCustomLink } from "../api/links"
import "../App.css"

import LinkResult from "../components/LinkResult"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"

export default function CreateLink() {
    const [url, setUrl] = useState("")
    const [password, setPassword] = useState("")
    const [code, setCode] = useState("")
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [protectedLink, setProtectedLink] = useState(false)
    const [useQr, setUseQr] = useState(false)
    const [mainColor, setMainColor] = useState("#000000")
    const [secondaryColor, setSecondaryColor] = useState("#ffffff")
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
                data = await createCustomLink({
                    url,
                    password: protectedLink ? password : "",
                    code,
                })
            } else {
                data = await createRandomLink({
                    url,
                    password: protectedLink ? password : "",
                })
            }

            /* data.mainColor = mainColor
            data.secondaryColor = secondaryColor */

            setResult({ ...data, mainColor, secondaryColor })
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
        <Container
            className="mt-5 p-4 rounded-4 shadow-sm text-center"
            style={{ backgroundColor: "#ffffff" }}
        >
            <h1>Shortify</h1>
            <p>Seu encurtador de links</p>

            <Form onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3">
                    <Col sm={12}>
                        <Form.Control
                            ref={inputRef}
                            type="text"
                            placeholder="Insira a URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            autoFocus
                            required
                        />
                    </Col>
                </Form.Group>

                <div className="d-flex justify-content-center gap-3 mb-3">
                    <Form.Check
                        type="switch"
                        label="Personalizar"
                        checked={useCode}
                        onChange={() => setUseCode(!useCode)}
                    />

                    <Form.Check
                        type="switch"
                        label="Protegido"
                        checked={protectedLink}
                        onChange={() => setProtectedLink(!protectedLink)}
                    />

                    <Form.Check
                        type="switch"
                        label="QR Code"
                        checked={useQr}
                        onChange={() => setUseQr(!useQr)}
                    />
                </div>

                {useCode && (
                    <Form.Group className="mb-3 w-50 mx-auto">
                        <Form.Control
                            type="text"
                            placeholder="Código customizado"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                    </Form.Group>
                )}

                {protectedLink && (
                    <Form.Group className="mb-3 w-50 mx-auto">
                        <Form.Control
                            type="password"
                            placeholder="Senha do link"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                )}

                {useQr && (
                    <Row className="mb-3 w-50 mx-auto">
                        <Col sm={6}>
                            <Form.Label>Cor principal</Form.Label>
                            <Form.Control
                                type="color"
                                className="w-50 mx-auto"
                                value={mainColor}
                                onChange={(e) => setMainColor(e.target.value)}
                            />
                        </Col>

                        <Col sm={6}>
                            <Form.Label>Cor secundária</Form.Label>
                            <Form.Control
                                className="w-50 mx-auto"
                                type="color"
                                value={secondaryColor}
                                onChange={(e) =>
                                    setSecondaryColor(e.target.value)
                                }
                            />
                        </Col>
                    </Row>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    className="btn-lg"
                    disabled={loading}
                >
                    {loading ? "Encurtando..." : "Encurtar"}
                </Button>
            </Form>

            {result && <LinkResult link={result} />}
        </Container>
    )
}

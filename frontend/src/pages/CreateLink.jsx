import { useState, useRef, useEffect } from "react"
import { createRandomLink, createCustomLink } from "../api/links"
import "../App.css"

import { isValidUrl, isValidCode, isValidPassword } from "../utils/validators"

import LinkResult from "../components/LinkResult"
import CodeTaken from "../components/CodeTaken"
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
    const [showQrOptions, setShowQrOptions] = useState(false)
    const [validated, setValidated] = useState(false)

    const inputRef = useRef(null)

    /* useEffect(() => {
        if (result) setResult(null)
    }, [useCode, protectedLink, useQr]) */

    async function handleSubmit(e) {
        e.preventDefault()
        setResult(null)
        setValidated(true)

        // Validation checks
        if (!url.trim()) {
            setResult({ error: "URL é obrigatória" })
            return
        }
        if (!isValidUrl(url)) {
            setResult({ error: "URL inválida" })
            return
        }
        if (useCode && !code.trim()) {
            setResult({ error: "Digite o código customizado" })
            return
        }

        setLoading(true)

        try {
            const data = await (useCode
                ? createCustomLink({
                      url,
                      password: protectedLink ? password : "",
                      code,
                  })
                : createRandomLink({
                      url,
                      password: protectedLink ? password : "",
                  }))

            setResult({ ...data, mainColor, secondaryColor })
            // Reset fields
            setUrl("")
            setPassword("")
            setCode("")
            setShowQrOptions(false)
            inputRef.current.focus()
        } catch (err) {
            console.log("Erro do backend:", err)
            if (err.error === "CODE_TAKEN") {
                setResult({ error: "Código já utilizado" })
            } else {
                setResult({
                    error: err.error || "Erro de conexão com o servidor",
                })
            }
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

            <Form noValidate onSubmit={handleSubmit}>
                <Form.Group as={Row} className="mb-3">
                    <Col sm={12}>
                        <Form.Control
                            ref={inputRef}
                            type="text"
                            placeholder="Insira a URL"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value)
                                setValidated(false)
                            }}
                            autoFocus
                            required
                            isValid={
                                validated &&
                                isValidUrl(url) &&
                                url.trim() !== ""
                            }
                            isInvalid={
                                validated &&
                                (url.trim() === "" || !isValidUrl(url))
                            }
                        />

                        <Form.Control.Feedback type="invalid">
                            Informe uma URL válida com http:// ou https://.
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>

                <div className="d-flex justify-content-center gap-3 mb-3">
                    <Form.Check
                        type="switch"
                        label="Personalizar"
                        checked={useCode}
                        onChange={() => {
                            setUseCode(!useCode)
                            setValidated(false)
                        }}
                    />

                    <Form.Check
                        type="switch"
                        label="Protegido"
                        checked={protectedLink}
                        onChange={() => {
                            setProtectedLink(!protectedLink)
                            setValidated(false)
                        }}
                    />

                    <Form.Check
                        type="switch"
                        label="QR Code"
                        checked={useQr}
                        onChange={() => {
                            setUseQr(!useQr)
                            setShowQrOptions(!useQr)
                            setValidated(false)
                        }}
                    />
                </div>

                {useCode && (
                    <Form.Group className="mb-3 w-50 mx-auto">
                        <Form.Control
                            type="text"
                            placeholder="Código customizado"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value)
                                setValidated(false)
                            }}
                            required
                            isInvalid={validated && !isValidCode(code)}
                            isValid={validated && isValidCode(code)}
                        />
                        <Form.Control.Feedback type="invalid">
                            O código deve ter entre 6 e 20 caracteres e conter
                            apenas letras, números, '_' ou '-'.
                        </Form.Control.Feedback>
                    </Form.Group>
                )}

                {protectedLink && (
                    <Form.Group className="mb-3 w-50 mx-auto">
                        <Form.Control
                            type="password"
                            placeholder="Senha do link"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setValidated(false)
                            }}
                            required
                            isInvalid={validated && !isValidPassword(password)}
                            isValid={validated && isValidPassword(password)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Use 8-50 caracteres, com maiúsculas,
                            minúsculas, número e símbolo.
                        </Form.Control.Feedback>
                    </Form.Group>
                )}

                {showQrOptions && (
                    <Row className="mb-3 w-50 mx-auto">
                        <Col sm={6}>
                            <Form.Label>Cor principal</Form.Label>
                            <Form.Control
                                type="color"
                                className="w-50 mx-auto"
                                value={mainColor}
                                onChange={(e) => {
                                    setMainColor(e.target.value)
                                    setValidated(false)
                                }}
                            />
                        </Col>

                        <Col sm={6}>
                            <Form.Label>Cor secundária</Form.Label>
                            <Form.Control
                                className="w-50 mx-auto"
                                type="color"
                                value={secondaryColor}
                                onChange={(e) => {
                                    setSecondaryColor(e.target.value)
                                    setValidated(false)
                                }}
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

            {/* TODO: Make this actually show up */}
            {result?.error === "CODE_TAKEN" && <CodeTaken code={result.code} />}

            {result && !result.error && (
                <LinkResult link={result} useQr={useQr} />
            )}
        </Container>
    )
}

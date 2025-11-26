const express = require("express")
const cors = require("cors")
const { json } = require("express")
const { handleRedirect, unlockLink, createShortLink } = require("./services.js")
const { isValidUrl, isValidCode, isValidPassword } = require("./validators.js")
const db = require("../models/index.js")
const { Link } = db

const app = express()
const port = 3003

app.use(cors())
app.use(json())

// Create random short link
app.post("/random", async (req, res) => {
    const { url, password } = req.body
    const code = Math.random().toString(36).slice(2, 10)

    if (!isValidUrl(url)) {
        return res.status(400).json({ error: "Invalid URL" })
    }

    if (password && !isValidPassword(password)) {
        return res.status(400).json({ error: "Invalid password format" })
    }

    try {
        const shortLink = await createShortLink(url, code, password, false)
        console.log(
            `Short link created: http://localhost:${port}/${shortLink.code}`
        )
        res.status(201).json(shortLink)
    } catch (error) {
        console.error(`Error creating short link: ${error}`)
        res.status(500).json({ error: "Error creating short link" })
    }
})

// custom code
app.post("/custom", async (req, res) => {
    const { url, code, password } = req.body

    if (!isValidUrl(url)) {
        return res.status(400).json({ error: "INVALID_URL" })
    }

    if (!isValidCode(code)) {
        return res.status(400).json({ error: "INVALID_CODE_FORMAT" })
    }

    if (password && !isValidPassword(password)) {
        return res.status(400).json({ error: "INVALID_PASSWORD_FORMAT" })
    }

    try {
        const shortLink = await createShortLink(url, code, password, true)
        console.log(
            `Short link created: http://localhost:${port}/${shortLink.code}`
        )
        res.status(201).json(shortLink)
    } catch (error) {
        if (error.message === "CODE_TAKEN") {
            return res.status(409).json({ error: "CODE_TAKEN" })
        }

        console.error(`Error creating short link: ${error}`)
        res.status(500).json({ error: "SERVER_ERROR" })
    }
})

// redirecting route
app.get("/:code", async (req, res) => {
    const { code } = req.params
    const { password } = req.query

    try {
        const originalUrl = await handleRedirect(code, password)
        return res.redirect(301, originalUrl)
    } catch (error) {
        if (error.message === "NOT_FOUND") {
            return res.status(404).json({ error: "Link not found" })
        }

        if (error.message === "NEED_PASSWORD") {
            return res
                .status(401)
                .json({ error: "Password required", protected: true })
        }

        console.error(`Failed to redirect: ${error}`)
        return res.status(500).json({ error: "Server error" })
    }
})

// checks if the link exists and if it's protected
app.get("/info/:code", async (req, res) => {
    const { code } = req.params

    try {
        const link = await Link.findOne({ where: { code } })
        if (!link) return res.status(404).json({ error: "NOT_FOUND" })

        res.json({
            protected: link.protected,
            url: link.protected ? null : link.url,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Server error" })
    }
})

app.post("/:code/unlock", async (req, res) => {
    const { password } = req.body
    const { code } = req.params

    try {
        const url = await unlockLink(code, password)
        return res.status(200).json({ url })
    } catch (error) {
        if (error.message === "NOT_FOUND") {
            return res.status(404).json({ error: "Link not found" })
        }

        if (error.message === "NOT_PROTECTED") {
            return res.status(400).json({ error: "This link is not protected" })
        }

        if (error.message === "INVALID_PASSWORD") {
            return res.status(401).json({ error: "Invalid password" })
        }

        console.error(`Failed to unlock: ${error}`)
        return res.status(500).json({ error: "Server error" })
    }
})

// deleting route
app.delete("/:code", async (req, res) => {
    const { code } = req.params

    try {
        const link = await Link.findOne({ where: { code } })
        if (!link) {
            return res.status(404).json({ error: "Link not found" })
        }

        console.log(`Deleting: ${code}, URL: ${link.url}`)
        await link.destroy()

        return res.sendStatus(204)
    } catch (error) {
        console.error(`Error deleting link: ${error}`)
        return res
            .status(500)
            .json({ error: "Error deleting the specified link" })
    }
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})

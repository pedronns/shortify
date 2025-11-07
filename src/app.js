const express = require("express")
const { json } = require("express")
const { createShortLink, handleRedirect, isValidUrl } = require("./services.js")
const db = require("../models")
const { Link } = db

const app = express()
const port = 3003
app.use(json())

// Create short link
app.post("/url", async (req, res) => {
    const { query } = req.body

    if (!isValidUrl(query)) {
        return res.status(400).json({ error: "Invalid URL" })
    }

    try {
        const shortLink = await createShortLink(query)
        console.log(
            `Short link created: http://localhost:${port}/${shortLink.shortCode}`
        )
        res.status(201).json(shortLink)
    } catch (error) {
        console.error(`Error creating short link: ${error}`)
        res.status(500).json({ error: "Error creating short link" })
    }
})

// redirecting route
app.get("/:shortCode", async (req, res) => {
    const { shortCode } = req.params

    try {
        const originalUrl = await handleRedirect(shortCode)
        return res.redirect(301, originalUrl)
    } catch (error) {
        if (error.message === "NOT_FOUND") {
            return res.status(404).json({ error: "Link not found" })
        }
        console.error(`Failed to redirect: ${error}`)
        return res.status(500).json({ error: "Server error" })
    }
})

// deleting route
app.delete("/:shortCode", async (req, res) => {
    const { shortCode } = req.params

    try {
        const link = await Link.findOne({ where: { shortCode } })
        if (!link) {
            return res.status(404).json({ error: "Link not found" })
        }

        console.log(`Deleting: ${shortCode}, URL: ${link.originalUrl}`)
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

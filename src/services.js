const { Link } = require("../models/index")

function isValidUrl(str) {
    try {
        const { protocol } = new URL(str)
        return protocol === 'http:' || protocol === 'https:'
    } catch (_) {
        return false
    }
}

async function createShortLink(originalUrl) {
    const shortCode = Math.random().toString(36).slice(2, 10)
    return await Link.create({ originalUrl, shortCode, clicks: 0 })
}

async function handleRedirect(shortCode) {
    const link = await Link.findOne({ where: { shortCode } })

    if (!link) {
        throw new Error("NOT_FOUND")
    }

    link.clicks += 1
    await link.save()
    return link.originalUrl
}

module.exports = { createShortLink, handleRedirect, isValidUrl }

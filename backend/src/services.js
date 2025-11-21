const { Link } = require("../models/index")
const bcrypt = require("bcrypt")

async function createShortLink(url, code, password) {
    let passwordHash = null
    let isProtected = false

    if (password) {
        passwordHash = await bcrypt.hash(password, 10)
        isProtected = true
    }

    const taken = await Link.findOne({ where: { code } })
    if (taken) {
        throw new Error("CODE_TAKEN")
    }

    const created = await Link.create({
        url,
        code,
        clicks: 0,
        passwordHash,
        protected: isProtected,
    })

    return {
        url: created.url,
        code: created.code,
        protected: created.protected,
    }
}

async function unlockLink(code, password) {
    const link = await Link.findOne({ where: { code } })

    if (!link) {
        throw new Error("NOT_FOUND")
    }

    if (!link.protected) {
        throw new Error("NOT_PROTECTED")
    }

    const match = await bcrypt.compare(password, link.passwordHash)

    if (!match) {
        throw new Error("INVALID_PASSWORD")
    }

    return link.url
}

async function handleRedirect(code, password) {
    const link = await Link.findOne({ where: { code } })

    if (!link) {
        throw new Error("NOT_FOUND")
    }

    if (link.protected) {
        if (!password) {
            throw new Error("NEED_PASSWORD")
        }

        const match = await bcrypt.compare(password, link.passwordHash)
        if (!match) {
            throw new Error("INVALID_PASSWORD")
        }
    }

    link.clicks += 1
    await link.save()
    return link.url
}

module.exports = { handleRedirect, createShortLink, unlockLink }

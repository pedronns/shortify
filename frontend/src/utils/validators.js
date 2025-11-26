// frontend/src/utils/validators.js
export function isValidUrl(str) {
    try {
        const { protocol } = new URL(str)
        return protocol === "http:" || protocol === "https:"
    } catch (_) {
        return false
    }
}

export function isValidCode(code) {
    return /^[a-zA-Z0-9_-]{6,20}$/.test(code)
}

export function isValidPassword(password) {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/
    return passwordRegex.test(password)
}



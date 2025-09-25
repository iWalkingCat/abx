// Base58 encoding function
export function bs58Encode(bytes: Uint8Array): string {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    const base = alphabet.length

    let num = 0n
    for (let i = 0; i < bytes.length; i++) {
        num = num * 256n + BigInt(bytes[i])
    }

    let result = ''
    while (num > 0) {
        const remainder = Number(num % BigInt(base))
        result = alphabet[remainder] + result
        num = num / BigInt(base)
    }

    // Add leading zeros
    for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
        result = '1' + result
    }

    return result
}

// Hex to binary decoder function
export function hexToBinUnsafe(hex: string): Uint8Array {
    const bytes = []
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.slice(i, i + 2), 16))
    }
    return new Uint8Array(bytes)
}

// Convert contract ID to address
export function addressFromContractId(contractId: string): string {
    const P2C = 0x03
    const hash = hexToBinUnsafe(contractId)
    const bytes = new Uint8Array([P2C, ...hash])
    return bs58Encode(bytes)
}
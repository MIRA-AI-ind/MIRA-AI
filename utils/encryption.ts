import { Buffer } from 'buffer'

export const encryptChat = (chat: any) => {
  try {
    // Convert chat object to string
    const chatString = JSON.stringify(chat)
    // Basic encryption (you can make this more secure)
    const encrypted = Buffer.from(chatString).toString('base64')
    return encrypted
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt chat')
  }
}

export const decryptChat = (encrypted: string) => {
  try {
    // Decrypt base64 back to string
    const decrypted = Buffer.from(encrypted, 'base64').toString('utf-8')
    // Parse back to object
    return JSON.parse(decrypted)
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Invalid or corrupted .mira file')
  }
} 
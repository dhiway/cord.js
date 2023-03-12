/**
 * CORD network participants can communicate via a 1:1 messaging system.
 *
 * All messages are **encrypted** with the encryption keys of the involved identities.
 * Messages are encrypted using authenticated encryption: the two parties authenticate to each other, but the message authentication provides repudiation possibilities.
 *
 * The [[Message]] class exposes methods to construct and verify messages.
 *
 * @module @cord.network/messaging
 */

export * from './Message.js'

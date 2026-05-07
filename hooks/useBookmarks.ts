"use client"

import { useState, useEffect, useCallback } from "react"

export interface Bookmark {
  id: number
  name: string
  slug: string
  designer: string
  category: string
  logoUrl: string
}

const STORAGE_KEY = "logo-inspo-bookmarks"

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setBookmarks(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Failed to load bookmarks:", error)
    }
    setIsLoaded(true)
  }, [])

  const saveBookmarks = useCallback((newBookmarks: Bookmark[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks))
      setBookmarks(newBookmarks)
    } catch (error) {
      console.error("Failed to save bookmarks:", error)
    }
  }, [])

  const addBookmark = useCallback(
    (logo: Bookmark) => {
      if (!bookmarks.some((b) => b.id === logo.id)) {
        saveBookmarks([...bookmarks, logo])
      }
    },
    [bookmarks, saveBookmarks]
  )

  const removeBookmark = useCallback(
    (id: number) => {
      saveBookmarks(bookmarks.filter((b) => b.id !== id))
    },
    [bookmarks, saveBookmarks]
  )

  const toggleBookmark = useCallback(
    (logo: Bookmark) => {
      if (bookmarks.some((b) => b.id === logo.id)) {
        removeBookmark(logo.id)
      } else {
        addBookmark(logo)
      }
    },
    [bookmarks, addBookmark, removeBookmark]
  )

  const isBookmarked = useCallback(
    (id: number) => {
      return bookmarks.some((b) => b.id === id)
    },
    [bookmarks]
  )

  const clearBookmarks = useCallback(() => {
    saveBookmarks([])
  }, [saveBookmarks])

  return {
    bookmarks,
    isLoaded,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearBookmarks,
  }
}

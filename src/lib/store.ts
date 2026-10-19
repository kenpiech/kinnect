"use client";

import { useSyncExternalStore } from "react";
import { personByHandle, seedPosts, type SeedPost } from "@/data/people";

// The only code that touches localStorage. Everything Kinnect remembers lives
// under one versioned key, so a real database can replace this file later
// without the pages changing.

const KEY = "kinnect:v1";
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
// A gap this long since you were last here counts as a new visit
const NEW_VISIT_GAP = 30 * 60 * 1000;

export type MyPost = { id: string; text: string; createdAt: number };

export type State = {
  firstVisit: number | null;
  // When you were last active, and when you were last active before this visit
  lastSeen: number | null;
  previousVisit: number | null;
  name: string;
  friends: string[]; // handles, in the order you added them
  myPosts: MyPost[];
  // A one-time message for the next page to show, e.g. after adding a friend
  flash: string | null;
};

export type FeedPost = {
  id: string;
  author: string; // a handle, or "me"
  text: string;
  at: number;
};

const empty: State = {
  firstVisit: null,
  lastSeen: null,
  previousVisit: null,
  name: "You",
  friends: [],
  myPosts: [],
  flash: null,
};

let state: State = empty;
let loaded = false;
let storageOk = true;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...empty, ...JSON.parse(raw) };
  } catch {
    storageOk = false;
  }
}

function save(next: State) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private browsing or blocked storage: keep working for this visit
    storageOk = false;
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changed something: reload from storage
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    loaded = false;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

// Null on the server and during the first client render, so pages can show a
// placeholder instead of guessing and flashing the wrong screen.
export function useStore(): State | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export function isStorageOk() {
  return storageOk;
}

// Call once when the app opens. Starts the clock on the first visit and, if
// you've been away a while, remembers when you were last here so the feed can
// show what's new since then.
export function startSession(now = Date.now()) {
  load();
  const s = state;
  const away = s.lastSeen !== null && now - s.lastSeen > NEW_VISIT_GAP;
  save({
    ...s,
    firstVisit: s.firstVisit ?? now,
    previousVisit: away ? s.lastSeen : s.previousVisit,
    lastSeen: now,
  });
}

// When a sample post goes live. Day 0 posts land in the 24 hours before your
// first visit, so the network already has a history when you arrive.
export function visibleAt(post: SeedPost, firstVisit: number) {
  return firstVisit + (post.dayOffset - 1) * DAY + post.hour * HOUR;
}

// Everyone's posts that are live now, newest first. Used on the welcome screen.
export function livePosts(s: State, now = Date.now()): FeedPost[] {
  const start = s.firstVisit ?? now;
  return seedPosts
    .map((p) => ({ id: p.id, author: p.author, text: p.text, at: visibleAt(p, start) }))
    .filter((p) => p.at <= now)
    .sort((a, b) => b.at - a.at);
}

// Your feed: your friends' live posts plus your own, newest first.
export function feed(s: State, now = Date.now()): FeedPost[] {
  const friends = new Set(s.friends);
  const mine = s.myPosts.map((p) => ({ id: p.id, author: "me", text: p.text, at: p.createdAt }));
  return [...livePosts(s, now).filter((p) => friends.has(p.author)), ...mine].sort((a, b) => b.at - a.at);
}

// Friends' posts that went live since your previous visit.
export function newSinceLastVisit(s: State, now = Date.now()): FeedPost[] {
  if (s.previousVisit === null) return [];
  return feed(s, now).filter((p) => p.author !== "me" && p.at > s.previousVisit!);
}

// "yesterday", "Sunday", "Oct 3": when you were last here, in words.
export function sinceWhen(at: number, now = Date.now()) {
  const day = (t: number) => new Date(t).setHours(0, 0, 0, 0);
  const days = Math.round((day(now) - day(at)) / DAY);
  if (days <= 0) return "earlier today";
  if (days === 1) return "yesterday";
  if (days < 7) return new Date(at).toLocaleDateString("en-US", { weekday: "long" });
  return new Date(at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function normalizeHandle(input: string) {
  return input.trim().replace(/^@/, "").toLowerCase();
}

export type AddResult = { ok: true; handle: string; postCount: number } | { ok: false; error: string };

// Checks a typed handle and adds that person. The error messages say what to do next.
export function addFriend(input: string): AddResult {
  const handle = normalizeHandle(input);
  if (!handle) return { ok: false, error: "Enter a handle, like @bunkerbill." };
  if (!personByHandle.has(handle)) {
    return { ok: false, error: `No one named @${handle}. Check the spelling or pick someone below.` };
  }
  if (state.friends.includes(handle)) return { ok: false, error: `You're already friends with @${handle}.` };

  const postCount = livePosts(state).filter((p) => p.author === handle).length;
  save({ ...state, friends: [...state.friends, handle] });
  return { ok: true, handle, postCount };
}

export function addAllFriends(handles: string[]) {
  const toAdd = handles.filter((h) => personByHandle.has(h) && !state.friends.includes(h));
  save({ ...state, friends: [...state.friends, ...toAdd] });
  return toAdd.length;
}

export function removeFriend(handle: string) {
  save({ ...state, friends: state.friends.filter((h) => h !== handle) });
}

export const MAX_POST = 280;

export function addPost(text: string): { ok: true } | { ok: false; error: string } {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: "Write something before posting." };
  if (trimmed.length > MAX_POST) {
    const over = trimmed.length - MAX_POST;
    return { ok: false, error: `Cut ${over} character${over === 1 ? "" : "s"} to post.` };
  }
  const post = { id: `me-${Date.now()}`, text: trimmed, createdAt: Date.now() };
  save({ ...state, myPosts: [...state.myPosts, post] });
  return { ok: true };
}

export function setName(name: string): { ok: true } | { ok: false; error: string } {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "Enter a name, or use “You”." };
  if (trimmed.length > 40) return { ok: false, error: "Use 40 characters or fewer." };
  save({ ...state, name: trimmed });
  return { ok: true };
}

export function setFlash(message: string) {
  save({ ...state, flash: message });
}

export function takeFlash() {
  const message = state.flash;
  if (message) save({ ...state, flash: null });
  return message;
}

export function resetAll() {
  save({ ...empty, firstVisit: Date.now(), lastSeen: Date.now() });
}

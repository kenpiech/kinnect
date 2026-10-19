"use client";

import type { Person } from "@/data/people";
import { personByHandle } from "@/data/people";
import type { FeedPost } from "@/lib/store";
import { Avatar, Button } from "./ui";

export function timeAgo(at: number, now = Date.now()) {
  const mins = Math.round((now - at) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

// One post in a feed. Your own posts show your display name.
export function PostCard({ post, myName }: { post: FeedPost; myName: string }) {
  const mine = post.author === "me";
  const person = mine ? null : personByHandle.get(post.author);
  const name = mine ? myName : (person?.name ?? post.author);

  return (
    <article className="flex gap-3 border-b border-ink py-4">
      <Avatar name={name} />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-bold text-base">{name}</span>
          {!mine && <span className="text-muted">@{post.author}</span>}
          <span className="text-muted">· {timeAgo(post.at)}</span>
        </p>
        <p className="mt-1 whitespace-pre-wrap break-words">{post.text}</p>
      </div>
    </article>
  );
}

// A suggested person with a one-line bio and a one-tap Add.
export function PersonCard({
  person,
  added,
  onAdd,
  action,
}: {
  person: Person;
  added?: boolean;
  onAdd?: () => void;
  // Replaces the Add button, e.g. Remove on the friends list
  action?: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-3 border-b border-ink py-3">
      <Avatar name={person.name} />
      <div className="min-w-0 flex-1">
        <p className="font-bold">
          {person.name} <span className="font-normal text-muted">@{person.handle}</span>
        </p>
        <p className="text-sm text-muted">{person.bio}</p>
      </div>
      {action ??
        (added ? (
          <span className="label px-3 text-success">✓ Added</span>
        ) : (
          <Button variant="secondary" className="min-h-11 px-4" onClick={onAdd} aria-label={`Add ${person.name}`}>
            + Add
          </Button>
        ))}
    </li>
  );
}

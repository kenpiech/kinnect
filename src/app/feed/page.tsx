"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PersonCard, PostCard } from "@/components/cards";
import { Avatar, PageHeader, TextLink, Toast, plural, useToast } from "@/components/ui";
import { people, personByHandle } from "@/data/people";
import { addFriend, feed, takeFlash, useStore } from "@/lib/store";

// The main screen: your friends' posts and your own, newest first. No
// algorithm. It's never a blank page: with no friends it suggests people,
// and until you've posted it invites your first post.
export default function Feed() {
  const s = useStore();
  const [toast, setToast] = useToast();

  // Pick up a message left by the page that sent us here ("Added Gus…")
  useEffect(() => {
    const message = takeFlash();
    if (message) setToast(message);
  }, [setToast]);

  if (!s) return <p className="text-muted">Loading…</p>;

  const posts = feed(s);
  const hasPosted = s.myPosts.length > 0;

  function quickAdd(h: string) {
    const result = addFriend(h);
    if (result.ok) setToast(`Added ${personByHandle.get(h)!.name}. ${plural(result.postCount, "post")} in your feed.`);
  }

  if (s.friends.length === 0 && !hasPosted) {
    return (
      <div className="grid gap-8">
        <PageHeader title="Your feed">Add someone, and their posts show up here.</PageHeader>
        <section aria-labelledby="suggested" className="grid gap-1">
          <h2 id="suggested" className="label border-b border-rule pb-2 text-muted">
            People you might know
          </h2>
          <ul>
            {people.slice(0, 4).map((person) => (
              <PersonCard key={person.handle} person={person} onAdd={() => quickAdd(person.handle)} />
            ))}
          </ul>
          <TextLink href="/friends/add" className="mt-3 justify-self-start">
            See everyone
          </TextLink>
        </section>
        <Toast message={toast} />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <PageHeader title="Your feed">
        {plural(s.friends.length, "friend")} · newest first
      </PageHeader>

      {!hasPosted && (
        <Link
          href="/post/new"
          className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 hover:bg-hover"
        >
          <Avatar name={s.name} />
          <span className="flex-1">
            <span className="block font-semibold">What are you up to?</span>
            <span className="block text-[15px] text-muted">Write your first post. Your friends will see it here.</span>
          </span>
        </Link>
      )}

      <section aria-label="Posts">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} myName={s.name} />
        ))}
        <p className="py-8 text-center italic text-muted">
          You&rsquo;re all caught up.{" "}
          <TextLink href="/friends/add" className="not-italic">
            Add more friends
          </TextLink>
        </p>
      </section>

      <Toast message={toast} />
    </div>
  );
}

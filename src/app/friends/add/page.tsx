"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { PersonCard } from "@/components/cards";
import { Button, Field, PageHeader, TextLink, Toast, plural, useToast } from "@/components/ui";
import { people, personByHandle } from "@/data/people";
import { addFriend, setFlash, useStore } from "@/lib/store";

// The main form: add a friend by handle. Errors sit under the field, say
// what to do next, and keep what you typed. Suggestions below are one tap.
export default function AddFriend() {
  const s = useStore();
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [toast, setToast] = useToast();
  const input = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const result = addFriend(handle);
    if (!result.ok) {
      setError(result.error);
      input.current?.focus();
      return;
    }
    const name = personByHandle.get(result.handle)!.name;
    setFlash(`Added ${name}. ${plural(result.postCount, "post")} in your feed.`);
    router.push("/feed");
  }

  function quickAdd(h: string) {
    const result = addFriend(h);
    if (result.ok) setToast(`Added ${personByHandle.get(h)!.name}. ${plural(result.postCount, "post")} in your feed.`);
  }

  const suggestions = s ? people.filter((p) => !s.friends.includes(p.handle)) : [];

  return (
    <div className="grid gap-8">
      <TextLink href="/feed" className="justify-self-start text-[15px] text-muted">
        ← Back to feed
      </TextLink>

      <PageHeader title="Add a friend">Type their handle, and their posts join your feed.</PageHeader>

      <form onSubmit={submit} noValidate className="grid gap-4">
        <Field
          ref={input}
          label="Handle"
          hint="Everyone on Kinnect right now is a sample friend. Their handles are below."
          error={error}
          value={handle}
          onChange={(e) => {
            setHandle(e.target.value);
            if (error) setError(undefined);
          }}
          placeholder="@milemarker"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="done"
        />
        <Button type="submit" className="w-full sm:w-auto sm:justify-self-start">
          Add friend
        </Button>
      </form>

      <section aria-labelledby="suggested" className="grid gap-1">
        <h2 id="suggested" className="label border-b border-rule pb-2 text-muted">
          People you might know
        </h2>
        {s && suggestions.length === 0 ? (
          <p className="py-4 text-muted">You&rsquo;ve added everyone on Kinnect. More people are coming soon.</p>
        ) : (
          <ul>
            {suggestions.map((person) => (
              <PersonCard key={person.handle} person={person} onAdd={() => quickAdd(person.handle)} />
            ))}
          </ul>
        )}
      </section>

      <Toast message={toast} />
    </div>
  );
}

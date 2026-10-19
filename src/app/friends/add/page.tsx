"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { PersonCard } from "@/components/cards";
import { TypeAheadList, matchPeople } from "@/components/TypeAhead";
import { Button, Field, PageHeader, TextLink, Toast, plural, useToast } from "@/components/ui";
import { people, personByHandle } from "@/data/people";
import { addFriend, setFlash, useStore } from "@/lib/store";

// The main form: add a friend by handle. Matches appear as you type (arrow
// keys and Enter pick one). Errors sit under the field, say what to do next,
// and keep what you typed. Suggestions below are one tap.
export default function AddFriend() {
  const s = useStore();
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [toast, setToast] = useToast();
  const input = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const matches = open ? matchPeople(people, handle) : [];
  const showList = matches.length > 0;

  function pick(h: string) {
    setHandle(`@${h}`);
    setOpen(false);
    setActive(-1);
    setError(undefined);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!showList) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? matches.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      pick(matches[active].handle);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
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

      <PageHeader title="Add a friend">Start typing, pick someone, and their posts join your feed.</PageHeader>

      <form onSubmit={submit} noValidate className="grid gap-4">
        <Field
          ref={input}
          label="Name or handle"
          hint="Everyone on Kinnect right now is a sample friend. They're all listed below."
          error={error}
          value={handle}
          onChange={(e) => {
            setHandle(e.target.value);
            setOpen(true);
            setActive(-1);
            if (error) setError(undefined);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => setOpen(false)}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={showList && active >= 0 ? `${listId}-${matches[active].handle}` : undefined}
          below={
            showList && (
              <TypeAheadList
                id={listId}
                matches={matches}
                active={active}
                friends={s?.friends ?? []}
                onPick={(p) => pick(p.handle)}
              />
            )
          }
          placeholder="Start typing a name or @handle"
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

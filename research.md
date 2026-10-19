# How similar tools welcome someone new

Three subagents studied how **Bluesky**, **Threads** and **Mastodon** onboard a brand-new user. Each looked at the first screen, what the app asks for, and how soon you get something useful. They worked from public pages, help docs, release posts, Mastodon's open-source onboarding code and reviews, and did not sign up. Details they couldn't confirm are left out or marked.

## At a glance

| | Bluesky | Threads | Mastodon |
|---|---|---|---|
| **First screen** | A pitch ("Welcome to the social internet") and a sign-up button. No posts. | Real public posts, readable logged out, with a "Log in or sign up" banner. | A pitch ("Social networking that's not for sale"), with "Join mastodon.social" or "Pick another server". |
| **What it asks for** | Email, password, birthday, handle, CAPTCHA, avatar, then interests (seem optional). | Instagram login (or email or phone). Profile imported from Instagram, public or private, follow suggestions, fediverse notice. | Accept rules, username, email, password, **confirm email**, follow suggestions (skippable), profile (no skip link). |
| **Time to value** | A few minutes. Interest picks drive suggested accounts and **starter packs**, with one-tap **Follow All**. | Fastest. Posts show before sign-up, and **Follow all** brings over your Instagram graph. | Slowest. The email round trip, then what Mastodon itself calls a "boring feed" if you skip suggestions. |
| **Empty feed** | Avoided with the Discover feed, the Explore page and suggested accounts. | Avoided with the algorithmic For You feed. | Since 4.3, a **follow-suggestions carousel inside the home feed**. Some servers auto-follow admin accounts. |
| **Reasons to come back** | Notifications, including "activity" alerts when a chosen account posts. | Notifications. Pending follows are followed automatically when those people join. | Notifications and new posts. No designed return hooks found. |
| **Friction people report** | An empty-feeling feed when you follow few people, a noisy Discover feed, confusion about where your own post appears. | An irrelevant, influencer-heavy For You feed (Meta later let people pick a default feed). A username stuck to Instagram. | Choosing a server, finding people, the email wait, an empty Home with no next step. |

## What it means for Kinnect

Kinnect has no sign-up, so it already skips the slowest part of all three. The lessons that carry over:

1. **Show posts before asking for anything.** Threads is the only one of the three that does this, and it's the fastest to value.
2. **Make adding one tap, with an "add all" option.** Bluesky starter packs and Threads' Follow all both work this way.
3. **Put a one-line bio next to every Add button.** Mastodon shows a bio next to each Follow button.
4. **Never show a bare empty feed.** Mastodon now puts suggestions inside the feed itself. Kinnect's feed should do the same whenever you have few friends.
5. **Don't put a required profile step in front of the feed.** All three show the cost of forms before value. Your name can default to "You" and be changed later.
6. **Show only the friends you chose, newest first.** The For You complaints about Threads show what happens when an algorithm hides the people you picked.
7. **Give a gentle first-post prompt.** Bluesky gives none, and new users can't tell where their post went. Kinnect should show your post at the top of the feed with a confirmation.

## Decided for Kinnect's first visit

_To be filled in after review._

## Sources
- Bluesky: https://bsky.social/ · https://bsky.social/about/blog/06-26-2024-starter-packs · https://www.howtogeek.com/how-to-get-started-on-bluesky-a-guide-for-beginners/ · https://techcrunch.com/2025/04/10/blueskys-latest-update-adds-chat-reactions-and-an-explore-page-similar-to-x
- Threads: https://www.threads.com/ · https://about.fb.com/news/2023/07/introducing-threads-new-app-text-sharing/ · https://socialbee.com/blog/how-to-use-threads-app/ · https://www.engadget.com/social-media/threads-will-finally-let-everyone-change-their-default-feed-170001140.html
- Mastodon: https://joinmastodon.org · https://docs.joinmastodon.org/user/signup/ · https://blog.joinmastodon.org/2024/10/mastodon-4.3/ · https://github.com/mastodon/mastodon/tree/main/app/javascript/mastodon/features/onboarding · https://erinkissane.com/mastodon-is-easy-and-fun-except-when-it-isnt

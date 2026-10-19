# Kinnect flows

**Main task:** I add a friend → their posts fill my feed → I come back tomorrow and see what's new since I left.

**Second task:** I write a post → it's at the top of my feed → it's still there when I come back.

## The three flows

```mermaid
flowchart TD
    subgraph first["1 · First visit: useful right away"]
        A([Open Kinnect<br/>nothing saved]) --> B["/ Welcome<br/>People you might know"]
        B -->|"+ Add (one tap)"| C[Their newest post<br/>shows right away]
        C -->|See your feed| F
    end

    subgraph task["2 · Main task: add a friend"]
        N[Nav: Add friend] --> D["/friends/add<br/>Handle field"]
        D -->|Add| V{Valid?}
        V -->|Empty| E1["Enter a handle,<br/>like @bunkerbill."]
        V -->|Not found| E2["No one named @x.<br/>Check the spelling or<br/>pick someone below."]
        V -->|Already friends| E3["You're already<br/>friends with @x."]
        E1 & E2 & E3 -->|Typed text kept| D
        V -->|Yes| F["/feed<br/>Toast: Added @x,<br/>N posts in your feed"]
    end

    subgraph post["Second task: write a post"]
        F -->|Write a post| P["/post/new<br/>280-character box"]
        P -->|Post| PV{Valid?}
        PV -->|Empty| PE1[Write something<br/>before posting.]
        PV -->|Too long| PE2[Cut N characters<br/>to post.]
        PE1 & PE2 -->|Typed text kept| P
        PV -->|Yes| F
    end

    subgraph back["3 · Coming back: it remembers"]
        R([Open Kinnect<br/>a day later]) --> S{Friends saved?}
        S -->|No| B
        S -->|Yes| W["/feed<br/>Welcome back.<br/>N new posts since Sunday"]
        W --> NEW[New posts, then a<br/>New since your last visit divider]
        NEW --> OLD[Older posts]
        OLD --> CU[You're all caught up]
        S -.->|Nothing new| CU
    end
```

## Pages and shared navigation

Every page shares the same top bar. The current page is marked, and every form has a Back link.

```mermaid
flowchart LR
    Nav{{Top bar}} --- Feed["/feed"]
    Nav --- Friends["/friends"]
    Nav --- Add["/friends/add"]
    Nav --- Me["/me"]
    Nav --- Write["/post/new"]
    Welcome["/ (first visit only)"] -.->|after the first add| Feed
```

## States

| State | Where | What the person sees |
|---|---|---|
| First visit | `/` | A one-line pitch and suggested people with **+ Add**. Never an empty feed. |
| Just added | `/feed` | A toast: "Added @x: N posts in your feed." |
| New since last visit | `/feed` | A welcome-back banner with a count, and a divider after the new posts. |
| Caught up | `/feed` | "You're all caught up" at the end of the feed. |
| No friends left | `/feed` | A prompt to add someone, with suggestions (not a blank page). |
| Storage blocked | every page | A notice that changes won't be saved after this visit. The app still works. |

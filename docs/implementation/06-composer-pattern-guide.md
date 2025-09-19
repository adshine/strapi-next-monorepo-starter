# React Composer Pattern Guide

This guide mirrors the video walkthrough: build an unwieldy, prop-driven component first, then refactor it into a composable system using context. Follow the steps in order; each section includes concrete instructions and reflection prompts for the coding agent.

## Part 1 · Embrace the Anti-Pattern (Monolithic User Form)

Purpose: illustrate how a simple component becomes brittle once feature flags accumulate.

1. **Create the baseline `UserForm`.**
   - Render a welcome headline (`"Welcome to [App Name]"`) and subheading (`"Let's create your account."`).
   - Include controlled inputs for `Name`, `Email`, `Username`, a terms checkbox, and a `"Create account"` submit button.
   - Keep state internal to the component.
2. **Add boolean props to support new use cases.**
   - Accept props: `isUpdateForm`, `initialUser`, `renderWelcome = true`, `renderTerms = true`, `redirectToOnboarding = true`.
   - Inject conditional logic:
     - When `isUpdateForm` is true, switch headline to `"Update Account"`, button label to `"Update account"`, and pre-fill fields from `initialUser`.
     - Skip rendering welcome copy and/or terms checkbox when their respective booleans are false.
     - After submission, only redirect if `redirectToOnboarding` remains true.
   - Introduce `onlyEditName`; when true, hide every field except `Name` and suppress non-essential UI.
3. **Reflect on the outcome.**
   - Note the tangled `if` statements and prop explosion.
   - Capture the maintenance risks (unclear API surface, tightly coupled logic, fragile tests).

## Part 2 · Apply the Anti-Pattern to Slack's Composer

Purpose: show that scaling the same tactic to a complex UI is untenable.

1. **Implement a single `Composer` component.**
   - Attempt to power every variant (channel message, thread reply, DM, edit, forward) via boolean props such as `isThread`, `isDMThread`, `isEditing`, `isForwarding`.
   - Nest conditions to tweak labels, layout, and actions per prop combination.
2. **Adopt the configuration-array shortcut.**
   - Pass `actions={[{ icon: 'Plus', onPress: handleAdd, showWhen: !isEditing }, ...]}` down to `Composer`.
   - Map over the array in render, mirroring the speaker’s critique: logic leaks from JSX into data structures, typing and discovery suffer, and the component remains monolithic.
3. **Document the failure points.**
   - Explain why boolean matrices and action arrays degrade readability, testability, and feature velocity.

## Part 3 · Refactor with Composition and Context

Purpose: rebuild Slack’s composer using compound components and provider-driven state.

### 3.1 Define the Compound Component API

1. **Create a `Composer` namespace object.**
   - Export subcomponents as static properties: `Composer.Provider`, `Composer.Frame`, `Composer.Header`, `Composer.Input`, `Composer.Footer`, `Composer.Submit`, `Composer.Dropzone`, plus any specialty pieces (`Composer.TextFormat`, `Composer.Emojis`, `Composer.CommonActions`, `Composer.AlsoSendToChannel`).
2. **Implement context plumbing.**
   - Inside `Composer.Provider`, accept `{ state, actions, meta }` props.
   - Use `React.createContext` to expose the value; build a `useComposerContext()` hook that throws when the provider is missing.
   - Encourage storing non-state references (like `inputRef`) inside `meta` to avoid needless re-renders.

### 3.2 Build Providers for Distinct Scenarios

1. **`ChannelProvider`.**
   - Wraps `Composer.Provider`.
   - Pulls channel state via a placeholder (e.g., `useChannelComposerState()`), synchronizes with the backend, and passes `{ state, actions }` to the provider.
2. **`ThreadProvider`.**
   - Similar to the channel provider but scoped to thread replies; may inject thread metadata into `state`.
3. **`EditMessageProvider` & `ForwardMessageProvider`.**
   - Use local `useState` (or your actual hooks) to manage message draft, attachments, error status, etc.
   - Pass submit/cancel handlers through `actions`.

### 3.3 Compose Specific Experiences

1. **`ChannelComposer`.**
   ```tsx
   function ChannelComposer() {
     return (
       <ChannelProvider>
         <Composer.Dropzone>
           <Composer.Frame>
             <Composer.Header />
             <Composer.Input />
             <Composer.Footer>
               <Composer.CommonActions />
               <Composer.Submit />
             </Composer.Footer>
           </Composer.Frame>
         </Composer.Dropzone>
       </ChannelProvider>
     )
   }
   ```
   - `Composer.CommonActions` should render shared buttons (attachments, formatting, emoji, mention).
2. **`ThreadComposer`.**
   - Reuse the same shell but inject `Composer.AlsoSendToChannel` inside the frame to surface the thread-specific checkbox.
3. **`EditMessageComposer`.**
   ```tsx
   function EditMessageComposer({ onCancel }) {
     return (
       <EditMessageProvider>
         <Composer.Frame>
           <Composer.Header />
           <Composer.Input />
           <Composer.Footer>
             <Composer.TextFormat />
             <Composer.Emojis />
             <CancelButton onClick={onCancel} />
             <SaveButton />
           </Composer.Footer>
         </Composer.Frame>
       </EditMessageProvider>
     )
   }
   ```
   - Exclude `Composer.Dropzone` to reflect the limited feature set while editing.
4. **`ForwardMessageDialog`.**
   ```tsx
   function ForwardMessageDialog() {
     return (
       <ForwardMessageProvider>
         <Dialog>
           <ForwardMessageComposer />
           <Dialog.Actions>
             <CopyMessageLink />
             <SaveDraftButton />
             <ForwardButton />
           </Dialog.Actions>
         </Dialog>
       </ForwardMessageProvider>
     )
   }
   ```
   - Demonstrates state lifting: `ForwardButton` accesses `actions.submit` through context even though it’s rendered outside `ForwardMessageComposer`.

### 3.4 Add Reflection Notes

- Compare render trees before/after refactor; highlight eliminated conditional branches.
- Call out testing benefits (each piece mockable, state providers swappable).
- Emphasize declarative flexibility: new variants boil down to re-arranging components, not editing a monolith.

## Part 4 · Summary Checklist for the Coding Agent

- [ ] Baseline `UserForm` built and working.
- [ ] Monolithic `UserForm` supports all boolean props and `onlyEditName` path.
- [ ] Anti-pattern `Composer` implemented with boolean props + action arrays, failure documented.
- [ ] Compound `Composer` namespace and context hook created.
- [ ] Scenario-specific providers (channel, thread, edit, forward) wired to `Composer.Provider`.
- [ ] `ChannelComposer`, `ThreadComposer`, `EditMessageComposer`, and `ForwardMessageDialog` composed declaratively.
- [ ] Reflection notes captured (why composition wins, testing implications, future extensibility).

Follow this guide sequentially to reproduce the full narrative from “boolean prop explosion” to “composition is all you need.” EOF

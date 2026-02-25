# AI Log

AI used: Claude AI

Introduction:

I used Claude like a collaborator throughout this project. I did not use it directly in my editor, but would chat with it in a separate window. I would ask questions, but I drove decisions. I pushed back when the AI's suggestions did not feel right and I validated everything before accepting it.

I demonstrate my use of AI with representative examples in this log.

Generated Code:

`youtube-mock-plugin.js` was created by the AI. I wanted to be able to have test scenarios of the API returning 400 or 500 HTTP status codes so that I could test retrying calling the API in failure scenarios. Plus I wanted to not potentially hit a request quota from YouTube. I originally was thinking of creating a separate application to provide this, but AI had the suggestion to use a vite plugin to achieve this. I reviewed the generated code to ensure it did not create anything suspicious (like reaching out to an unknown server). I required the AI to reference YouTube's official API documentation to verify the mock response structure matched the real API.

Code Review:

I would work on code and I would paste what I was working on for review. The AI would catch bugs, often ones that would have cost me time down the road to locate and fix. An instance of this was when I had `hasMore: false` and `loadingMore: false` properties in the SearchController controller instead of `hasMore = false` and `loadingMore = false`.  

It would otherwise make suggestions, but I would make the final call on whether to use its feedback. For example, I questioned its idea of using in the BookmarksController a plain array to store session data when there was already a BookmarksRepository (which uses IndexedDB) data store. It explained that IndexedDB reads asynchronously, but Lit's `render()` is synchronous. We cannot do an `await` in a `render()` , so we cannot read directly from IndexedDB during rendering. The in-memory array is loaded once in the `hostConnected()` and kept in sync with IndexedDB on every `add()` and `remove()` . IndexedDB is the source of truth *across* sessions; the array is the source of truth *during* the session.

Debugging:

AI was an invaluable tool in helping find the cause of bugs in my code. An example of this was I was trying to find out why the focus outline on the video title link was being clipped on the left hand side. The AI identified that the `overflow: hidden` applied to the `#video-title` container that was used to help implement text truncation on the title text was causing the issue. The left side of the focus outline of `<a>` was hidden behind the container's edge. The fix was to move the css rules from the container to the link itself and add some left padding and a negative left margin.  

Learning:

I used Claude AI to research Lit, web components, Shadow DOM, and IndexedDB so that I would be able to complete this code challenge. I would ask for online Lit and MDN documentation links to validate what it was telling me. Of course, proving that its research was right was actually coding it.

Guidance and Research:

Throughout this project I would ask the AI to help with research and for guidance in areas I was less familiar with. The following are some examples. I wanted to know if my UI elements had any accessibility issues and it would assess and provide guidance and explanation for focus styles and keyboard navigation patterns. Also, It showed how to create a shimmer animation effect in CSS for the loading animations. In addition, it helped in my research of what fields were on the API responses and what endpoints I needed to call. I validated accessibility guidance through keyboard testing in the browser, CSS guidance by testing visually, and API behavior by inspecting actual responses in Chrome DevTools.

Conclusion:

During this project, every AI suggestion was treated as a starting point, not a final answer. I tested in the browser, verified against documentation, and made every architectural and implementation decision myself.
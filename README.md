# Next.js Firebase Full Course by **Fireship.io**
Course started in 13/2/2022, started this course to learn more about reactjs, nextjs and firebase in order to create a fullstack web app without too much backend coding myself

Course status: **learning**

---

## Feature
Basic nextjs app with integrated firebase features 
- ⭐ Firestore for storing users data
- ⭐ Firestore auth for authenticating
- 👨‍🎤 Custom Firebase usernames
- 📰 Bot-friendly content (SEO)
- 🦾 Advanced SSR, SSG, and ISR techniques
- 🔥 Firestore realtime CRUD and data modeling
- ⚛️ Reactive forms with react-hook-form
- 📂 Image file uploads

## Basic installations
Check the **[dependencies](package.json)**

Run on *localhost:3000* to test

```bash
    npm run dev
```

---

## [Lessons](https://fireship.io/courses/react-next-firebase)

### [23 Realtime Data Hydration](https://fireship.io/courses/react-next-firebase/ssr-hydration/)
This lesson we going to take the server rendered content then hydrate it to a realtime data feed from the **firestore** database. That mean if the content changes or the heart count changes it will automatically be reflected on the UI

***Keep in mind this is not always required***, and when you do it, it will require an extra document read on the firestore because you have the initial served rendered content and another read on the client side to make it realtime

At the end we will have data either from the server rendered or realtime but it work all the same. With a page that is server rendered and SEO friendly, but also fully interactive and realtime for our end users

### [24 Custom 404 Page](https://fireship.io/courses/react-next-firebase/ssr-404/)
This lesson allow us to handle cases when the server can't find the appropriate data sources

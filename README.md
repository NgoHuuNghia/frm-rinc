# Next.js Firebase Full Course by **Fireship.io**
Course started in 13/2/2022, started this course to learn more about reactjs, nextjs and firebase in order to create a fullstack web app without too much backend coding myself

Course status: **learning**

## IMPORTANT! the video on fireship is from fireship v8 this project and the github source will be in the v9 firebase 

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

example: back in [our user profile page](pages/[username]/index.tsx) there is a possibility that the user for that dynamic route doesn't exist, in which case when we attempt to get the username it will return null. Here we show the 404 page instead and it have a 404 page by default but we will want to customize it [404.tsx](pages/404.tsx)

### [25 Metatags for SEO](https://fireship.io/courses/react-next-firebase/ssr-meta-tags/)
Metatags is important for SEO and sharing contents on social media, for when a bot visit your site it will look for head of the document for things like title and meta tags that give it feature image, description and others fields for it to understand the content of the page

The metadata will ultimately used to display in search engines or when you post a link to social medias sites. Which's component can be found at the [Metatags.tsx](component/../components/Metatags.tsx)

### [26 Admin pages](https://fireship.io/courses/react-next-firebase/admin-auth-guard/)
Now we start building our admin features, or the features that can only be use by authenticated users. First thing first we will not be doing any server side data fetching for these pages, because they are authenticated pages we never need to share them on social media or to be crawled by search engines

That doesn't mean you can't render authenticated content on the server but if you do, you should generally have a good reason for doing so. You can check to documentation for server side authentication in firebase, but we not covering in this course. Also the [authenticate component here](components/AuthCheck.tsx)

The end result is a very efficient way to guard route from *unauthenticated navigation*. What really nice about this is that any component we uses inside of the AuthCheck component will be guaranteed to have access to the current user and it's content, which mean we don't have to do much conditional checking to render different component base on whenever or not we have a user

### [27 Create data with firestore](https://fireship.io/courses/react-next-firebase/admin-create-post/)
This lesson we going to build up the [admin page](pages/admin/index.tsx) file, this page will give the end user all the post they created also provide a form at the bottom which they can create more. **SUPER** important thing to point out is that each *posts document* in the firestore database has a unique id which is a **url friendly slug** like *this-post-is-cool* which is just the post title that is formatted in **kebabcase**.

also install `npm i lodash.kebabcase` to make our slug url friendly

there is also useCollectionData hook from react-firebase-hooks and it will give you the document data from the collection saving us from map it down to the data like bellow, but in this situation you want the full query snapshot to add controls and options to delete a document see `useCollection` in [admin page](pages/admin/index.tsx)

### [28 Post Editing Form](https://fireship.io/courses/react-next-firebase/admin-forms/)
Now that we have a way for a user to create a post, user need a way to edit that content in a markdown format and decide either to publish the post or not. There will be a edit button and preview button before it go live [post control](pages/admin/[slug].tsx)

This page gonna be significantly more complex, to help handle this install this dependency `npm install react-hook-form`. Basically what it does is allow you to treat a form like reactive state in your component, that mean you can watch the value of individual form input and also keep track of whatever or not the entire form itself is valid or invalid. There are many other form lib for react but this is performant and easy to use

### [29 Form Validation](https://fireship.io/courses/react-next-firebase/admin-form-validation/)
React-hook-form library make it easy to implement validation but keep in mind that we implementing here is just client side validation, improving user's experience. It doesn't provide any actual security for you database on the backend, but we will address that in lesson 32 or something

### [30 Image Uploads](https://fireship.io/courses/react-next-firebase/admin-form-validation/)
To build our image upload feature we will model it like a dev too, meaning having you upload an image by selecting a file. When it uploaded will give you a link which then you can paste it into your markdown for the blog

Before we do that, we need to go the firebase console and over to the storage tab. A storage bucket is like a file system in the cloud, where you have different directories and inside those directories you can save individual files, when saving files it is a good idea to associate them to the user who uploaded them. And the easiest way to do that is save that file in a directory which is named with their firebase uid. When a file is uploaded it will automatically generate a download url where it can be access in a web browser, and that download url is what we gonna share with the end user, which component is here

### [31 Hearts, Likes, Claps](https://fireship.io/courses/react-next-firebase/hearts-create/)
To make our post more interactive we would like to add a button for a logged in user to like the post. It will create a many to many relationship where a user can have many post through hearts. Instead of root collection we will be using a sub collection under **post** called *heart* to keep track of all the user that have hearted it. A ***Heart's document*** will have an id that matched the uid who hearted it. This will quickly allow us to determine a user who have already hearted a post, and also let us make *query* all the users who had hearted the post or all the post an individual user had hearted here [the component](components/HeartButton.tsx) btw 

### [32 Backend security](https://fireship.io/courses/react-next-firebase/deploy-security/)
Now that we have a working demo, we have to make it safe a secure to deploy on the internet. The way we do that is by defining rules on the rules tab in the [firebase console](https://console.firebase.google.com/u/0/project/frn-rinc/overview) without rules anybody can read and write any value in our database, which mean our users can modify each other content which is no good.



## Extra lessons
### Version 9 has a redesigned API that supports tree-shaking. Read the [Upgrade Guide](https://firebase.google.com/docs/web/modular-upgrade) to learn more.
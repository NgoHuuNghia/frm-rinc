import Link from 'next/link'
import ReactMarkdown from 'react-markdown' //? use to render a markdown screen to raw html

// UI component for main post content
export default function PostContent({ post }) {
//* createdAt from firestore need to be render at the correct format
//? if it a number format convert it to javascript date otherwise use firestore timestamp to convert it into a date
const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate()

    return (
        <div className="card">
            <h1>{post?.title}</h1>
            <span className="text-sm">
            Written by{' '}
                <Link href={`/${post.username}/`}>
                    <a className="text-info">@{post.username}</a>
                </Link>{' '}
            on {createdAt.toISOString()}
            </span>
            <ReactMarkdown>{post?.content}</ReactMarkdown>
        </div>
    );
}
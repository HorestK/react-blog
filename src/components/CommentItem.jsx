export default function CommentItem({comment}){
    return <div className='border border-gray-400 px-4 py-2 mb-3'>
        <h1 className='mb-2 text-xl bold'>{comment.author}</h1>
        <p>{comment.content}</p>
    </div>
}
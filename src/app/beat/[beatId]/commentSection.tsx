"use client";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import returnProfilePicture from '@/utils/returnUserProfilePicture';
import { AccountCircleIcon } from '@/assets/icons';
import { addComment, deleteComment } from '@/server-actions/beatComment';
import { FormEvent } from 'react';
import { useState } from 'react';
import { BeatDocumentInterface } from '@/types/mongoDocTypes';
import Link from 'next/link';
import { createAssetNotification } from '@/server-actions/notifications';


export default function CommentSection({ beat }: { beat: BeatDocumentInterface }) {
  const { data: session, status } = useSession();
  const [commentField, setCommentField] = useState("");

  const elapsedCommentTime = (date: Date) => {
    dayjs.extend(relativeTime);

    const elapsedTime = dayjs(date);
    return elapsedTime.fromNow();
  }

  const postComment = async (e: FormEvent) => {
    e.preventDefault(); 
    
    await addComment(commentField, beat.id);
    await createAssetNotification("comment", beat.producer._id, beat.urlIdentifier.toString());
    setCommentField("");
  }

  const removeComment = async (commentId: string) => {
    await deleteComment(commentId, beat.id);
  }

  return (
    <>
      <div className="h-[250px] overflow-y-auto border-t border-neutral-700 mt-1 pt-3">
        { !beat.comments.length && <p className='w-full h-full flex items-center justify-center text-sm'>Be the first to comment!</p> }
        { beat.comments.map(comment => (
          <div key={comment._id.toString()} className='flex items-center gap-3 mb-5'>
            <div className='relative h-8 w-8 flex-shrink-0'>
              <Image src={returnProfilePicture(comment.author.profilePicture)} priority fill sizes="w-full h-full" className="object-cover rounded-full" alt="User profile picture" />
            </div>
            <div>
              <div className='flex items-center'>
                <Link href={`/${comment.author.profileUrl}`} className='text-orange-500 font-semibold text-base'>{comment.author.userName}</Link>
                <span className='ml-3 text-xs text-neutral-500 '>• {elapsedCommentTime(comment.date)}</span>
                { comment.author._id === beat.producer._id && <p className="cursor-pointer text-sm font-semibold ml-6">Author</p> }
                { comment.author._id === session?.user.id && <p onClick={() => removeComment(comment._id)} className="text-red-400 cursor-pointer text-sm font-semibold ml-6">remove</p> }
              </div>
              <p className='text-sm'>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex pt-3 border-t border-neutral-700">
        <div className={`relative h-8 w-8`}>
          { status === "authenticated" ?
            <Image src={returnProfilePicture(session?.user.image)} priority fill sizes="w-full h-full" className="object-cover rounded-full" alt="User profile picture" /> :
            <AccountCircleIcon className="h-full w-full" />
          }
        </div>
        <form className='flex justify-between gap-3 w-4/6 ml-3 flex-grow' onSubmit={(e) => postComment(e)}>
          <input 
            className="self-center bg-transparent border-b border-neutral-700 outline-none w-4/6 text-sm placeholder:text-sm" 
            placeholder="leave a comment..." 
            type="text" 
            required
            value={commentField}
            onChange={(e) => setCommentField(e.target.value)}
          />
          <button className="default-orange-button text-sm self-center px-3 py-1">Comment</button>
        </form>
      </div>
    </>
  )
}

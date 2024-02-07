"use client";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';


export default function CommentSection() {
  const elapsedCommentTime = (date: Date) => {
    dayjs.extend(relativeTime);

    const elapsedTime = dayjs(date);
    return elapsedTime.fromNow();
  }

  return (
    <div className='h-[250px] overflow-y-auto'>
      
    </div>
  )
}

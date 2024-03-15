import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';


const getElapsedTime = (date: Date) => {
  dayjs.extend(relativeTime);

  const elapsedTime = dayjs(date);
  
  return elapsedTime.fromNow();
}

export default getElapsedTime;
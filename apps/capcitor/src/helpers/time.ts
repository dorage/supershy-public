import moment from 'moment';
import _ from './fp';

const xFromNow = (date: string) => {
  return moment(date).utc(true).fromNow();
};

const getNextPollDate = () => {
  const now = moment(Date.now()).utc(false);

  if (now.hour() >= 8) {
    return moment(`${now.year()}-${now.month() + 1}-${now.date() + 1} 8:00 GMT+0000`).utc(false);
  }
  return moment(`${now.year()}-${now.month() + 1}-${now.date()} 8:00  GMT+0000`).utc(false);
};

const getNextDateCount = () => {
  // Get today's date and time
  const now = new Date().getTime();

  // Find the distance between now and the count down date
  const distance = moment(getNextPollDate()).diff(moment(Date.now()));

  // Time calculations for days, hours, minutes and seconds
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return {
    hours: _.zfill(hours, 1),
    minutes: _.zfill(minutes, 2),
    seconds: _.zfill(seconds, 2),
  };
};

const Time = { xFromNow, getNextPollDate, getNextDateCount };

export default Time;

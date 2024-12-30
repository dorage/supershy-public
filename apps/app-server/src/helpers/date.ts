import moment from 'moment';

// voting time
// Jakarta UTC+7 - 16pm - 14pm (+1)
// Server UTC+0 - 9am - 7am (+1)

// make ready time
// Jakarta UTC+7 - 14pm - 16pm
// Server UTC+0 - 7am - 9am

const parsePollDate = (d: moment.Moment) => {
  const m = moment(d).utc(false);

  const year = m.year();
  const month = m.month() + 1;
  const date = m.date();

  return `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
};

const getPollDate = (add: number = 0) => {
  const now = moment().utc(false).add(add, 'd');

  if (now.hour() < 9) {
    return parsePollDate(now.add(-1, 'd'));
  }

  return parsePollDate(now);
};

const isRedayTime = () => {
  const now = moment().utc(false);

  const hour = now.hour();

  return hour >= 7 && hour < 9;
};

export const dateHelpers = {
  getPollDate,
  isRedayTime,
};

const splash = '/';
const signin = '/signin';
const logout = '/logout';
const poll = '/poll';
const community = '/community';
const notification = '/notification';
const profile = '/profile';
const school = '/school';
const shop = '/shop';
const setting = '/setting';
const inquiry = '/inquiry';
const grade = '/grade';
const checkRegistration = '/check-registration';
const premium = '/premium';
const phone = '/phone';
const all = '*';

const create = '/create';
const join = '/join';
const vote = '/vote';
const win = '/win';
const pending = '/pending';
const detail = '/:id';
const register = '/register';
const result = '/result';
const edit = '/edit';
const google = '/google';
const apple = '/apple';
const callback = '/callback';
const mock = '/mock';

const routes = {
  splash,
  signin: {
    index: signin,
    google: {
      callback: signin + google + callback,
    },
    apple: {
      callback: signin + apple + callback,
    },
  },
  poll: {
    index: poll,
    detail: poll + detail,
    result: poll + detail + result,
    vote: poll + vote,
    win: poll + win,
    mock: poll + mock,
  },
  phone: {
    edit: phone + edit,
  },
  checkRegistration,
  community: {
    index: community,
    mock: community + mock,
  },
  notification,
  profile: {
    register: profile + register,
    index: profile,
    edit: profile + edit,
  },
  school: {
    register: school + register,
    edit: school + edit,
    detail: school + detail,
    pending: school + pending,
    grade: {
      register: school + grade + register,
    },
  },
  shop,
  setting: {
    index: setting,
    inquiry: setting + inquiry,
    logout: setting + logout,
  },
  premium: {
    create: premium + create,
    join: premium + join,
  },
  all,
};

export default routes;

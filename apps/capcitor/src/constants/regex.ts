const SEARCH_TERM = (term: string) => new RegExp(`.+${term}.+`, 'g');

const Regex = { SEARCH_TERM };

export default Regex;

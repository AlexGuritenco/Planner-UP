import jetPaths from 'jet-paths';

const Paths = {
  _: '/api',
  Users: {
    _: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Auth: {
    _: '/auth',
  },
  Tasks: {
    _: '/tasks',
  },
  Account: {
    _: '/account',
  },
} as const;

export const JetPaths = jetPaths(Paths);
export default Paths;

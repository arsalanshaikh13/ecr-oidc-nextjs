export function can(user: User, action: string) {
  if (!user.permissions.includes(action)) {
    return false;
  }
  return true;
}

export function getCurrentAuthority() {
  return ["admin", ""];
}

export function check(authority) {
  console.log(authority);
  const current = getCurrentAuthority();
  return current.some(item => authority.includes(item));
}

export function isLogin() {
  const current = getCurrentAuthority();
  return current && current[0] !== "guest";
}
